declare module "@monaco-editor/react" {
    import * as React from "react";

    export interface EditorProps {
        height?: string | number;
        language?: string;
        theme?: string;
        value?: string;
        defaultValue?: string;
        options?: Record<string, unknown>;
        onChange?: (value: string | undefined) => void;
        onMount?: (editor: any, monaco: any) => void;
    }

    const Editor: React.ComponentType<EditorProps>;
    export default Editor;
}
