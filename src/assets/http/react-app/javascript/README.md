# FastEdge React Application

A React + Vite frontend served as a static-site from a FastEdge application.

All front-end files are compiled and embedded within the wasm. [Read more](https://g-core.github.io/FastEdge-sdk-js/guides/creating-a-static-manifest/)

For a more complete React site with a backend server try the `react-app-hono` template.

## Build

```bash
npm install
npm run build
```

This will create `./wasm/react-app.wasm` ready for deployment.

## Deploy

Use the FastEdge CLI or API to deploy the generated wasm binary file.

## Development

```bash
npm run dev
```

This will run the Vite server for developing your React front-end with HMR.
