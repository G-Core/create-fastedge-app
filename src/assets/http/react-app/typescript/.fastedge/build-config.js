const config = {
  type: "static",
  entryPoint: ".fastedge/static-index.js",
  ignoreDotFiles: true,
  ignoreDirs: ["./node_modules"],
  ignoreWellKnown: false,
  tsConfigPath: "./tsconfig.fastedge.json",
  wasmOutput: "wasm/react-app.wasm",
  publicDir: "./dist",
  contentTypes: [],
};

const serverConfig = {
  type: "static",
  extendedCache: [],
  publicDirPrefix: "",
  compression: [],
  notFoundPage: "/404.html",
  autoExt: [],
  autoIndex: ["index.html", "index.htm"],
  spaEntrypoint: "/index.html",
};

export { config, serverConfig };
