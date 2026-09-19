import { ServerBlock } from "../graph/astToGraph";

export interface ServerMatchCandidate { server: ServerBlock; reason: string; eliminated: boolean }
export interface ServerMatchTrace { candidates: ServerMatchCandidate[]; winner: ServerBlock | null; matchStage: string }

function longestMatchLen(s: ServerBlock, host: string) {
    return Math.max(...s.serverNames.filter(n => n.startsWith("*.") && host.endsWith(n.slice(1))).map(n => n.length), 0);
}

export function matchServerBlock(host: string, port: number, servers: ServerBlock[]): ServerMatchTrace {
    const candidates = servers.filter(s => s.listen.some(l => l.port === port));
    const trace: ServerMatchCandidate[] = candidates.map(s => ({ server: s, reason: "", eliminated: true }));

    const mark = (s: ServerBlock, reason: string) => {
        const row = trace.find(t => t.server.id === s.id)!;
        row.reason = reason; row.eliminated = false;
    };

    if (candidates.length === 0) return { candidates: trace, winner: null, matchStage: "none" };

    // exact
    const exact = candidates.find(s => s.serverNames.includes(host));
    if (exact) { mark(exact, `Exact match on server_name "${host}"`); return { candidates: trace, winner: exact, matchStage: "exact" }; }

    // leading wildcard
    const leadingWild = candidates
        .filter(s => s.serverNames.some(n => n.startsWith("*.") && host.endsWith(n.slice(1))))
        .sort((a, b) => longestMatchLen(b, host) - longestMatchLen(a, host))[0];
    if (leadingWild) { mark(leadingWild, `Wildcard match ("*.")`); return { candidates: trace, winner: leadingWild, matchStage: "wildcard-prefix" }; }

    // trailing wildcard
    const trailingWild = candidates.find(s => s.serverNames.some(n => n.endsWith(".*") && host.startsWith(n.slice(0, -2))));
    if (trailingWild) { mark(trailingWild, `Wildcard match (trailing "*")`); return { candidates: trace, winner: trailingWild, matchStage: "wildcard-suffix" }; }

    // regex
    const regexMatch = candidates.find(s => s.serverNames.some(n => n.startsWith("~") && new RegExp(n.slice(1)).test(host)));
    if (regexMatch) { mark(regexMatch, `Regex server_name match`); return { candidates: trace, winner: regexMatch, matchStage: "regex" }; }

    // default
    const def = candidates.find(s => s.listen.some(l => l.default_server)) ?? candidates[0];
    mark(def, def.listen.some(l => l.default_server) ? "Marked default_server" : "First matching listen block (implicit default)");
    return { candidates: trace, winner: def, matchStage: def.listen.some(l => l.default_server) ? "default_server" : "first-listen" };
}
