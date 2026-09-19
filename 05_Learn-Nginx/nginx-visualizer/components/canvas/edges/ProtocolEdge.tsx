"use client";

import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from "@xyflow/react";

const PROTOCOL_COLOR: Record<string, string> = {
    "HTTP/1.1": "#3b82f6",
    "HTTP/2": "#8b5cf6",
    "HTTP/1.0": "#f59e0b",
    FastCGI: "#ef4444",
    "FastCGI (internal)": "#f87171",
};

export default function ProtocolEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
}: EdgeProps) {
    const [path, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
    });

    const protocol = (data?.protocol as string) ?? "HTTP/1.1";
    const color = PROTOCOL_COLOR[protocol] ?? "#6b7280";

    return (
        <g data-edge-id={id}>
            <BaseEdge id={id} path={path} style={{ stroke: color, strokeWidth: 2.5 }} />
            <EdgeLabelRenderer>
                <div
                    style={{ transform: `translate(-50%, -120%) translate(${labelX}px, ${labelY}px)` }}
                    className="absolute rounded bg-slate-800 border border-slate-700 px-2 py-0.5 text-[0.7rem] font-medium shadow pointer-events-none text-slate-200"
                >
                    {protocol}
                </div>
            </EdgeLabelRenderer>
        </g>
    );
}
