import { Node } from "../parser/ast-types";

export type ServerBlock = {
    id: string;
    listen: { port: number; host?: string; ssl?: boolean; default_server?: boolean }[];
    serverNames: string[];
    locations: LocationBlock[];
    root?: string;
    sourceLine: number;
};

export type LocationBlock = {
    id: string;
    matchType: "exact" | "prefix" | "regex" | "regex-case-insensitive" | "prefix-priority";
    pattern: string;
    raw: string;
    directives: Record<string, string[]>;
    proxySetHeaders: { name: string; value: string }[];
    rewrites: { pattern: string; replacement: string; flag?: string }[];
    sourceLine: number;
};

export type UpstreamBlock = {
    id: string;
    name: string;
    servers: { address: string; weight?: number; maxFails?: number; backup?: boolean }[];
    method: "round-robin" | "least_conn" | "ip_hash";
};

export type ParsedConfig = {
    servers: ServerBlock[];
    upstreams: Record<string, UpstreamBlock>;
    http: { gzip?: "on" | "off" };
};

function idFromLine(prefix: string, line: number) {
    return `${prefix}-${line}`;
}

export function normalize(nodes: Node[]): ParsedConfig {
    const servers: ServerBlock[] = [];
    const upstreams: Record<string, UpstreamBlock> = {};
    const http: { gzip?: "on" | "off" } = {};

    function asDirectiveArgs(n: Node) {
        if (n.kind === "directive") return n.args;
        return [];
    }

    for (const n of nodes) {
        if (n.kind === "block" && n.name === "http") {
            // scan http children for gzip/upstream/server
            for (const c of n.children) {
                if (c.kind === "directive" && c.name === "gzip") {
                    http.gzip = c.args[0] as any;
                }
                if (c.kind === "block" && c.name === "upstream") {
                    const name = c.args[0] ?? idFromLine("upstream", c.line);
                    const ub: UpstreamBlock = { id: idFromLine("upstream", c.line), name, servers: [], method: "round-robin" };
                    for (const s of c.children) {
                        if (s.kind === "directive" && s.name === "server") {
                            ub.servers.push({ address: s.args[0] });
                        }
                    }
                    upstreams[ub.name] = ub;
                }
                if (c.kind === "block" && c.name === "server") {
                    const sb: ServerBlock = { id: idFromLine("server", c.line), listen: [], serverNames: [], locations: [], sourceLine: c.line };
                    for (const d of c.children) {
                        if (d.kind === "directive" && d.name === "listen") {
                            const arg = d.args[0] ?? "80";
                            const port = Number(arg) || 80;
                            sb.listen.push({ port });
                        }
                        if (d.kind === "directive" && d.name === "server_name") {
                            sb.serverNames.push(...d.args);
                        }
                        if (d.kind === "directive" && d.name === "root") {
                            sb.root = d.args[0];
                        }
                        if (d.kind === "block" && d.name === "location") {
                            const raw = d.args.join(" ");
                            let matchType: LocationBlock["matchType"] = "prefix";
                            let pattern = raw;
                            if (d.args[0] === "=") {
                                matchType = "exact"; pattern = d.args[1] ?? "";
                            } else if (d.args[0] === "~") {
                                matchType = "regex"; pattern = d.args[1] ?? "";
                            } else if (d.args[0] === "~*") {
                                matchType = "regex-case-insensitive"; pattern = d.args[1] ?? "";
                            } else if (d.args[0] === "^~") {
                                matchType = "prefix-priority"; pattern = d.args[1] ?? "";
                            } else {
                                matchType = "prefix"; pattern = d.args[0] ?? "";
                            }

                            const directives: Record<string, string[]> = {};
                            const proxySetHeaders: { name: string; value: string }[] = [];
                            const rewrites: { pattern: string; replacement: string; flag?: string }[] = [];
                            for (const e of d.children) {
                                if (e.kind === "directive") {
                                    directives[e.name] = e.args;
                                    if (e.name === "proxy_set_header") {
                                        proxySetHeaders.push({ name: e.args[0], value: e.args[1] ?? "" });
                                    }
                                    if (e.name === "rewrite") {
                                        rewrites.push({ pattern: e.args[0], replacement: e.args[1], flag: e.args[2] });
                                    }
                                }
                            }

                            const lb: LocationBlock = {
                                id: idFromLine("location", d.line),
                                matchType,
                                pattern,
                                raw,
                                directives,
                                proxySetHeaders,
                                rewrites,
                                sourceLine: d.line,
                            };
                            sb.locations.push(lb);
                        }
                    }
                    servers.push(sb);
                }
            }
        } else if (n.kind === "block" && n.name === "upstream") {
            const name = n.args[0] ?? idFromLine("upstream", n.line);
            const ub: UpstreamBlock = { id: idFromLine("upstream", n.line), name, servers: [], method: "round-robin" };
            for (const s of n.children) {
                if (s.kind === "directive" && s.name === "server") ub.servers.push({ address: s.args[0] });
            }
            upstreams[ub.name] = ub;
        } else if (n.kind === "block" && n.name === "server") {
            // top-level server (no http wrapper)
            const sb: ServerBlock = { id: idFromLine("server", n.line), listen: [], serverNames: [], locations: [], sourceLine: n.line };
            for (const d of n.children) {
                if (d.kind === "directive" && d.name === "listen") {
                    const arg = d.args[0] ?? "80";
                    const port = Number(arg) || 80;
                    sb.listen.push({ port });
                }
                if (d.kind === "directive" && d.name === "server_name") sb.serverNames.push(...d.args);
                if (d.kind === "directive" && d.name === "root") sb.root = d.args[0];
                if (d.kind === "block" && d.name === "location") {
                    const raw = d.args.join(" ");
                    let matchType: LocationBlock["matchType"] = "prefix";
                    let pattern = raw;
                    if (d.args[0] === "=") {
                        matchType = "exact"; pattern = d.args[1] ?? "";
                    } else if (d.args[0] === "~") {
                        matchType = "regex"; pattern = d.args[1] ?? "";
                    } else if (d.args[0] === "~*") {
                        matchType = "regex-case-insensitive"; pattern = d.args[1] ?? "";
                    } else if (d.args[0] === "^~") {
                        matchType = "prefix-priority"; pattern = d.args[1] ?? "";
                    } else {
                        matchType = "prefix"; pattern = d.args[0] ?? "";
                    }
                    const directives: Record<string, string[]> = {};
                    const proxySetHeaders: { name: string; value: string }[] = [];
                    const rewrites: { pattern: string; replacement: string; flag?: string }[] = [];
                    for (const e of d.children) {
                        if (e.kind === "directive") {
                            directives[e.name] = e.args;
                            if (e.name === "proxy_set_header") proxySetHeaders.push({ name: e.args[0], value: e.args[1] ?? "" });
                            if (e.name === "rewrite") rewrites.push({ pattern: e.args[0], replacement: e.args[1], flag: e.args[2] });
                        }
                    }
                    const lb: LocationBlock = { id: idFromLine("location", d.line), matchType, pattern, raw, directives, proxySetHeaders, rewrites, sourceLine: d.line };
                    sb.locations.push(lb);
                }
            }
            servers.push(sb);
        }
    }

    return { servers, upstreams, http };
}

export function astToGraph(parsed: ParsedConfig) {
    const nodes: any[] = [
        { id: "client", label: "Client (Browser)", x: 40, y: 150 },
        { id: "docker-host", label: "Docker Host", x: 260, y: 150 },
        { id: "nginx-container", label: "NGINX Container", x: 480, y: 150 },
    ];

    const edges: any[] = [
        { id: "client-docker-host", from: "client", to: "docker-host", x1: 200, y1: 150, x2: 260, y2: 150, protocol: "HTTP/1.1" },
        { id: "docker-host-nginx-container", from: "docker-host", to: "nginx-container", x1: 420, y1: 150, x2: 480, y2: 150, protocol: "HTTP/1.1" },
    ];

    let hasPhp = false;
    let hasBackend = false;
    let customUpstreams: string[] = [];

    for (const s of parsed.servers) {
        for (const l of s.locations) {
            if (l.directives["fastcgi_pass"]) hasPhp = true;
            if (l.directives["proxy_pass"]) {
                const target = l.directives["proxy_pass"][0];
                const m = target?.match(/^(?:https?:)?\/\/(.+?)(?:\/.+)?$/);
                if (m && parsed.upstreams[m[1]]) {
                    if (!customUpstreams.includes(m[1])) customUpstreams.push(m[1]);
                } else {
                    hasBackend = true;
                }
            }
        }
    }

    let nextY = 40;

    if (hasPhp) {
        nodes.push({ id: "php-fpm", label: "PHP-FPM", x: 700, y: nextY });
        nodes.push({ id: "php-worker", label: "PHP Worker", x: 920, y: nextY });
        edges.push({ id: "nginx-container-php-fpm", from: "nginx-container", to: "php-fpm", x1: 640, y1: nextY, x2: 700, y2: nextY, protocol: "FastCGI" });
        edges.push({ id: "php-fpm-php-worker", from: "php-fpm", to: "php-worker", x1: 860, y1: nextY, x2: 920, y2: nextY, protocol: "FastCGI (internal)" });
        nextY += 120;
    }

    if (hasBackend) {
        nodes.push({ id: "backend-app", label: "Backend App", x: 700, y: nextY });
        edges.push({ id: "nginx-container-backend-app", from: "nginx-container", to: "backend-app", x1: 640, y1: nextY, x2: 700, y2: nextY, protocol: "HTTP/1.0" });
        nextY += 120;
    }

    for (const up of customUpstreams) {
        const u = parsed.upstreams[up];
        u.servers.forEach((srv, i) => {
            const id = srv.address;
            nodes.push({ id, label: `Upstream: ${id}`, x: 700, y: nextY });
            edges.push({ id: `nginx-container-${id}`, from: "nginx-container", to: id, x1: 640, y1: nextY, x2: 700, y2: nextY, protocol: "HTTP/1.0" });
            nextY += 100;
        });
    }

    return { nodes, edges };
}

