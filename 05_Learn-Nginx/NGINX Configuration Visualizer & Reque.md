# NGINX Configuration Visualizer & Request Simulator
### Architecture, Parser Design & Core Components

---

## 1. Tech Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router, client components) | File-based routing, easy static export if needed, RSC not required here since it's all interactive client state |
| Graph/Canvas | **React Flow (@xyflow/react)** | Purpose-built for node/edge diagrams with custom nodes, zoom/pan, and programmatic edge animation — much less work than raw D3 for this use case |
| Animation | **Framer Motion** | Drives the "packet" moving along an SVG path, header panel transitions, cache HIT/MISS pulses |
| Code Editor | **Monaco Editor** (`@monaco-editor/react`) w/ a custom `nginx` language definition | Syntax highlighting, line-error markers from the parser |
| State | **Zustand** | Global store for parsed AST, simulation state machine, header timeline — simpler than Redux for this scope |
| Parser | Custom hand-written recursive-descent parser (see §3) | NGINX config syntax isn't context-free-friendly enough for a generic grammar library to be worth the dependency weight; a ~300-line parser is more maintainable |
| Styling | Tailwind CSS + shadcn/ui | Fast to build the Header Inspector, split-pane, and control panels |
| Split pane | `react-resizable-panels` | Left editor / right canvas |

---

## 2. Project Structure

```
nginx-visualizer/
├── app/
│   ├── layout.tsx
│   └── page.tsx                     # Split-pane shell
├── components/
│   ├── editor/
│   │   ├── ConfigEditor.tsx         # Monaco wrapper
│   │   └── nginx-language.ts        # Monaco language def (tokens, folding)
│   ├── canvas/
│   │   ├── VisualizerCanvas.tsx     # React Flow root
│   │   ├── nodes/
│   │   │   ├── ClientNode.tsx
│   │   │   ├── DockerHostNode.tsx   # group node containing NGINX + backends
│   │   │   ├── NginxContainerNode.tsx
│   │   │   ├── ServerBlockNode.tsx
│   │   │   ├── LocationBlockNode.tsx
│   │   │   ├── UpstreamNode.tsx
│   │   │   ├── PhpFpmNode.tsx
│   │   │   ├── PhpWorkerNode.tsx
│   │   │   ├── BackendAppNode.tsx
│   │   │   ├── FileSystemNode.tsx
│   │   │   └── LogNode.tsx
│   │   ├── edges/
│   │   │   ├── ProtocolEdge.tsx     # custom edge, label = protocol, color-coded
│   │   │   └── edgeStyles.ts
│   │   └── PacketAnimator.tsx       # Framer Motion overlay, moves dot along active edge path
│   ├── simulator/
│   │   ├── SimulateRequestBar.tsx   # URL input + "Simulate" button
│   │   ├── SimulationEngine.ts      # pure logic, no React — see §5
│   │   ├── matchServerBlock.ts
│   │   ├── matchLocationBlock.ts
│   │   ├── upstreamBalancer.ts
│   │   └── stepSequencer.ts         # turns SimulationResult into an ordered list of animation "steps"
│   ├── inspector/
│   │   ├── HeaderInspectorPanel.tsx
│   │   ├── HeaderDiffRow.tsx
│   │   └── CacheStatusBadge.tsx
│   ├── logs/
│   │   └── LogStreamPanel.tsx
│   └── controls/
│       └── PlaybackControls.tsx     # step forward/back, play, speed
├── lib/
│   ├── parser/
│   │   ├── tokenizer.ts
│   │   ├── parser.ts                # recursive descent -> AST
│   │   ├── ast-types.ts
│   │   └── validate.ts              # semantic checks (dup listen, unknown directives)
│   ├── graph/
│   │   └── astToGraph.ts            # AST -> React Flow nodes/edges
│   └── store/
│       ├── configStore.ts           # Zustand: raw text, AST, parse errors
│       └── simulationStore.ts       # Zustand: current step, header timeline, cache state
├── styles/
└── public/
    └── sample-configs/
        ├── static-site.conf
        ├── php-fpm.conf
        ├── reverse-proxy-lb.conf
        └── redirects-rewrites.conf
```

---

## 3. Parser Design

NGINX config is a nested block/directive language:

```
directive_name arg1 arg2 ...;
block_name arg { ... nested directives/blocks ... }
```

### 3.1 Tokenizer (`tokenizer.ts`)

Stream the raw text into tokens: `WORD`, `STRING` (quoted), `LBRACE`, `RBRACE`, `SEMI`, `COMMENT`. Track line/column on every token — required later for Monaco error markers and "jump to source line" when a user clicks a node.

```ts
export type TokenType = "WORD" | "STRING" | "LBRACE" | "RBRACE" | "SEMI" | "EOF";

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  col: number;
}

export function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0, line = 1, col = 1;
  const advance = (n = 1) => { for (let k = 0; k < n; k++) { if (src[i] === "\n") { line++; col = 1; } else col++; i++; } };

  while (i < src.length) {
    const c = src[i];

    if (c === " " || c === "\t" || c === "\n" || c === "\r") { advance(); continue; }

    if (c === "#") { while (i < src.length && src[i] !== "\n") advance(); continue; }

    if (c === "{") { tokens.push({ type: "LBRACE", value: "{", line, col }); advance(); continue; }
    if (c === "}") { tokens.push({ type: "RBRACE", value: "}", line, col }); advance(); continue; }
    if (c === ";") { tokens.push({ type: "SEMI", value: ";", line, col }); advance(); continue; }

    if (c === '"' || c === "'") {
      const quote = c; const startLine = line, startCol = col;
      let val = ""; advance();
      while (i < src.length && src[i] !== quote) {
        if (src[i] === "\\" && i + 1 < src.length) { val += src[i + 1]; advance(2); continue; }
        val += src[i]; advance();
      }
      advance(); // closing quote
      tokens.push({ type: "STRING", value: val, line: startLine, col: startCol });
      continue;
    }

    // bare word: stop at whitespace / { } ; #
    const startLine = line, startCol = col;
    let val = "";
    while (i < src.length && !/[\s{};#]/.test(src[i])) { val += src[i]; advance(); }
    if (val) tokens.push({ type: "WORD", value: val, line: startLine, col: startCol });
    else advance(); // safety
  }

  tokens.push({ type: "EOF", value: "", line, col });
  return tokens;
}
```

### 3.2 AST Types (`ast-types.ts`)

```ts
export interface Directive {
  kind: "directive";
  name: string;              // e.g. "listen", "proxy_pass", "fastcgi_pass"
  args: string[];
  line: number;
}

export interface Block {
  kind: "block";
  name: string;               // "server", "location", "upstream", "http", "events"
  args: string[];              // e.g. location args: ["~", "\.php$"] or ["/api/"]
  children: Node[];
  line: number;
}

export type Node = Directive | Block;

export interface ConfigAST {
  root: Node[];                // top-level (usually just "http" + "events", or bare directives if fragment)
}
```

### 3.3 Recursive-Descent Parser (`parser.ts`)

```ts
import { Token } from "./tokenizer";
import { Node, Block, Directive } from "./ast-types";

export function parse(tokens: Token[]): Node[] {
  let pos = 0;
  const peek = () => tokens[pos];
  const next = () => tokens[pos++];

  function parseBlockBody(): Node[] {
    const nodes: Node[] = [];
    while (peek().type !== "RBRACE" && peek().type !== "EOF") {
      nodes.push(parseStatement());
    }
    return nodes;
  }

  function parseStatement(): Node {
    const nameTok = next(); // WORD or STRING
    const line = nameTok.line;
    const args: string[] = [];

    while (peek().type === "WORD" || peek().type === "STRING") {
      args.push(next().value);
    }

    if (peek().type === "LBRACE") {
      next(); // consume {
      const children = parseBlockBody();
      next(); // consume }
      const block: Block = { kind: "block", name: nameTok.value, args, children, line };
      return block;
    }

    if (peek().type === "SEMI") next(); // consume ;
    const directive: Directive = { kind: "directive", name: nameTok.value, args, line };
    return directive;
  }

  const root: Node[] = [];
  while (peek().type !== "EOF") root.push(parseStatement());
  return root;
}
```

This handles everything needed: `server {}`, `location ~ \.php$ {}`, `upstream backend {}`, `if ($x) {}`, and flat directives like `proxy_set_header X-Real-IP $remote_addr;`.

### 3.4 Semantic Extraction Layer

Rather than making every component walk the raw AST, add a normalization pass (`lib/graph/astToGraph.ts`) that extracts typed, query-friendly structures:

```ts
export interface ServerBlock {
  id: string;
  listen: { port: number; host?: string; ssl: boolean; default_server: boolean }[];
  serverNames: string[];       // ["example.com", "*.example.com", "_"]
  locations: LocationBlock[];
  root?: string;
  sourceLine: number;
}

export interface LocationBlock {
  id: string;
  matchType: "exact" | "prefix" | "regex" | "regex-case-insensitive" | "prefix-priority";
  pattern: string;             // "=", "~", "~*", "^~", or plain prefix
  raw: string;                 // original arg for display
  directives: Record<string, string[]>;  // proxy_pass, fastcgi_pass, try_files, return, rewrite...
  proxySetHeaders: { name: string; value: string }[];
  sourceLine: number;
}

export interface UpstreamBlock {
  id: string;
  name: string;
  servers: { address: string; weight: number; maxFails: number; backup: boolean }[];
  method: "round-robin" | "least_conn" | "ip_hash";
}
```

Walking the raw `Node[]` and populating these typed structures is the single place that needs to know NGINX semantics — every visual/simulation component downstream just reads clean objects.

---

## 4. Location & Server Matching Logic (this is the pedagogical core)

### 4.1 `matchServerBlock.ts` — replicate NGINX's real algorithm, don't approximate it

NGINX's real precedence, which the tool should **visibly walk through** step-by-step in the UI (this is the "why was this server chosen" explainer):

1. Filter server blocks whose `listen` matches the request's host:port.
2. Among those, look for an **exact** `server_name` match.
3. If none, look for the **longest wildcard starting with `*`** match (e.g. `*.example.com`).
4. If none, look for the **longest wildcard ending with `*`** match (e.g. `www.*`).
5. If none, try **regex** `server_name` (`~pattern`) in order of appearance.
6. If none match, use the block marked `default_server`, else the **first** `listen`-matching block defined in the file.

```ts
export interface ServerMatchTrace {
  candidates: { server: ServerBlock; reason: string; eliminated: boolean }[];
  winner: ServerBlock;
  matchStage: "exact" | "wildcard-prefix" | "wildcard-suffix" | "regex" | "default_server" | "first-listen";
}

export function matchServerBlock(host: string, port: number, servers: ServerBlock[]): ServerMatchTrace {
  const candidates = servers.filter(s => s.listen.some(l => l.port === port));
  const trace: ServerMatchTrace["candidates"] = candidates.map(s => ({ server: s, reason: "", eliminated: true }));

  const mark = (s: ServerBlock, reason: string) => {
    const row = trace.find(t => t.server.id === s.id)!;
    row.reason = reason; row.eliminated = false;
  };

  // 1. exact
  const exact = candidates.find(s => s.serverNames.includes(host));
  if (exact) { mark(exact, `Exact match on server_name "${host}"`); return { candidates: trace, winner: exact, matchStage: "exact" }; }

  // 2. leading wildcard *.example.com
  const leadingWild = candidates
    .filter(s => s.serverNames.some(n => n.startsWith("*.") && host.endsWith(n.slice(1))))
    .sort((a, b) => longestMatchLen(b, host) - longestMatchLen(a, host))[0];
  if (leadingWild) { mark(leadingWild, `Wildcard match ("*.")`); return { candidates: trace, winner: leadingWild, matchStage: "wildcard-prefix" }; }

  // 3. trailing wildcard www.*
  const trailingWild = candidates.find(s => s.serverNames.some(n => n.endsWith(".*") && host.startsWith(n.slice(0, -2))));
  if (trailingWild) { mark(trailingWild, `Wildcard match (trailing "*")`); return { candidates: trace, winner: trailingWild, matchStage: "wildcard-suffix" }; }

  // 4. regex
  const regexMatch = candidates.find(s => s.serverNames.some(n => n.startsWith("~") && new RegExp(n.slice(1)).test(host)));
  if (regexMatch) { mark(regexMatch, `Regex server_name match`); return { candidates: trace, winner: regexMatch, matchStage: "regex" }; }

  // 5. default_server / first listen
  const def = candidates.find(s => s.listen.some(l => l.default_server)) ?? candidates[0];
  mark(def, def.listen.some(l => l.default_server) ? "Marked default_server" : "First matching listen block (implicit default)");
  return { candidates: trace, winner: def, matchStage: def.listen.some(l => l.default_server) ? "default_server" : "first-listen" };
}

function longestMatchLen(s: ServerBlock, host: string) {
  return Math.max(...s.serverNames.filter(n => n.startsWith("*.") && host.endsWith(n.slice(1))).map(n => n.length));
}
```

### 4.2 `matchLocationBlock.ts` — NGINX's real location precedence

Order of evaluation (this surprises almost every learner, so the UI should render it as a literal checklist with strikethroughs):

1. `=` exact match — if found, **stop immediately**.
2. All prefix (`^~` and plain) matches — track the **longest** matching prefix.
3. If the longest prefix match used `^~`, **stop**, regex is skipped.
4. Otherwise, evaluate regex locations (`~`, `~*`) **in file order** — first match wins.
5. If no regex matches, fall back to the longest prefix match from step 2.

```ts
export interface LocationMatchTrace {
  steps: { location: LocationBlock; verdict: "exact-hit" | "prefix-candidate" | "regex-tested" | "regex-hit" | "skipped"; note: string }[];
  winner: LocationBlock;
}

export function matchLocationBlock(uri: string, locations: LocationBlock[]): LocationMatchTrace {
  const steps: LocationMatchTrace["steps"] = [];

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

  return { steps, winner: longestPrefix };
}
```

---

## 5. Simulation Engine — from AST to an animation script

The engine (`SimulationEngine.ts`) is pure TypeScript, no React, so it's independently testable. It produces an ordered `SimulationStep[]` that `PacketAnimator` and `HeaderInspectorPanel` consume.

```ts
export type SimulationStep =
  | { type: "TRAVEL"; from: string; to: string; protocol: string; headers: HeaderState }
  | { type: "SERVER_MATCH"; trace: ServerMatchTrace }
  | { type: "LOCATION_MATCH"; trace: LocationMatchTrace }
  | { type: "HEADER_MUTATION"; addedBy: "nginx" | "backend"; diffs: HeaderDiff[] }
  | { type: "FILESYSTEM_CHECK"; path: string; found: boolean; triedFiles?: string[] }
  | { type: "CACHE_CHECK"; layer: "browser" | "nginx-proxy" | "backend-app"; result: "HIT" | "MISS" | "BYPASS" }
  | { type: "COMPRESSION"; algorithm: "gzip" | "br" | "none"; ratio?: number }
  | { type: "UPSTREAM_SELECT"; upstream: string; chosenServer: string; method: string }
  | { type: "REWRITE"; from: string; to: string; kind: "rewrite" | "return"; statusCode?: number }
  | { type: "LOG_WRITE"; log: "access_log" | "error_log"; line: string }
  | { type: "RESPONSE"; statusCode: number };

export function simulate(ast: ParsedConfig, request: { method: string; host: string; port: number; path: string }): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const headers = initHeaders(request);

  steps.push({ type: "TRAVEL", from: "client", to: "docker-host", protocol: "HTTP/1.1", headers: { ...headers } });
  steps.push({ type: "TRAVEL", from: "docker-host", to: "nginx-container", protocol: "HTTP/1.1", headers: { ...headers } });

  const serverTrace = matchServerBlock(request.host, request.port, ast.servers);
  steps.push({ type: "SERVER_MATCH", trace: serverTrace });

  const locationTrace = matchLocationBlock(request.path, serverTrace.winner.locations);
  steps.push({ type: "LOCATION_MATCH", trace: locationTrace });

  const loc = locationTrace.winner;

  // return / rewrite short-circuit
  const ret = loc.directives["return"];
  if (ret) {
    const [code, target] = ret;
    steps.push({ type: "REWRITE", from: request.path, to: target, kind: "return", statusCode: Number(code) });
    steps.push({ type: "TRAVEL", from: "nginx-container", to: "client", protocol: "HTTP/1.1", headers });
    steps.push({ type: "RESPONSE", statusCode: Number(code) });
    return steps;
  }

  // proxy_set_header mutations
  if (loc.proxySetHeaders.length) {
    steps.push({ type: "HEADER_MUTATION", addedBy: "nginx", diffs: loc.proxySetHeaders.map(h => ({ name: h.name, value: h.value, action: "add" })) });
  }

  // proxy cache check
  if (loc.directives["proxy_cache"]) {
    steps.push({ type: "CACHE_CHECK", layer: "nginx-proxy", result: pseudoRandomCacheResult() });
  }

  if (loc.directives["fastcgi_pass"]) {
    steps.push({ type: "TRAVEL", from: "nginx-container", to: "php-fpm", protocol: "FastCGI", headers });
    steps.push({ type: "TRAVEL", from: "php-fpm", to: "php-worker", protocol: "FastCGI (internal)", headers });
    if (loc.directives["try_files"]) {
      steps.push({ type: "FILESYSTEM_CHECK", path: request.path, found: true, triedFiles: loc.directives["try_files"] });
    }
    steps.push({ type: "TRAVEL", from: "php-worker", to: "php-fpm", protocol: "FastCGI", headers });
    steps.push({ type: "TRAVEL", from: "php-fpm", to: "nginx-container", protocol: "FastCGI", headers });
  } else if (loc.directives["proxy_pass"]) {
    const target = loc.directives["proxy_pass"][0];
    const upstreamName = extractUpstreamName(target, ast.upstreams);
    if (upstreamName) {
      const chosen = upstreamBalancer(ast.upstreams[upstreamName]);
      steps.push({ type: "UPSTREAM_SELECT", upstream: upstreamName, chosenServer: chosen, method: ast.upstreams[upstreamName].method });
      steps.push({ type: "TRAVEL", from: "nginx-container", to: chosen, protocol: "HTTP/1.0", headers });
      steps.push({ type: "TRAVEL", from: chosen, to: "nginx-container", protocol: "HTTP/1.0", headers });
    } else {
      steps.push({ type: "TRAVEL", from: "nginx-container", to: "backend-app", protocol: "HTTP/1.0", headers });
      steps.push({ type: "TRAVEL", from: "backend-app", to: "nginx-container", protocol: "HTTP/1.0", headers });
    }
  } else if (loc.directives["root"] || loc.directives["try_files"]) {
    steps.push({ type: "FILESYSTEM_CHECK", path: (loc.directives["root"]?.[0] ?? "") + request.path, found: true });
  }

  // response header mutations (add_header, CORS, cache-control)
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

  steps.push({ type: "LOG_WRITE", log: "access_log", line: `${request.method} ${request.path} 200` });
  steps.push({ type: "RESPONSE", statusCode: 200 });

  return steps;
}
```

`stepSequencer.ts` then just timestamps these steps (default 900ms each, configurable via `PlaybackControls`) and the Zustand `simulationStore` exposes `currentStepIndex`, `isPlaying`, `speed`.

---

## 6. Core React Components

### 6.1 `VisualizerCanvas.tsx` — React Flow shell

```tsx
"use client";
import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useConfigStore } from "@/lib/store/configStore";
import { astToGraph } from "@/lib/graph/astToGraph";
import { nodeTypes } from "./nodes";
import { edgeTypes } from "./edges";
import { PacketAnimator } from "./PacketAnimator";

export function VisualizerCanvas() {
  const ast = useConfigStore(s => s.ast);
  const { nodes, edges } = astToGraph(ast); // memoized upstream via useMemo in real impl

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls />
        <MiniMap pannable zoomable />
      </ReactFlow>
      <PacketAnimator />
    </div>
  );
}
```

### 6.2 `PacketAnimator.tsx` — the moving request dot

Reads the current `TRAVEL` step from `simulationStore`, looks up the corresponding edge's SVG path (React Flow exposes edge DOM paths via `getBezierPath` / by querying `.react-flow__edge-path`), and animates a dot along it with Framer Motion's `useAnimationFrame` + `getPointAtLength`.

```tsx
"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { useSimulationStore } from "@/lib/store/simulationStore";

export function PacketAnimator() {
  const currentStep = useSimulationStore(s => s.currentStep());
  const dotRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!currentStep || currentStep.type !== "TRAVEL") return;
    const edgeEl = document.querySelector<SVGPathElement>(
      `[data-edge-id="${currentStep.from}-${currentStep.to}"] path`
    );
    if (!edgeEl || !dotRef.current) return;

    const len = edgeEl.getTotalLength();
    let raf: number;
    const duration = 700;
    const start = performance.now();

    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const pt = edgeEl!.getPointAtLength(t * len);
      dotRef.current!.setAttribute("cx", String(pt.x));
      dotRef.current!.setAttribute("cy", String(pt.y));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [currentStep]);

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full">
      <motion.circle
        ref={dotRef}
        r={6}
        className="fill-blue-500"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 0.6 }}
      />
    </svg>
  );
}
```

*(Implementation note: give every custom edge a `data-edge-id="{source}-{target}"` attribute in `ProtocolEdge.tsx` so this selector works.)*

### 6.3 `ProtocolEdge.tsx` — protocol-labeled, color-coded edge

```tsx
import { BaseEdge, EdgeLabelRenderer, getBezierPath, EdgeProps } from "@xyflow/react";

const PROTOCOL_COLOR: Record<string, string> = {
  "HTTP/1.1": "#3b82f6",
  "HTTP/2": "#8b5cf6",
  "HTTP/1.0": "#f59e0b",
  "FastCGI": "#ef4444",
  "FastCGI (internal)": "#f87171",
};

export function ProtocolEdge({ id, sourceX, sourceY, targetX, targetY, data }: EdgeProps) {
  const [path, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY });
  const protocol = (data?.protocol as string) ?? "HTTP/1.1";

  return (
    <g data-edge-id={id}>
      <BaseEdge id={id} path={path} style={{ stroke: PROTOCOL_COLOR[protocol] ?? "#999", strokeWidth: 2 }} />
      <EdgeLabelRenderer>
        <div
          style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
          className="absolute rounded bg-white px-2 py-0.5 text-xs font-medium shadow"
        >
          {protocol}
        </div>
      </EdgeLabelRenderer>
    </g>
  );
}
```

### 6.4 `HeaderInspectorPanel.tsx` — floating, diffing headers per step

```tsx
"use client";
import { useSimulationStore } from "@/lib/store/simulationStore";
import { HeaderDiffRow } from "./HeaderDiffRow";

export function HeaderInspectorPanel() {
  const { history, currentStepIndex } = useSimulationStore();
  const relevantSteps = history.slice(0, currentStepIndex + 1).filter(s => s.type === "HEADER_MUTATION" || s.type === "TRAVEL");

  const latestHeaders = [...relevantSteps].reverse().find(s => s.type === "TRAVEL")?.headers ?? {};

  return (
    <div className="absolute right-4 top-4 z-20 w-80 rounded-lg border bg-white/95 p-3 shadow-lg backdrop-blur">
      <h3 className="mb-2 text-sm font-semibold">Header Inspector</h3>
      <div className="max-h-96 space-y-1 overflow-y-auto text-xs">
        {Object.entries(latestHeaders).map(([name, value]) => (
          <HeaderDiffRow key={name} name={name} value={value as string} />
        ))}
      </div>
      <div className="mt-2 border-t pt-2 text-xs text-gray-500">
        Step {currentStepIndex + 1} / {history.length}
      </div>
    </div>
  );
}
```

`HeaderDiffRow` highlights green for headers added in the current step and strikes through ones removed, driven by comparing against the previous `TRAVEL` step's header set.

### 6.5 Zustand stores

```ts
// lib/store/configStore.ts
import { create } from "zustand";
import { tokenize } from "@/lib/parser/tokenizer";
import { parse } from "@/lib/parser/parser";
import { normalize, ParsedConfig } from "@/lib/graph/astToGraph";

interface ConfigStore {
  rawText: string;
  ast: ParsedConfig | null;
  errors: { line: number; message: string }[];
  setRawText: (text: string) => void;
}

export const useConfigStore = create<ConfigStore>((set) => ({
  rawText: "",
  ast: null,
  errors: [],
  setRawText: (text: string) => {
    try {
      const tokens = tokenize(text);
      const nodes = parse(tokens);
      const ast = normalize(nodes);
      set({ rawText: text, ast, errors: [] });
    } catch (e: any) {
      set({ rawText: text, errors: [{ line: e.line ?? 0, message: e.message }] });
    }
  },
}));
```

```ts
// lib/store/simulationStore.ts
import { create } from "zustand";
import { SimulationStep } from "@/components/simulator/SimulationEngine";

interface SimulationStore {
  history: SimulationStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  speedMs: number;
  currentStep: () => SimulationStep | undefined;
  loadSimulation: (steps: SimulationStep[]) => void;
  stepForward: () => void;
  stepBack: () => void;
  play: () => void;
  pause: () => void;
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  history: [],
  currentStepIndex: -1,
  isPlaying: false,
  speedMs: 900,
  currentStep: () => get().history[get().currentStepIndex],
  loadSimulation: (steps) => set({ history: steps, currentStepIndex: -1, isPlaying: false }),
  stepForward: () => set(s => ({ currentStepIndex: Math.min(s.currentStepIndex + 1, s.history.length - 1) })),
  stepBack: () => set(s => ({ currentStepIndex: Math.max(s.currentStepIndex - 1, 0) })),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
}));
```

A small `useEffect`-based interval in `PlaybackControls.tsx` calls `stepForward()` every `speedMs` while `isPlaying`, and calls `pause()` at the end of `history`.

---

## 7. Caching, Compression & Filesystem Visuals

- **Cache layers** render as small badge components (`CacheStatusBadge.tsx`) attached to `ClientNode` (browser cache), `NginxContainerNode` (proxy cache), and `BackendAppNode` (app cache). Each badge listens to `CACHE_CHECK` steps filtered by `layer` and flashes green (`HIT`) or amber (`MISS`) via a Framer Motion `animate` on `backgroundColor`.
- **Filesystem checks** (`FileSystemNode.tsx`) render the directory tree implied by `root`/`alias`, and on a `FILESYSTEM_CHECK` step, highlight the specific file path and show the `try_files` fallback chain being tested left-to-right, each with a strikethrough until the one that resolves.
- **Compression** is a small gzip/brotli icon on the edge from NGINX back to the client that only renders (with a "compressed: -70% size" tooltip) when a `COMPRESSION` step exists in the current path.

---

## 8. Logs Panel

`LogStreamPanel.tsx` is a terminal-style, auto-scrolling list subscribed to `LOG_WRITE` steps — `access_log` lines append in green monospace, `error_log` lines (triggered when `SimulationEngine` produces a 4xx/5xx path, e.g. no location matched, `try_files` exhausted, or upstream unreachable) append in red. Clicking a log line jumps `currentStepIndex` back to that point in the animation.

---

## 9. Redirects & Rewrites — the "bounce back" animation

For `return 301/302` and `rewrite ... permanent/redirect`, the engine (see §5) does **not** continue the request into the backend. Instead:
1. `REWRITE` step is emitted with the new target.
2. The packet animates from `nginx-container` all the way back out to `client` (same as a normal response).
3. `SimulateRequestBar` then shows a "🔁 Browser re-requesting {new path}..." toast and — after a short delay — **automatically re-invokes `simulate()`** with the new URL, giving a visibly distinct second pass through the diagram (a new packet color / dashed trail helps learners see it's a *new* request-response cycle, not a continuation).

Internal `rewrite ... last;` / `rewrite ... break;` (no redirect back to client) should instead show the URL mutating **inside** the NGINX node with a small inline diff, then continue the *same* simulation pass into location re-matching (`last`) or straight into proxy/fastcgi (`break`) — this distinction (internal rewrite vs. external redirect) is one of the most common points of confusion for learners and is worth a dedicated tooltip in the UI.

---

## 10. Suggested Build Phases

1. **Parser + static graph render** — parse config, render nodes/edges with no animation, validate against 4 sample configs (static site, PHP-FPM, load-balanced reverse proxy, redirects/rewrites).
2. **Server/location matching UI** — build the step-by-step "why this block was chosen" trace panel using §4, without full request simulation yet.
3. **Full simulation engine + packet animation** — wire §5 and §6.2 together end-to-end for the simplest case (static file serving).
4. **Header Inspector + logs** — layer in §6.4 and §8.
5. **Caching, compression, upstream load balancing, PHP-FPM split** — layer in §7 and the round-robin/least_conn logic.
6. **Redirects/rewrites two-pass animation** — §9, last because it depends on the full loop already working.

---

## 11. Key Libraries Summary

```json
{
  "dependencies": {
    "next": "^14",
    "react": "^18",
    "@xyflow/react": "^12",
    "framer-motion": "^11",
    "zustand": "^4",
    "@monaco-editor/react": "^4",
    "react-resizable-panels": "^2",
    "tailwindcss": "^3",
    "clsx": "^2"
  }
}
```

No parser dependency is needed — the ~150-line tokenizer + recursive-descent parser in §3 fully covers NGINX's block/directive grammar, including quoted strings, regex location args, and nested blocks (`http > server > location`, `http > upstream`).