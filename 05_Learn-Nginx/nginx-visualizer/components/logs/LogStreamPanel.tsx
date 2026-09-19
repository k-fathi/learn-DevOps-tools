"use client";

import { useMemo } from "react";
import { useConfigStore } from "../../lib/store/configStore";
import { useSimulationStore } from "../../lib/store/simulationStore";

export default function LogStreamPanel() {
    const history = useSimulationStore((s) => s.history);
    const currentStepIndex = useSimulationStore((s) => s.currentStepIndex);
    const setSelectedLine = useConfigStore((s) => s.setSelectedLine);
    const setCurrentStepIndex = useSimulationStore((s) => s.setCurrentStepIndex);

    const logs = useMemo(
        () =>
            history
                .map((step, index) => ({ step, index }))
                .filter(({ step }) => step.type === "LOG_WRITE")
                .map(({ step, index }) => ({ ...(step as Extract<(typeof history)[number], { type: "LOG_WRITE" }>), _index: index })),
        [history],
    );

    return (
        <div className="log-shell" style={{ flexShrink: 0 }}>
            <div className="card-header">
                <span className="card-title">Logs</span>
                <span className="page-badge">access_log / error_log</span>
            </div>
            <div className="card-body panel-scroll mono" style={{ fontSize: "0.75rem" }}>
                {logs.length === 0 ? (
                    <div className="muted">No log entries yet.</div>
                ) : (
                    <div className="stack">
                        {logs.map((entry, i) => {
                            const active = entry._index === currentStepIndex;
                            return (
                                <button
                                    key={`${entry.log}-${i}`}
                                    type="button"
                                    className="button-dark"
                                    style={{
                                        textAlign: "left",
                                        borderColor: active ? "rgba(129, 140, 248, 0.4)" : undefined,
                                        background: active ? "rgba(129, 140, 248, 0.08)" : undefined,
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "0.4rem",
                                        alignItems: "center",
                                    }}
                                    onClick={() => setCurrentStepIndex(entry._index)}
                                >
                                    <span className={entry.log === "error_log" ? "danger" : "success"}>[{entry.log}]</span>
                                    <span className="muted" style={{ flex: 1, minWidth: 0, wordBreak: "break-all" }}>{entry.line}</span>
                                    {entry.sourceLine ? (
                                        <span
                                            role="button"
                                            tabIndex={0}
                                            className="page-badge"
                                            style={{ cursor: "pointer" }}
                                            onClick={(e) => { e.stopPropagation(); setSelectedLine(entry.sourceLine ?? null); }}
                                            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelectedLine(entry.sourceLine ?? null); }}
                                        >
                                            line {entry.sourceLine}
                                        </span>
                                    ) : null}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
