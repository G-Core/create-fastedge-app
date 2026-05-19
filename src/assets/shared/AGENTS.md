# FastEdge Application

This is a [Gcore FastEdge](https://gcore.com/cloud/fastedge) edge computing application — Wasm-powered serverless compute on 210+ global PoPs.

## Getting Started with AI-Assisted Development

### MCP Server (Recommended)

Add the FastEdge MCP server for build and deploy tools:

```
codex mcp add fastedge -- docker run -i --rm --pull=always -v "${PWD}:/workspace" -e GCORE_API_KEY ghcr.io/g-core/fastedge-mcp-server:latest
```

**What you get:**
- `build-wasm` — Compile to WASM (no local toolchain setup needed)
- `upload-binary` — Upload WASM to FastEdge
- `update-or-create-app` — Deploy or update applications
- `update-env-vars-app` — Manage environment variables and secrets
- SDK reference docs as MCP resources

### Claude Code Plugin (Premium Experience)

For blueprint-driven scaffolding, TDD integration, and guided workflows, use Claude Code with the FastEdge plugin:

```
claude plugin add gcore-fastedge
```

Future codex plugin coming soon 🚀
