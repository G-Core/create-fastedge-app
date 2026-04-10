# AI Agent Instructions for create-fastedge-app

## What This Repo Is

**create-fastedge-app** is a CLI tool for scaffolding FastEdge applications from templates. It is consumed two ways:

1. **npm CLI**: `npx create-fastedge-app` — interactive prompts for developers
2. **MCP Server**: `scaffold-fastedge-project` tool imports `dist/resources.ts` programmatically

## Discovery-Based Context

Read `context/CONTEXT_INDEX.md` first. It tells you what to read based on your task. Do not read all context upfront.

## Quick Reference

**Build:**
```bash
pnpm install
pnpm run build              # Full build (templates + CLI)
pnpm run build:starter-kit  # Rebuild templates only
pnpm start                  # Build and run CLI
```

**Tech Stack:** TypeScript, @clack/prompts, esbuild, pnpm

## Shared Assets

Files in `src/assets/shared/` are merged into **every** scaffolded project (all templates, all languages). Currently ships:

- `CLAUDE.md` — Slim pointer directing Claude Code users to install the `gcore-fastedge` plugin and MCP server
- `AGENTS.md` — Slim pointer directing Codex users to the MCP server and plugin

These files contain **no SDK documentation or coding guidance** — they are purely pointers to the maintained knowledge sources (the Claude plugin's pipeline-generated reference docs and MCP server resources).

## Template Inventory

| Template | Languages | Type |
|----------|-----------|------|
| `http/base-example` | JavaScript, TypeScript, Rust | HTTP |
| `http/react-app` | JavaScript, TypeScript | HTTP |
| `http/react-app-hono` | JavaScript, TypeScript | HTTP |
| `cdn/base-example` | AssemblyScript, Rust | CDN |

**9 template/language combinations total.**

Each template's `.gitignore` includes `**/.fastedge-debug/` for debugger artifacts.

## Key Architecture

- `src/assets/shared/` — merged into all projects (CLAUDE.md, AGENTS.md)
- `src/assets/{http,cdn}/{template}/{language}/` — per-template source code
- `src/create-starter-kit/create-starter-kit.ts` — merges `{...sharedFiles, ...templateFiles}` at build time
- `dist/resources.ts` — serialized template bundle (consumed by CLI and MCP server)
- `bin/create-fastedge-app.js` — bundled CLI binary (esbuild)

## Important Constraints

- Shared assets must be **slim pointers only** — no SDK docs, no coding patterns, no stale API references
- All FastEdge development knowledge lives in the `gcore-fastedge` Claude plugin (pipeline-generated, auto-updated) and MCP server resources
- This repo provides **templates and scaffolding**, not documentation

---

**Last Updated**: April 2026
