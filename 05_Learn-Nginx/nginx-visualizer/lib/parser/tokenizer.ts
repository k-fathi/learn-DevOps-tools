export type TokenType = "WORD" | "STRING" | "LBRACE" | "RBRACE" | "SEMI" | "EOF";

export interface Token {
    type: TokenType;
    value: string;
    line: number;
    col: number;
}

export function tokenize(src: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;
    let line = 1;
    let col = 1;
    const advance = (n = 1) => {
        for (let k = 0; k < n; k++) {
            if (src[i] === "\n") {
                line++;
                col = 1;
            } else col++;
            i++;
        }
    };

    while (i < src.length) {
        const c = src[i];

        if (c === " " || c === "\t" || c === "\n" || c === "\r") {
            advance();
            continue;
        }

        if (c === "#") {
            while (i < src.length && src[i] !== "\n") advance();
            continue;
        }

        if (c === "{") {
            tokens.push({ type: "LBRACE", value: "{", line, col });
            advance();
            continue;
        }
        if (c === "}") {
            tokens.push({ type: "RBRACE", value: "}", line, col });
            advance();
            continue;
        }
        if (c === ";") {
            tokens.push({ type: "SEMI", value: ";", line, col });
            advance();
            continue;
        }

        if (c === '"' || c === "'") {
            const quote = c;
            const startLine = line;
            const startCol = col;
            let val = "";
            advance();
            while (i < src.length && src[i] !== quote) {
                if (src[i] === "\\" && i + 1 < src.length) {
                    val += src[i + 1];
                    advance(2);
                    continue;
                }
                val += src[i];
                advance();
            }
            advance(); // closing quote
            tokens.push({ type: "STRING", value: val, line: startLine, col: startCol });
            continue;
        }

        const startLine = line;
        const startCol = col;
        let val = "";
        while (i < src.length && !/[\s{};#]/.test(src[i])) {
            val += src[i];
            advance();
        }
        if (val) tokens.push({ type: "WORD", value: val, line: startLine, col: startCol });
        else advance();
    }

    tokens.push({ type: "EOF", value: "", line, col });
    return tokens;
}
