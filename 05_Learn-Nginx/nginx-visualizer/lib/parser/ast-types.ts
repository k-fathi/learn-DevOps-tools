export interface Directive {
    kind: "directive";
    name: string;
    args: string[];
    line: number;
}

export interface Block {
    kind: "block";
    name: string;
    args: string[];
    children: Node[];
    line: number;
}

export type Node = Directive | Block;

export interface ConfigAST {
    root: Node[];
}
