# create-starter-kit

This folder generates Boiler Plate template strings for empowering FastEdge application scaffolding.

It is intended to be consumed by:

- FastEdge MCP Server
- npm create fastedge-app

## Folder structure

`/src/assets`

This is where all the starter-kit projects live. They are split by type (http/cdn) and then by language.

`/src/index.ts`

Entrypoint of build tool. There is a configuration object within the main() function.

## Building

```bash
npm run build
```

This will output `.dist/resources.ts`. This file exports a Javascript object FastEdgeTemplates.

Copy this file to whichever consuming project requires it.

## Dependencies

Updating dependencies throughout the `./src/assets` folder is made easier with the help the following two scripts.

```bash
./update-cargo-dependency < dependency > < version >
```

```bash
./update-npm-package < dependency > < version >
```
