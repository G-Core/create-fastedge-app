import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { FastEdgeTemplates } from "./types.js";
import { createStarterKit } from "./create-starter-kit.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script to generate FastEdgeTemplates code at build time.
 * Contents is generated and saved for use by tools such as "MCP server" and "create-fastedge-app".
 */

async function writeResourceFile(
  dir: string,
  outputName: string,
  content: FastEdgeTemplates,
): Promise<void> {
  try {
    console.log("📝 Writing resource file...", dir, outputName);
    const resourceDir = path.join(__dirname, dir);
    const resourceTSFile = path.join(resourceDir, `${outputName}.ts`);
    await fs.mkdir(resourceDir, { recursive: true });
    await fs.writeFile(
      resourceTSFile,
      `export const FastEdgeTemplates = ${JSON.stringify(content)};`,
      "utf-8",
    );
  } catch (error) {
    console.error("Failed to write resource files:", error);
  }
}

async function main() {
  try {
    const fastEdgeTemplates: FastEdgeTemplates = {
      "http-base": await createStarterKit(
        "http-base",
        "Simple request/response handling application",
        "http",
      ),
      "http-react": await createStarterKit(
        "http-react",
        "React application starter-kit using Vite, static server only",
        "http",
      ),
      "http-react-hono": await createStarterKit(
        "http-react-hono",
        "React application starter-kit using Vite and Hono framework, provides backend server functionality",
        "http",
      ),
      "cdn-base": await createStarterKit(
        "cdn-base",
        "Simple CDN wireframe for request/response event hooks",
        "cdn",
      ),
    };

    await writeResourceFile("../../dist", "resources", fastEdgeTemplates);
  } catch (err) {
    console.error("❌ Error updating documentation:", err);
  }
}

main();
