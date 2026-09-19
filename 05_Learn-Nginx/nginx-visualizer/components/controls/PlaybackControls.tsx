"use client";

import { useEffect } from "react";
import { useSimulationStore } from "../../lib/store/simulationStore";

export default function PlaybackControls() {
    const isPlaying = useSimulationStore((s) => s.isPlaying);
    const speedMs = useSimulationStore((s) => s.speedMs);
    const history = useSimulationStore((s) => s.history);
    const currentStepIndex = useSimulationStore((s) => s.currentStepIndex);
    const play = useSimulationStore((s) => s.play);
    const pause = useSimulationStore((s) => s.pause);
    const stepForward = useSimulationStore((s) => s.stepForward);
    const stepBack = useSimulationStore((s) => s.stepBack);

    useEffect(() => {
        if (!isPlaying) return;
        const timer = window.setInterval(() => {
            if (currentStepIndex >= history.length - 1) {
                pause();
                return;
            }
            stepForward();
        }, speedMs);
        return () => window.clearInterval(timer);
    }, [isPlaying, speedMs, history.length, currentStepIndex, pause, stepForward]);

    return (
        <div className="card card-soft">
            <div className="card-body toolbar">
                <button className="button-dark" onClick={stepBack} type="button">
                    ◀ Step
                </button>
                <button className="button" onClick={isPlaying ? pause : play} type="button">
                    {isPlaying ? "Pause" : "Play"}
                </button>
                <button className="button-dark" onClick={stepForward} type="button">
                    Step ▶
                </button>
                <div className="page-badge" style={{ marginLeft: "auto" }}>
                    Step {currentStepIndex + 1} / {history.length}
                </div>
            </div>
        </div>
    );
}
