import { ParsedConfig } from "../graph/astToGraph";
import { matchServerBlock } from "./matchServerBlock";
import { matchLocationBlock } from "./matchLocationBlock";
import { upstreamBalancer } from "./upstreamBalancer";

export type HeaderState = Record<string, string>;

export type SimulationStep =
    | { type: "TRAVEL"; from: string; to: string; protocol: string; headers: HeaderState }
    | { type: "SERVER_MATCH"; trace: any }
    | { type: "LOCATION_MATCH"; trace: any }
    | { type: "HEADER_MUTATION"; addedBy: "nginx" | "backend"; diffs: { name: string; value?: string; action: "add" | "set" | "remove" }[] }
    | { type: "FILESYSTEM_CHECK"; path: string; found: boolean; triedFiles?: string[] }
    | { type: "CACHE_CHECK"; layer: "browser" | "nginx-proxy" | "backend-app"; result: "HIT" | "MISS" | "BYPASS" }
    | { type: "UPSTREAM_SELECT"; upstream: string; chosenServer: string; method: string }
    | { type: "REWRITE"; from: string; to: string; kind: "return" | "rewrite"; statusCode?: number }
    | { type: "LOG_WRITE"; log: "access_log" | "error_log"; line: string; sourceLine?: number }
    | { type: "RESPONSE"; statusCode: number }
    | { type: "COMPRESSION"; algorithm: "gzip" | "br" | "none"; ratio?: number };

function initHeaders(request: { method: string; host: string; port: number; path: string }): HeaderState {
    return { Host: request.host, Method: request.method, Path: request.path };
}

function pseudoRandomCacheResult() {
    return Math.random() < 0.5 ? "HIT" : "MISS";
}

function extractUpstreamName(target: string, upstreams: Record<string, any>): string | null {
    if (!target) return null;
    // nginx upstream reference is usually like http://backend
    const m = target.match(/^(?:https?:)?\/\/(.+?)(?:\/.+)?$/);
    if (!m) return null;
    const name = m[1];
    return upstreams[name] ? name : null;
}

export function simulate(ast: ParsedConfig, request: { method: string; host: string; port: number; path: string }): SimulationStep[] {
    const steps: SimulationStep[] = [];
    const headers = initHeaders(request);

    const browserCache = pseudoRandomCacheResult() as "HIT" | "MISS";
    steps.push({ type: "CACHE_CHECK", layer: "browser", result: browserCache });
    if (browserCache === "HIT") {
        steps.push({ type: "LOG_WRITE", log: "access_log", line: `${request.method} ${request.path} 200 (browser cache)` });
        steps.push({ type: "RESPONSE", statusCode: 200 });
        return steps;
    }

    steps.push({ type: "TRAVEL", from: "client", to: "docker-host", protocol: "HTTP/1.1", headers: { ...headers } });
    steps.push({ type: "TRAVEL", from: "docker-host", to: "nginx-container", protocol: "HTTP/1.1", headers: { ...headers } });

    const serverTrace = matchServerBlock(request.host, request.port, ast.servers);
    steps.push({ type: "SERVER_MATCH", trace: serverTrace });
    const server = serverTrace.winner;

    if (!server) {
        steps.push({ type: "LOG_WRITE", log: "error_log", line: `No server listening on port ${request.port}` });
        steps.push({ type: "RESPONSE", statusCode: 404 });
        return steps;
    }

    const locationTrace = matchLocationBlock(request.path, server.locations);
    steps.push({ type: "LOCATION_MATCH", trace: locationTrace });
    const loc = locationTrace.winner;

    if (!loc) {
        steps.push({ type: "LOG_WRITE", log: "error_log", line: `no location for ${request.path}` });
        steps.push({ type: "RESPONSE", statusCode: 404 });
        return steps;
    }

    // handle return
    const ret = loc.directives["return"];
    if (ret) {
        const [code, target] = ret;
        steps.push({ type: "REWRITE", from: request.path, to: target ?? "", kind: "return", statusCode: Number(code) });
        steps.push({ type: "TRAVEL", from: "nginx-container", to: "client", protocol: "HTTP/1.1", headers: { ...headers } });
        steps.push({ type: "LOG_WRITE", log: "access_log", line: `${request.method} ${request.path} ${code}`, sourceLine: loc.sourceLine });
        steps.push({ type: "RESPONSE", statusCode: Number(code) });
        return steps;
    }

    // handle rewrite
    if (loc.rewrites && loc.rewrites.length > 0) {
        const rw = loc.rewrites[0];
        const statusCode = rw.flag === "permanent" ? 301 : (rw.flag === "redirect" ? 302 : 302);
        steps.push({ type: "REWRITE", from: request.path, to: rw.replacement, kind: "rewrite", statusCode });
        if (rw.flag === "permanent" || rw.flag === "redirect") {
            steps.push({ type: "TRAVEL", from: "nginx-container", to: "client", protocol: "HTTP/1.1", headers: { ...headers } });
            steps.push({ type: "LOG_WRITE", log: "access_log", line: `${request.method} ${request.path} ${statusCode}`, sourceLine: loc.sourceLine });
            steps.push({ type: "RESPONSE", statusCode });
            return steps;
        }
    }

    // proxy_set_header mutations
    if (loc.proxySetHeaders && loc.proxySetHeaders.length) {
        steps.push({ type: "HEADER_MUTATION", addedBy: "nginx", diffs: loc.proxySetHeaders.map((h: any) => ({ name: h.name, value: h.value, action: "add" })) });
        for (const h of loc.proxySetHeaders) headers[h.name] = h.value;
    }

    // proxy_cache
    if (loc.directives["proxy_cache"]) {
        const proxyCache = pseudoRandomCacheResult() as "HIT" | "MISS";
        steps.push({ type: "CACHE_CHECK", layer: "nginx-proxy", result: proxyCache });
        if (proxyCache === "HIT") {
            steps.push({ type: "TRAVEL", from: "nginx-container", to: "docker-host", protocol: "HTTP/1.1", headers });
            steps.push({ type: "TRAVEL", from: "docker-host", to: "client", protocol: "HTTP/1.1", headers });
            steps.push({ type: "LOG_WRITE", log: "access_log", line: `${request.method} ${request.path} 200 (nginx proxy cache)`, sourceLine: loc.sourceLine });
            steps.push({ type: "RESPONSE", statusCode: 200 });
            return steps;
        }
    }

    if (loc.directives["fastcgi_pass"]) {
        steps.push({ type: "TRAVEL", from: "nginx-container", to: "php-fpm", protocol: "FastCGI", headers });
        steps.push({ type: "TRAVEL", from: "php-fpm", to: "php-worker", protocol: "FastCGI (internal)", headers });
        if (loc.directives["try_files"]) {
            steps.push({ type: "FILESYSTEM_CHECK", path: request.path, found: true, triedFiles: loc.directives["try_files"] });
        }
        const backendCache = pseudoRandomCacheResult() as "HIT" | "MISS";
        steps.push({ type: "CACHE_CHECK", layer: "backend-app", result: backendCache });
        steps.push({ type: "TRAVEL", from: "php-worker", to: "php-fpm", protocol: "FastCGI", headers });
        steps.push({ type: "TRAVEL", from: "php-fpm", to: "nginx-container", protocol: "FastCGI", headers });
    } else if (loc.directives["proxy_pass"]) {
        const target = loc.directives["proxy_pass"][0];
        const upstreamName = extractUpstreamName(target, ast.upstreams);
        if (upstreamName) {
            const chosen = upstreamBalancer(ast.upstreams[upstreamName]);
            steps.push({ type: "UPSTREAM_SELECT", upstream: upstreamName, chosenServer: chosen, method: ast.upstreams[upstreamName].method });
            steps.push({ type: "TRAVEL", from: "nginx-container", to: chosen, protocol: "HTTP/1.0", headers });
            steps.push({ type: "CACHE_CHECK", layer: "backend-app", result: pseudoRandomCacheResult() as any });
            steps.push({ type: "TRAVEL", from: chosen, to: "nginx-container", protocol: "HTTP/1.0", headers });
        } else {
            steps.push({ type: "TRAVEL", from: "nginx-container", to: "backend-app", protocol: "HTTP/1.0", headers });
            steps.push({ type: "CACHE_CHECK", layer: "backend-app", result: pseudoRandomCacheResult() as any });
            steps.push({ type: "TRAVEL", from: "backend-app", to: "nginx-container", protocol: "HTTP/1.0", headers });
        }
    } else if (loc.directives["root"] || loc.directives["try_files"]) {
        steps.push({ type: "FILESYSTEM_CHECK", path: (loc.directives["root"]?.[0] ?? server.root ?? "") + request.path, found: true });
    }

    // add_header
    const addHeaderDirectives = loc.directives["add_header"];
    if (addHeaderDirectives) {
        steps.push({ type: "HEADER_MUTATION", addedBy: "nginx", diffs: [{ name: addHeaderDirectives[0], value: addHeaderDirectives[1], action: "add" }] });
    }

    // compression
    if (ast.http.gzip === "on") {
        steps.push({ type: "COMPRESSION", algorithm: "gzip", ratio: 0.7 });
    }

    steps.push({ type: "TRAVEL", from: "nginx-container", to: "docker-host", protocol: "HTTP/1.1", headers });
    steps.push({ type: "TRAVEL", from: "docker-host", to: "client", protocol: "HTTP/1.1", headers });

    steps.push({ type: "LOG_WRITE", log: "access_log", line: `${request.method} ${request.path} 200`, sourceLine: loc.sourceLine });
    steps.push({ type: "RESPONSE", statusCode: 200 });

    return steps;
}
