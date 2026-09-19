"use client";

import { useMemo } from "react";
import { useConfigStore } from "../../lib/store/configStore";
import { useSimulationStore } from "../../lib/store/simulationStore";

function getHeadersFromStep(step: any): Record<string, string> {
    if (!step) return {};
    if (step.type === "TRAVEL") return step.headers ?? {};
    return {};
}

export default function HeaderInspectorPanel() {
    const history = useSimulationStore((s) => s.history);
    const currentStepIndex = useSimulationStore((s) => s.currentStepIndex);
    const setSelectedLine = useConfigStore((s) => s.setSelectedLine);

    const currentStep = history[currentStepIndex];
    const previousTravel = useMemo(() => {
        for (let i = currentStepIndex - 1; i >= 0; i--) {
            if (history[i]?.type === "TRAVEL") return history[i];
        }
        return undefined;
    }, [currentStepIndex, history]);

    const headers = getHeadersFromStep(currentStep);
    const previousHeaders = getHeadersFromStep(previousTravel);
    const keys = Array.from(new Set([...Object.keys(previousHeaders), ...Object.keys(headers)])).sort();
    const serverLine = currentStep?.type === "SERVER_MATCH" ? currentStep.trace?.winner?.sourceLine : null;
    const locationLine = currentStep?.type === "LOCATION_MATCH" ? currentStep.trace?.winner?.sourceLine : null;
    const serverTrace = currentStep?.type === "SERVER_MATCH" ? currentStep.trace : null;
    const locationTrace = currentStep?.type === "LOCATION_MATCH" ? currentStep.trace : null;

    return (
        <div className="inspector-shell">
            {/* Current Step */}
            <div className="panel-label" style={{ marginBottom: "0.25rem" }}>
                Current step ({currentStepIndex + 1} / {history.length})
            </div>
            <div className="step-json mono">
                {currentStep ? JSON.stringify(currentStep, null, 2) : "No simulation loaded yet."}
            </div>
            {(serverLine || locationLine) && (
                <div className="toolbar">
                    {serverLine && <button type="button" onClick={() => setSelectedLine(serverLine)} className="button-dark" style={{ fontSize: "0.72rem", padding: "0.3rem 0.6rem" }}>Jump to line {serverLine}</button>}
                    {locationLine && <button type="button" onClick={() => setSelectedLine(locationLine)} className="button" style={{ fontSize: "0.72rem", padding: "0.3rem 0.6rem" }}>Jump to line {locationLine}</button>}
                </div>
            )}

            {/* Server Trace */}
            {serverTrace && (
                <div className="card">
                    <div className="card-header">
                        <span className="panel-label">Server selection trace</span>
                    </div>
                    <div className="card-body stack" style={{ fontSize: "0.78rem" }}>
                        {serverTrace.candidates?.length ? (
                            serverTrace.candidates.map((c: any) => (
                                <button
                                    type="button"
                                    key={c.server.id}
                                    onClick={() => setSelectedLine(c.server.sourceLine)}
                                    className="button-dark"
                                    style={{
                                        textAlign: "left", width: "100%",
                                        borderColor: c.eliminated ? undefined : "rgba(52, 211, 153, 0.3)",
                                        background: c.eliminated ? undefined : "rgba(52, 211, 153, 0.06)",
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
                                        <span style={{ fontWeight: 600, color: c.eliminated ? "var(--text-muted)" : "var(--text)" }}>server @{c.server.sourceLine}</span>
                                        <span style={{ fontSize: "0.65rem", textTransform: "uppercase", color: c.eliminated ? "var(--text-muted)" : "var(--success)" }}>{c.eliminated ? "skipped" : "winner"}</span>
                                    </div>
                                    <div className="muted" style={{ fontSize: "0.7rem", marginTop: "0.15rem" }}>
                                        listen: {c.server.listen?.map((l: any) => l.port).join(", ") || "—"} · names: {c.server.serverNames?.join(", ") || "—"}
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="muted">No candidates.</div>
                        )}
                    </div>
                </div>
            )}

            {/* Location Trace */}
            {locationTrace && (
                <div className="card">
                    <div className="card-header">
                        <span className="panel-label">Location match trace</span>
                    </div>
                    <div className="card-body stack" style={{ fontSize: "0.78rem" }}>
                        {locationTrace.steps?.length ? (
                            locationTrace.steps.map((step: any, idx: number) => {
                                const isWinner = step.verdict === "regex-hit" || step.verdict === "exact-hit" || (idx === locationTrace.steps.length - 1 && step.verdict === "prefix-candidate" && step.location.id === locationTrace.winner.id);
                                return (
                                    <button
                                        type="button"
                                        key={`${step.location.id}-${idx}`}
                                        onClick={() => setSelectedLine(step.location.sourceLine)}
                                        className="button-dark"
                                        style={{
                                            textAlign: "left", width: "100%",
                                            borderColor: isWinner ? "rgba(52, 211, 153, 0.3)" : undefined,
                                            background: isWinner ? "rgba(52, 211, 153, 0.06)" : undefined,
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
                                            <span style={{ fontWeight: 600, color: isWinner ? "var(--text)" : "var(--text-muted)" }}>location @{step.location.sourceLine}</span>
                                            <span style={{ fontSize: "0.65rem", textTransform: "uppercase", color: isWinner ? "var(--success)" : "var(--text-muted)" }}>{step.verdict}</span>
                                        </div>
                                        <div className="muted" style={{ fontSize: "0.7rem", marginTop: "0.15rem" }}>
                                            {step.location.matchType} · {step.location.raw || step.location.pattern}
                                        </div>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="muted">No location steps.</div>
                        )}
                    </div>
                </div>
            )}

            {/* Headers */}
            <div className="card">
                <div className="card-header">
                    <span className="panel-label">Headers ({keys.length})</span>
                </div>
                <div className="card-body stack" style={{ fontSize: "0.78rem" }}>
                    {keys.length === 0 ? (
                        <div className="muted">No headers to display yet.</div>
                    ) : (
                        keys.map((name) => {
                            const before = previousHeaders[name];
                            const after = headers[name];
                            const removed = before && !after;
                            const added = !before && after;
                            const changed = before && after && before !== after;
                            const statusColor = removed ? "var(--danger)" : added ? "var(--success)" : changed ? "var(--warning)" : "var(--text-muted)";
                            const statusLabel = removed ? "removed" : added ? "added" : changed ? "changed" : "stable";

                            return (
                                <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem", padding: "0.4rem 0.5rem", borderRadius: "6px", background: "rgba(0,0,0,0.15)", border: "1px solid var(--border)" }}>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: "0.78rem" }}>{name}</div>
                                        <div className="mono" style={{ fontSize: "0.72rem", color: statusColor, wordBreak: "break-all", textDecoration: removed ? "line-through" : "none" }}>
                                            {after ?? before}
                                        </div>
                                    </div>
                                    <span style={{ flexShrink: 0, fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.05em", color: statusColor, fontWeight: 700 }}>
                                        {statusLabel}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
