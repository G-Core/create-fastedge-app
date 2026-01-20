#!/usr/bin/env node

import fs from "fs/promises";
import path from "node:path";
import { glob } from "glob";
import * as toml from "@iarna/toml";

async function updateCargoTomlDeps(rootDir, dep, newVersion) {
  const files = await glob("**/Cargo.toml", { cwd: rootDir, absolute: true });

  for (const file of files) {
    const content = await fs.readFile(file, "utf-8");
    const data = toml.parse(content);

    if (data.dependencies && data.dependencies[dep]) {
      data.dependencies[dep] = newVersion;
      const newToml = toml.stringify(data);
      await fs.writeFile(file, newToml, "utf-8");
      console.log(`Updated ${dep} in ${file}`);
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length !== 2) {
  console.error("Usage: ./update-cargo-dependency.js <dependency> <version>");
  console.error("Example: ./update-cargo-dependency.js fastedge 0.8");
  process.exit(1);
}

const [dependency, version] = args;
const cdw = process.cwd(); // Use current working directory

const rootDir = path.resolve(cdw, "./src/assets");
// Usage:
updateCargoTomlDeps(rootDir, dependency, version);
