# create-fastedge-app — Context Index

**READ THIS FIRST** — tells you what to read based on your task.

**Last Updated**: April 2026

---

## Quick Overview

**create-fastedge-app** is a CLI tool for scaffolding FastEdge applications from templates. Interactive CLI using @clack/prompts. Dual consumer: npm CLI + FastEdge MCP Server (via `dist/resources.ts`).

**Tech Stack**: TypeScript, @clack/prompts, esbuild, pnpm

---

## Decision Tree: What to Read When

| Task | Read |
|------|------|
| Understand the project | `PROJECT_OVERVIEW.md` |
| Find what changed recently | Grep `CHANGELOG.md` (never read linearly) |
| Understand template build process | `PROJECT_OVERVIEW.md` → "How It Works" section |
| Add/modify a template | Look at existing templates in `src/assets/{type}/{template}/{language}/` |
| Update dependencies across templates | See `update-npm-package.js` and `update-cargo-dependency.js` in repo root |
| Understand shared assets | `src/assets/shared/` — merged into all scaffolded projects at build time |
| Understand MCP server integration | `PROJECT_OVERVIEW.md` → "Dual Consumer Model" section |

---

## File Map

```
context/
├── CONTEXT_INDEX.md          ← You are here
├── PROJECT_OVERVIEW.md       # Architecture, templates, build process, dual consumer model
├── CHANGELOG.md              # Change history — search, don't read linearly
└── SEARCH_GUIDE.md           # Grep patterns for finding things
```

---

## Template Inventory (April 2026)

| Template | Languages | Type |
|----------|-----------|------|
| `http/base-example` | JavaScript, TypeScript, Rust | HTTP |
| `http/react-app` | JavaScript, TypeScript | HTTP |
| `http/react-app-hono` | JavaScript, TypeScript | HTTP |
| `cdn/base-example` | AssemblyScript, Rust | CDN |

**9 template/language combinations. 4 template types.**

---

## Shared Assets (What Every Scaffolded Project Gets)

`src/assets/shared/` contains files merged into all scaffolded projects:

- **`CLAUDE.md`** — Slim pointer for Claude Code users: install the `gcore-fastedge` plugin + MCP server
- **`AGENTS.md`** — Slim pointer for Codex users: add the MCP server + reference the plugin

These are **pointers only** — no SDK documentation, no coding patterns. All FastEdge development knowledge lives in the `gcore-fastedge` Claude plugin (pipeline-generated, auto-updated) and MCP server resources.

**Previous state (before April 2026):** Shipped 4 `.claude/skills/` directories with SDK documentation that became stale and contained incorrect API references. These were removed and replaced with the slim pointers above. See `architecture/PLUGIN_MCP_STRATEGY.md` in the coordinator repo for rationale.

---

## Key Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| Shared assets are slim pointers, not documentation | SDK docs go stale without an update mechanism. The plugin has a pipeline; this repo doesn't. |
| CLAUDE.md + AGENTS.md (not skills) | Skills shipped in templates had 6 critical inaccuracies. Pointers can't go stale. |
| `.fastedge-debug/` in all .gitignore templates | Debugger artifacts should never be committed |
| Dual consumer model (npm CLI + MCP server) | Same templates, different interfaces. `dist/resources.ts` is the shared artifact. |
| Build-time template merging | `createStarterKit()` merges `{...sharedFiles, ...templateFiles}` — shared assets always included |

---

## Build Process (Quick Reference)

```bash
pnpm install
pnpm run build                    # Full build (all steps below)
pnpm run build:starter-kit        # Step 1: Read src/assets/ → dist/resources.ts
pnpm run copy:resources           # Step 2: Copy dist/resources.ts → src/create-app/resources.ts
pnpm run build:available-templates # Step 3: Generate available-templates.ts
pnpm run build:create-app         # Step 4: esbuild → bin/create-fastedge-app.js
pnpm start                        # Build + run CLI
```

---

## What's Next

1. **Add `"main"` entrypoint to `react-app-hono` `package.json`** — The react-app-hono template's package.json is missing the `"main"` field. This should be added for consistency and proper module resolution.

2. **Discuss adding a `.vscode` folder with `launch.json`** — Consider shipping a `.vscode/launch.json` in templates (possibly via shared assets) to give VS Code users a ready-made debug configuration. Needs discussion: should this be shared across all templates or template-specific? What debug configurations make sense for FastEdge apps?

---

## Search Patterns

**Don't read CHANGELOG.md linearly.** Use grep:

```bash
grep -i "template" context/CHANGELOG.md
grep -i "rust" context/CHANGELOG.md
grep -i "shared" context/CHANGELOG.md
grep -i "skill" context/CHANGELOG.md
```
