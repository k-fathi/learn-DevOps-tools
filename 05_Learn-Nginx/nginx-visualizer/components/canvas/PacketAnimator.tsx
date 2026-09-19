"use client";
import { useEffect, useRef } from "react";
import { useSimulationStore } from "../../lib/store/simulationStore";

export default function PacketAnimator() {
    const currentStep = useSimulationStore((s) => s.currentStep());
    const dotRef = useRef<SVGCircleElement | null>(null);

    useEffect(() => {
        if (!currentStep || currentStep.type !== "TRAVEL") return;
        let isReversed = false;
        let id = `${currentStep.from}-${currentStep.to}`;
        let edgePath = document.querySelector<SVGPathElement>(`[data-edge-id="${id}"] path`);
        if (!edgePath) {
            id = `${currentStep.to}-${currentStep.from}`;
            isReversed = true;
            edgePath = document.querySelector<SVGPathElement>(`[data-edge-id="${id}"] path`);
        }
        if (!edgePath || !dotRef.current) return;

        const totalLength = edgePath.getTotalLength();
        const duration = 700;
        let raf = 0;
        const start = performance.now();

        function tick(now: number) {
            const t = Math.min((now - start) / duration, 1);
            const actualT = isReversed ? 1 - t : t;
            const point = edgePath!.getPointAtLength(totalLength * actualT);
            const cx = point.x;
            const cy = point.y;
            dotRef.current!.setAttribute("cx", String(cx));
            dotRef.current!.setAttribute("cy", String(cy));
            if (t < 1) raf = requestAnimationFrame(tick);
        }
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [currentStep]);

    return (
        <svg className="pointer-events-none absolute inset-0" style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }}>
            <circle ref={dotRef} r={6} fill="#2563eb" />
        </svg>
    );
}
