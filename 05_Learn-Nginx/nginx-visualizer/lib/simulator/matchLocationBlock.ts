import { LocationBlock } from "../graph/astToGraph";

export interface LocationMatchStep { location: LocationBlock; verdict: "exact-hit" | "prefix-candidate" | "regex-tested" | "regex-hit" | "skipped"; note: string }
export interface LocationMatchTrace { steps: LocationMatchStep[]; winner: LocationBlock | null }

export function matchLocationBlock(uri: string, locations: LocationBlock[]): LocationMatchTrace {
    const steps: LocationMatchStep[] = [];

    const exact = locations.find(l => l.matchType === "exact" && l.pattern === uri);
    if (exact) {
        steps.push({ location: exact, verdict: "exact-hit", note: `"=" exact match — evaluation stops here` });
        return { steps, winner: exact };
    }

    const prefixCandidates = locations
        .filter(l => (l.matchType === "prefix" || l.matchType === "prefix-priority") && uri.startsWith(l.pattern))
        .sort((a, b) => b.pattern.length - a.pattern.length);

    prefixCandidates.forEach(l => steps.push({ location: l, verdict: "prefix-candidate", note: `Prefix "${l.pattern}" matches, length ${l.pattern.length}` }));

    const longestPrefix = prefixCandidates[0];
    if (longestPrefix?.matchType === "prefix-priority") {
        steps.push({ location: longestPrefix, verdict: "regex-hit", note: `"^~" on longest prefix — regex locations are skipped` });
        return { steps, winner: longestPrefix };
    }

    for (const l of locations.filter(l => l.matchType === "regex" || l.matchType === "regex-case-insensitive")) {
        const flags = l.matchType === "regex-case-insensitive" ? "i" : "";
        const hit = new RegExp(l.pattern, flags).test(uri);
        steps.push({ location: l, verdict: hit ? "regex-hit" : "regex-tested", note: hit ? `Regex "${l.pattern}" matched — first match wins` : `Regex "${l.pattern}" did not match` });
        if (hit) return { steps, winner: l };
    }

    return { steps, winner: longestPrefix ?? null };
}
