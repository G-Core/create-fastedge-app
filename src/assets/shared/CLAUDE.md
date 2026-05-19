# FastEdge Application

This is a [Gcore FastEdge](https://gcore.com/cloud/fastedge) edge computing application — Wasm-powered serverless compute on 210+ global PoPs.

## Getting Started with AI-Assisted Development

### Claude Code

Install the FastEdge plugin for the full development experience:

```
claude plugin add gcore-fastedge
```

**What you get:**
- `/gcore-fastedge:scaffold` — Add features to your project (KV store, auth, geo-routing, etc.)
- `/gcore-fastedge:test` — Set up TDD with `@gcoredev/fastedge-test`
- `/gcore-fastedge:deploy` — Build, test, and deploy to FastEdge
- `/gcore-fastedge:manage` — Manage apps, secrets, environment variables
- Auto-triggered SDK reference and best practices

### MCP Server (All Editors)

Add the FastEdge MCP server for build and deploy tools. Works with Claude Code, Cursor, VS Code Copilot, and Windsurf.

```json
{
  "mcpServers": {
    "fastedge": {
      "type": "stdio",
      "command": "docker",
      "args": [
        "run", "-i", "--rm", "--pull=always",
        "-v", "${workspaceFolder}:/workspace",
        "-e", "GCORE_API_KEY",
        "ghcr.io/g-core/fastedge-mcp-server:latest"
      ]
    }
  }
}
```

**What you get:**
- `build-wasm` — Compile to WASM (no local toolchain setup needed)
- `upload-binary` — Upload WASM to FastEdge
- `update-or-create-app` — Deploy or update applications
- `update-env-vars-app` — Manage environment variables and secrets
- SDK reference docs as MCP resources

