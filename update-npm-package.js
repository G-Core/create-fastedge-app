#!/usr/bin/env node

import fs from "fs/promises";
import path from "node:path";
import { glob } from "glob";

async function updatePackageJsonDeps(rootDir, dep, version) {
  const files = await glob("**/package.json", { cwd: rootDir, absolute: true });

  const newVersion =
    version[0] === "^" || version[0] === "~" ? version : `^${version}`;

  for (const file of files) {
    try {
      const content = await fs.readFile(file, "utf-8");
      const data = JSON.parse(content);
      let updated = false;

      // Check and update dependencies
      if (data.dependencies && data.dependencies[dep]) {
        data.dependencies[dep] = newVersion;
        updated = true;
      }

      // Check and update devDependencies
      if (data.devDependencies && data.devDependencies[dep]) {
        data.devDependencies[dep] = newVersion;
        updated = true;
      }

      // Check and update peerDependencies
      if (data.peerDependencies && data.peerDependencies[dep]) {
        data.peerDependencies[dep] = newVersion;
        updated = true;
      }

      // Check and update optionalDependencies
      if (data.optionalDependencies && data.optionalDependencies[dep]) {
        data.optionalDependencies[dep] = newVersion;
        updated = true;
      }

      if (updated) {
        const newJson = JSON.stringify(data, null, 2) + "\n";
        await fs.writeFile(file, newJson, "utf-8");
        console.log(`Updated ${dep} in ${file}`);
      }
    } catch (error) {
      console.warn(`Warning: Could not process ${file}:`, error.message);
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length !== 2) {
  console.error("Usage: ./update-npm-package.js <dependency> <version>");
  console.error("Example: ./update-npm-package.js react ^18.0.0");
  process.exit(1);
}

const [dependency, version] = args;
const cwd = process.cwd(); // Use current working directory

const rootDir = path.resolve(cwd, "./src/assets");
console.log("Searching for package.json files in:", rootDir);

// Usage:
updatePackageJsonDeps(rootDir, dependency, version);
