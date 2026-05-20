# FastEdge Basic Application

A simple FastEdge application that responds to HTTP requests.

## Build

```bash
cargo build --release
```

This will create `./target/wasm32-wasip2/release/basic_wasi_http.wasm` ready for deployment.

## Deploy

Use the FastEdge CLI or API to deploy the generated wasm binary file.
