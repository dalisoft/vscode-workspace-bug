# vscode-workspace-bug

This repository shows example of how VSCode workspaces does not work

## References issues

### IntelliSense wrong import path

\[SOLVED\] <strike><https://github.com/microsoft/TypeScript/issues/50595></strike>

See these comments and workarounds

- <https://github.com/microsoft/TypeScript/issues/50595#issuecomment-1235804750> (solution for Node.js)
- <https://github.com/microsoft/TypeScript/issues/50152#issue-1326498173>
- <https://github.com/microsoft/TypeScript/issues/50595#issuecomment-1235935874> (workaround for Node.js & bundlers)

### IntelliSense workspaces not working

- <https://github.com/microsoft/vscode/issues/159071>
- <https://github.com/microsoft/vscode/issues/160078> (see workaround in comments)

## Where it works?

- WebStorm
- VSCode (until & including v1.59.1)

## Where it does not work?

- VSCode (after v1.59.1)
- Sublime Text + TypeScript package + LSP-typescript package
