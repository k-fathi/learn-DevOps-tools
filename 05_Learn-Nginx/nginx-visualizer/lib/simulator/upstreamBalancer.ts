import { UpstreamBlock } from "../graph/astToGraph";

const rrState: Record<string, number> = {};

export function upstreamBalancer(up: UpstreamBlock): string {
    if (!up.servers || up.servers.length === 0) return "";
    const idx = rrState[up.name] ?? 0;
    const chosen = up.servers[idx % up.servers.length].address;
    rrState[up.name] = (idx + 1) % up.servers.length;
    return chosen;
}
