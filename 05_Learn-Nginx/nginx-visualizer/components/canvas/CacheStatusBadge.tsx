"use client";

import { useMemo } from "react";
import { useSimulationStore } from "../../lib/store/simulationStore";

type Layer = "browser" | "nginx-proxy" | "backend-app";

const STYLES: Record<string, string> = {
    HIT: "bg-emerald-500 text-white",
    MISS: "bg-amber-500 text-white",
    BYPASS: "bg-slate-500 text-white",
};

export default function CacheStatusBadge({ layer, label }: { layer: Layer; label: string }) {
    const history = useSimulationStore((s) => s.history);
    const currentStepIndex = useSimulationStore((s) => s.currentStepIndex);

    const result = useMemo(() => {
        for (let i = currentStepIndex; i >= 0; i--) {
            const step = history[i];
            if (step?.type === "CACHE_CHECK" && step.layer === layer) return step.result;
        }
        return undefined;
    }, [history, currentStepIndex, layer]);

    return (
        <div className="pill">
            <span className="muted" style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.12em" }}>{label}</span>
            <span className={`pill ${result ? STYLES[result] : "pill-muted"}`} style={{ padding: "0.25rem 0.6rem", fontSize: "0.68rem" }}>
                {result ?? "—"}
            </span>
        </div>
    );
}
