"use client";
import { useMemo } from "react";
import { Background, ReactFlow, type Edge, type Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useConfigStore } from "../../lib/store/configStore";
import { astToGraph } from "../../lib/graph/astToGraph";
import PacketAnimator from "./PacketAnimator";
import ProtocolEdge from "./edges/ProtocolEdge";
import CacheStatusBadge from "./CacheStatusBadge";

const nodeStyle = {
    borderRadius: 12,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(15, 23, 42, 0.7)",
    color: "#f1f5f9",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
    width: 140,
    padding: "0.6rem 0.8rem",
    fontSize: "0.78rem",
    fontWeight: 600,
    textAlign: "center" as const,
    backdropFilter: "blur(8px)",
};

export default function VisualizerCanvas({ configText }: { configText: string }) {
    const ast = useConfigStore((s) => s.ast);
    const graph = useMemo(() => (ast ? astToGraph(ast) : null), [ast]);

    const nodes: Node[] = useMemo(
        () =>
            (graph?.nodes ?? [
                { id: "client", label: "Client (Browser)", x: 40, y: 40 },
                { id: "docker-host", label: "Docker Host", x: 260, y: 40 },
                { id: "nginx-container", label: "NGINX Container", x: 480, y: 40 },
                { id: "backend-app", label: "Backend App", x: 700, y: 40 },
            ]).map((n) => ({
                id: n.id,
                position: { x: n.x, y: n.y },
                data: { label: n.label },
                type: "default",
                sourcePosition: "right" as any,
                targetPosition: "left" as any,
                style: nodeStyle,
            })),
        [graph],
    );

    const edges: Edge[] = useMemo(
        () =>
            (graph?.edges ?? [
                { id: "client-docker-host", from: "client", to: "docker-host", x1: 200, y1: 70, x2: 260, y2: 70, protocol: "HTTP/1.1" },
                { id: "docker-host-nginx-container", from: "docker-host", to: "nginx-container", x1: 420, y1: 70, x2: 480, y2: 70, protocol: "HTTP/1.1" },
                { id: "nginx-container-backend-app", from: "nginx-container", to: "backend-app", x1: 640, y1: 70, x2: 700, y2: 70, protocol: "HTTP/1.0" },
            ]).map((e) => ({
                id: e.id,
                source: e.from,
                target: e.to,
                type: "protocolEdge",
                data: { protocol: e.protocol },
                animated: true,
            })),
        [graph],
    );

    return (
        <div className="canvas-wrapper">
            <div className="card-header">
                <div>
                    <div className="panel-label">Simulation Canvas</div>
                    <div className="panel-caption">Request path, protocol hops & animation</div>
                </div>
                <div className="toolbar">
                    <span className="page-badge">React Flow</span>
                    <span className="page-badge">Live traces</span>
                </div>
            </div>
            <div className="cache-row">
                <CacheStatusBadge layer="browser" label="Browser Cache" />
                <CacheStatusBadge layer="nginx-proxy" label="NGINX Cache" />
                <CacheStatusBadge layer="backend-app" label="Backend Cache" />
            </div>
            <div className="canvas-inner">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    edgeTypes={{ protocolEdge: ProtocolEdge }}
                    fitView
                    proOptions={{ hideAttribution: true }}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    zoomOnScroll={false}
                    panOnDrag={true}
                    minZoom={0.4}
                    maxZoom={1.5}
                >
                    <Background />
                </ReactFlow>
                <PacketAnimator />
            </div>
        </div>
    );
}
