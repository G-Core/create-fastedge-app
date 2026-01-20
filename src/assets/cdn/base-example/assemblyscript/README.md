# FastEdge Basic CDN Application

A simple FastEdge proxy-wasm application that defines the different event hooks for Request/Response.

## Build

```bash
npm install
npm run build
```

This will create `./build/basic-cdn.wasm` ready for deployment.

## Deploy

Use the FastEdge CLI or API to deploy the generated wasm binary file.