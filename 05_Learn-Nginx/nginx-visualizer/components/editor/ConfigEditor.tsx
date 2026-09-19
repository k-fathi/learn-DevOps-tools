import { useEffect, useMemo, useRef } from "react";
import Editor from "@monaco-editor/react";
import type { editor as MonacoEditorTypes } from "monaco-editor";
import { useConfigStore } from "../../lib/store/configStore";

type Props = {
    value: string;
    onChange: (v: string) => void;
};

type MarkerData = {
    severity: number;
    message: string;
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
};

export default function ConfigEditor({ value, onChange }: Props) {
    const setRawText = useConfigStore((s) => s.setRawText);
    const errors = useConfigStore((s) => s.errors);
    const selectedLine = useConfigStore((s) => s.selectedLine);
    const setSelectedLine = useConfigStore((s) => s.setSelectedLine);
    const editorRef = useRef<MonacoEditorTypes.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<any>(null);

    const markers = useMemo<MarkerData[]>(
        () =>
            errors.map((err) => ({
                severity: 8,
                message: err.message,
                startLineNumber: Math.max(1, err.line || 1),
                startColumn: 1,
                endLineNumber: Math.max(1, err.line || 1),
                endColumn: 1,
            })),
        [errors],
    );

    useEffect(() => {
        setRawText(value);
    }, [setRawText, value]);

    useEffect(() => {
        const editor = editorRef.current;
        if (!editor || !selectedLine || selectedLine < 1) return;
        editor.revealLineInCenter(selectedLine);
        editor.setPosition({ lineNumber: selectedLine, column: 1 });
        editor.focus();
    }, [selectedLine]);

    useEffect(() => {
        if (!monacoRef.current || !editorRef.current) return;
        const model = editorRef.current.getModel();
        if (!model) return;
        monacoRef.current.editor.setModelMarkers(model, "nginx-config", markers as any);
    }, [markers]);

    const registerNginxLanguage = (monaco: any) => {
        monaco.languages.register({ id: "nginx" });
        monaco.languages.setMonarchTokensProvider("nginx", {
            tokenizer: {
                root: [
                    [/#.*$/, "comment"],
                    [/\b(server|location|http|upstream|listen|server_name|root|proxy_pass|fastcgi_pass|return|rewrite|try_files|add_header|proxy_set_header|gzip|proxy_cache)\b/, "keyword"],
                    [/[{};]/, "delimiter"],
                    [/".*?"/, "string"],
                    [/'[^']*'/, "string"],
                ],
            },
        });
    };

    return (
        <div className="editor-shell">
            <div className="editor-card">
                <div className="editor-toolbar">
                    <div>
                        <div className="panel-label">Nginx Config</div>
                        <div className="panel-caption">Editor with syntax highlighting</div>
                    </div>
                    <span className="page-badge">Monaco</span>
                </div>
                <div className="editor-frame">
                    <Editor
                        height="100%"
                        language="nginx"
                        theme="vs-dark"
                        value={value}
                        onChange={(nextValue: string | undefined) => {
                            const next = nextValue ?? "";
                            onChange(next);
                            setRawText(next);
                        }}
                        onMount={(editor: MonacoEditorTypes.IStandaloneCodeEditor, monaco: any) => {
                            editorRef.current = editor;
                            monacoRef.current = monaco;
                            registerNginxLanguage(monaco);
                            const model = editor.getModel();
                            if (model) monaco.editor.setModelMarkers(model, "nginx-config", markers as any);
                        }}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 13,
                            wordWrap: "on",
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                        }}
                    />
                </div>
            </div>

            <div className="card" style={{ flexShrink: 0 }}>
                <div className="card-header">
                    <span className="card-title">Parser errors</span>
                    <button type="button" onClick={() => setSelectedLine(null)} className="button-secondary" style={{ padding: "0.3rem 0.6rem", fontSize: "0.72rem" }}>
                        Clear
                    </button>
                </div>
                <div className="card-body">
                    {errors.length === 0 ? (
                        <div className="muted" style={{ fontSize: "0.82rem" }}>No parser errors.</div>
                    ) : (
                        <div className="stack">
                            {errors.map((err, idx) => (
                                <button
                                    key={`${err.line}-${idx}`}
                                    type="button"
                                    onClick={() => setSelectedLine(err.line)}
                                    className="button-dark"
                                    style={{ textAlign: "left", borderColor: "rgba(251, 113, 133, 0.2)" }}
                                >
                                    <div style={{ fontWeight: 600, fontSize: "0.8rem" }}>Line {err.line || 1}</div>
                                    <div className="muted" style={{ fontSize: "0.75rem", marginTop: 2 }}>{err.message}</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
