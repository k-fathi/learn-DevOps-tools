"use client";
import { useEffect, useRef, useState } from "react";
import { useConfigStore } from "../../lib/store/configStore";
import { simulate } from "../../lib/simulator/SimulationEngine";
import { useSimulationStore } from "../../lib/store/simulationStore";

export default function SimulateRequestBar() {
    const [url, setUrl] = useState<string>("http://example.com/");
    const [toast, setToast] = useState<string>("");
    const ast = useConfigStore((s) => s.ast);
    const loadSimulation = useSimulationStore((s) => s.loadSimulation);
    const replayGuard = useRef(false);

    useEffect(() => {
        replayGuard.current = false;
    }, [url]);

    function resolveRedirectTarget(currentUrl: string, target: string) {
        if (!target) return currentUrl;
        try {
            if (/^https?:\/\//i.test(target)) return target;
            const base = new URL(currentUrl);
            if (target.startsWith("/")) return `${base.origin}${target}`;
            return `${base.origin}/${target}`;
        } catch {
            return target;
        }
    }

    function run(targetUrl = url, allowReplay = true) {
        if (!ast) return alert("Please paste a valid config first");
        const u = new URL(targetUrl);
        const steps = simulate(ast, { method: "GET", host: u.hostname, port: Number(u.port) || 80, path: u.pathname });
        loadSimulation(steps);

        if (!allowReplay || replayGuard.current) return;
        const redirect = steps.find((step) => step.type === "REWRITE" && (step.statusCode === 301 || step.statusCode === 302)) as Extract<(typeof steps)[number], { type: "REWRITE" }> | undefined;
        if (!redirect) return;

        const nextUrl = resolveRedirectTarget(targetUrl, redirect.to);
        replayGuard.current = true;
        setToast(`🔁 Browser re-requesting ${nextUrl}...`);
        window.setTimeout(() => {
            setUrl(nextUrl);
            run(nextUrl, false);
            setToast("");
        }, 900);
    }

    return (
        <div className="card card-soft">
            <div className="card-header">
                <div>
                    <div className="panel-label">Request simulator</div>
                    <div className="panel-caption">Run the current config against a URL</div>
                </div>
                <span className="page-badge">Auto replay</span>
            </div>
            <div className="card-body stack">
                <div className="toolbar">
                    <input className="input" style={{ flex: 1, minWidth: 240 }} value={url} onChange={(e) => setUrl(e.target.value)} />
                    <button onClick={() => run()} className="button">Simulate</button>
                </div>
                {toast ? <div className="page-badge pill-accent">{toast}</div> : null}
            </div>
        </div>
    );
}
