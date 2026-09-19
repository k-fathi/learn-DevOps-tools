"use client";
import { useState } from "react";
import ConfigEditor from "../components/editor/ConfigEditor";
import VisualizerCanvas from "../components/canvas/VisualizerCanvas";
import SimulateRequestBar from "../components/simulator/SimulateRequestBar";
import PlaybackControls from "../components/controls/PlaybackControls";
import HeaderInspectorPanel from "../components/inspector/HeaderInspectorPanel";
import LogStreamPanel from "../components/logs/LogStreamPanel";

const DEFAULT_CONFIG = `http {
    gzip on;
    
    upstream backend_nodes {
        server 10.0.0.1;
        server 10.0.0.2;
    }

    server {
        listen 80;
        server_name example.com;

        location / {
            proxy_pass http://backend_nodes;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location ~ \\.php$ {
            fastcgi_pass php-fpm:9000;
        }

        location /old {
            rewrite ^/old(.*) /new$1 permanent;
        }
    }
}`;

export default function Page() {
    const [configText, setConfigText] = useState<string>(DEFAULT_CONFIG);

    return (
        <div className="app-shell">
            <div className="top-row">
                {/* ─── Left: Editor ─── */}
                <div className="col">
                <section className="surface" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <div className="surface-header">
                        <p className="eyebrow">NGINX Config Visualizer</p>
                        <h1 className="title">Config Editor</h1>
                    </div>
                    <div className="surface-body" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                        <ConfigEditor value={configText} onChange={setConfigText} />
                    </div>
                </section>
            </div>

            {/* ─── Center: Simulation ─── */}
            <div className="col">
                <section className="surface" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <div className="surface-header">
                        <div className="toolbar">
                            <span className="page-badge">Interactive simulation</span>
                            <span className="page-badge">Server routing</span>
                        </div>
                    </div>
                    <div className="surface-body stack" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                        <PlaybackControls />
                        <SimulateRequestBar />
                        <VisualizerCanvas configText={configText} />
                    </div>
                </section>
            </div>
            </div>

            {/* ─── Bottom: Inspector + Logs ─── */}
            <div className="bottom-row">
                <section className="surface" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <div className="surface-header">
                        <span className="page-badge">Headers & traces</span>
                    </div>
                    <div className="surface-body" style={{ flex: 1, overflowY: "auto" }}>
                        <HeaderInspectorPanel />
                    </div>
                </section>
                <LogStreamPanel />
            </div>
        </div>
    );
}
