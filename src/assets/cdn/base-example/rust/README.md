# FastEdge Basic CDN Application

A simple FastEdge proxy-wasm application that defines the different event hooks for Request/Response.

## Build

```bash
cargo build --release
```

This will create `./target/wasm32-wasip1/release/basic_cdn.wasm` ready for deployment.

## Deploy

Use the FastEdge CLI or API to deploy the generated wasm binary file.