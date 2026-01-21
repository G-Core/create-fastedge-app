# FastEdge-app

This repo generates Boiler Plate template strings for empowering FastEdge application scaffolding.

It is intended to be consumed by:

- FastEdge MCP Server
- npm create fastedge-app

## Folder structure

`/src/assets`

This is where all the starter-kit projects live. They are split by type (http/cdn) and then by language.

`/src/create-starter-kit/index.ts`

Entrypoint of assets/resources build tool. There is a configuration object within the main() function.

`/src/create-app/index.ts`

This is the entrypoint for the repo's binary. e.g. the script that enables: `npm create fastedge-app`

## Building

### Building Assets

```bash
npm run build:starter-kit
```

This will output `.dist/resources.ts`. This file exports a Javascript object of FastEdgeTemplates.

Copy this file to whichever consuming project requires it. i.e. MCP Server.

## Dependencies

Updating dependencies throughout the `./src/assets` folder is made easier with the help the following two scripts.

```bash
./update-cargo-dependency < dependency > < version >
```

```bash
./update-npm-package < dependency > < version >
```
