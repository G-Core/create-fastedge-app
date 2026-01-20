import { readFileSync } from "node:fs";

import { npxPackagePath } from "~utils/npx-path.js";

const USAGE_TEXT = `
Usage: create-fastedge-app [OPTION] [DIRECTORY]

Create a new FastEdge application in the specified DIRECTORY.

If no DIRECTORY is provided, the current directory will be used.

  Options:

  -h,   --help              Print this help information
  -t,   --template
  -p,   --package-manager   Specify the package manager to use (npm, yarn, pnpm). Default is npm.
  --rs, --rust              Use Rust as the programming language for the FastEdge application.
  --js, --javascript        Use JavaScript as the programming language for the FastEdge application.
  --ts, --typescript        Use TypeScript as the programming language for the FastEdge application.
  --as, --assemblyscript    Use AssemblyScript as the programming language for the FastEdge application.


  Available templates:

    http              Simple request/response handling application
    http-react        React application starter-kit using Vite, static server only
    http-react-hono   React application starter-kit using Vite and Hono framework, provides backend server functionality
    cdn               Simple CDN wireframe for request/response event hooks

  Example:
    create-fastedge-app my-fastedge-app --typescript --template http-react
`;

/**
 * Prints the version of the FastEdge SDK.
 */
function printVersion(): void {
  const packageJsonPath = npxPackagePath("./package.json");
  const packageJsonContent = readFileSync(packageJsonPath, "utf8");
  const { version }: { version: string } = JSON.parse(packageJsonContent);
  console.log(`create-fastedge-app: ${version}`);
}

/**
 * Prints the usage help text.
 */
function printHelp(): void {
  console.log(USAGE_TEXT);
}

export { printHelp, printVersion, USAGE_TEXT };
