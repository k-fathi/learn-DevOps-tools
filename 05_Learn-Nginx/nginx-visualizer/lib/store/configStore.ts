import { create } from "zustand";
import { tokenize } from "../parser/tokenizer";
import { parse } from "../parser/parser";
import { normalize } from "../graph/astToGraph";

interface ConfigStore {
    rawText: string;
    ast: any | null;
    errors: { line: number; message: string }[];
    selectedLine: number | null;
    setRawText: (text: string) => void;
    setSelectedLine: (line: number | null) => void;
}

export const useConfigStore = create<ConfigStore>((set) => ({
    rawText: "",
    ast: null,
    errors: [],
    selectedLine: null,
    setRawText: (text: string) => {
        try {
            const tokens = tokenize(text);
            const nodes = parse(tokens);
            const ast = normalize(nodes);
            set({ rawText: text, ast, errors: [], selectedLine: null });
        } catch (e: any) {
            set({ rawText: text, errors: [{ line: e.line ?? 0, message: e.message }] });
        }
    },
    setSelectedLine: (line) => set({ selectedLine: line }),
}));
