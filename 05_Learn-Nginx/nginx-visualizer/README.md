# NGINX Configuration Visualizer (scaffold)

This folder contains the initial scaffold for the NGINX Configuration Visualizer described in the project design.

What is included so far:

- Minimal `package.json`.
- Parser sources: `lib/parser/tokenizer.ts`, `lib/parser/parser.ts`, `lib/parser/ast-types.ts`.
- A sample config under `sample-configs/` for quick parsing tests.

Next steps:

1. Run TypeScript typecheck or add a small runner to exercise the tokenizer + parser.
2. Wire AST normalization and the React/Next UI.

Files added in this commit are links in the repository.
