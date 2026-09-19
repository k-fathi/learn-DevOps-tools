import { Token } from "./tokenizer";
import { Node, Block, Directive } from "./ast-types";

export function parse(tokens: Token[]): Node[] {
    let pos = 0;
    const peek = () => tokens[pos];
    const next = () => tokens[pos++];
    const parseError = (message: string, token = peek()) => {
        const err = new Error(message) as Error & { line?: number; col?: number };
        err.line = token?.line ?? 0;
        err.col = token?.col ?? 0;
        throw err;
    };

    function parseBlockBody(): Node[] {
        const nodes: Node[] = [];
        while (peek().type !== "RBRACE" && peek().type !== "EOF") {
            if (peek().type !== "WORD" && peek().type !== "STRING") {
                parseError(`Unexpected token ${peek().type}; expected a directive or block name`);
            }
            nodes.push(parseStatement());
        }
        if (peek().type !== "RBRACE" && peek().type !== "EOF") {
            parseError(`Unterminated block; expected "}"`);
        }
        return nodes;
    }

    function parseStatement(): Node {
        if (peek().type !== "WORD" && peek().type !== "STRING") {
            parseError(`Unexpected token ${peek().type}; expected a directive or block name`);
        }
        const nameTok = next(); // WORD or STRING
        const line = nameTok.line;
        const args: string[] = [];

        while (peek().type === "WORD" || peek().type === "STRING") {
            args.push(next().value);
        }

        if (peek().type === "LBRACE") {
            next(); // consume {
            const children = parseBlockBody();
            if (peek().type !== "RBRACE") parseError(`Unterminated block for ${nameTok.value}; expected "}"`, peek());
            next(); // consume }
            const block: Block = { kind: "block", name: nameTok.value, args, children, line };
            return block;
        }

        if (peek().type === "SEMI") next(); // consume ;
        else if (peek().type !== "EOF" && peek().type !== "RBRACE") {
            parseError(`Expected ";" or "{" after ${nameTok.value}`, peek());
        }
        const directive: Directive = { kind: "directive", name: nameTok.value, args, line };
        return directive;
    }

    const root: Node[] = [];
    while (peek().type !== "EOF") {
        if (peek().type === "RBRACE") parseError(`Unexpected "}" without a matching opening block`, peek());
        root.push(parseStatement());
    }
    return root;
}
