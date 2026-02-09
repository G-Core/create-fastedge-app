# AI Agent Instructions for create-fastedge-app

## 🎯 CRITICAL: Read Smart, Not Everything

**DO NOT read all context files upfront.** This repository uses a **discovery-based context system** to minimize token usage while maximizing effectiveness.

---

## Getting Started: Discovery Pattern

### Step 1: Read the Index (REQUIRED - ~100 lines)

**First action when starting work**: Read `context/CONTEXT_INDEX.md`

This lightweight file gives you:
- CLI tool overview and quick start
- Documentation map organized by topic
- Decision tree for what to read when
- Search patterns for finding information

### Step 2: Read Based on Your Task (JUST-IN-TIME)

Use the decision tree in CONTEXT_INDEX.md to determine what to read. **Only read what's relevant to your current task.**

**Examples:**

**Task: "Add new template"**
- Read: `context/templates/TEMPLATE_SYSTEM.md`
- Read: `context/templates/ADDING_TEMPLATES.md`
- Grep: `context/CHANGELOG.md` for template additions

**Task: "Fix CLI prompts"**
- Read: `context/architecture/CLI_SYSTEM.md`
- Read: `context/development/IMPLEMENTATION_GUIDE.md`
- Grep: `context/CHANGELOG.md` for "prompt" or "cli"

**Task: "Modify build process"**
- Read: `context/architecture/BUILD_SYSTEM.md`
- Read: `context/templates/TEMPLATE_GENERATION.md`
- Grep: `context/CHANGELOG.md` for "build"

**Task: "Update template dependencies"**
- Read: `context/templates/DEPENDENCY_MANAGEMENT.md`
- Read: `context/development/UPDATE_SCRIPTS.md`

### Step 3: Search, Don't Read Everything

**Use grep and search tools** instead of reading large docs linearly:

- **CHANGELOG.md**: **NEVER read linearly** - use grep to search for keywords
- **Template docs**: Read specific template type, not all templates
- **Architecture docs**: Read specific sections, not entire file

See `context/SEARCH_GUIDE.md` for search patterns and examples.

---

## 📋 Decision Tree Reference

**Quick lookup for common tasks:**

| Task Type | What to Read |
|-----------|-------------|
| **Adding new template** | TEMPLATE_SYSTEM + ADDING_TEMPLATES + grep CHANGELOG |
| **Modifying existing template** | Specific template doc + TEMPLATE_SYSTEM |
| **CLI changes** | CLI_SYSTEM + CLACK_PROMPTS |
| **Build process** | BUILD_SYSTEM + TEMPLATE_GENERATION |
| **Dependency updates** | DEPENDENCY_MANAGEMENT + UPDATE_SCRIPTS |
| **Template validation** | VALIDATION_SYSTEM |
| **Understanding CLI flow** | PROJECT_OVERVIEW + CLI_SYSTEM |
| **Resource generation** | TEMPLATE_GENERATION + RESOURCE_BUNDLING |

---

## 🚫 Anti-Patterns (What NOT to Do)

❌ **Don't**: Read all template docs upfront (wastes tokens)
❌ **Don't**: Read CHANGELOG.md linearly (use grep instead)
❌ **Don't**: Read entire docs when you need specific sections
❌ **Don't**: Read templates you're not working on
❌ **Don't**: Start coding without reading TEMPLATE_SYSTEM basics

✅ **Do**: Read CONTEXT_INDEX.md first
✅ **Do**: Use grep to search CHANGELOG and large docs
✅ **Do**: Read only sections relevant to current task
✅ **Do**: Read documentation just-in-time when you need it
✅ **Do**: Follow links in docs to discover related information

---

## ⚡ Critical Working Practices

### Task Checklists (ALWAYS USE)

When starting any non-trivial task (multi-step, multiple files, refactoring, features, etc.):

1. **First action**: Use TaskCreate to break down the work into trackable tasks
2. Update task status as you work (`in_progress` → `completed`)
3. This gives the user real-time visibility into progress

**When to create task checklists:**
- Multi-step tasks (3+ steps)
- Tasks involving multiple templates
- Adding new templates
- Build system changes
- Dependency updates across templates

### Parallel Agents (USE WHEN POSSIBLE)

When tasks are **independent** (different templates, different components, no dependencies):

1. **Spawn multiple agents in parallel** using multiple Task tool calls in a **single message**
2. Each agent works concurrently on its task
3. **Massive time savings**: 10-15x faster than sequential processing

**When to use parallel agents:**
- Updating multiple templates
- Testing multiple templates
- Documentation updates across multiple files

**When NOT to use:**
- Tasks with dependencies (B needs A's output)
- Tasks modifying the same template
- Build process changes (sequential)

---

## 📝 Documentation Maintenance

### When to Update Context Files

**After completing major features:**
- Update `context/CHANGELOG.md` - Add detailed entry at the TOP (reverse chronological)
- Update `context/PROJECT_OVERVIEW.md` - Update capabilities list
- Update or create template-specific doc in `context/templates/`

**After template additions:**
- Update `context/templates/AVAILABLE_TEMPLATES.md`
- Update `context/CHANGELOG.md`
- Create template-specific doc if needed

**After significant bug fixes:**
- Update `context/CHANGELOG.md` with the fix
- Update relevant docs' Known Issues sections

**What NOT to document:**
- Trivial typo fixes
- Code formatting changes
- Comment updates
- Routine dependency updates (unless they change functionality)

### Changelog Entry Format

```markdown
## [Date] - [Feature/Template Name]

### Overview
Brief description of what was accomplished

### 🎯 What Was Completed

#### 1. [Component/Template Name]
- Detail 1
- Detail 2

**Files Modified:**
- path/to/file.ts - What changed

**Files Created:**
- path/to/file.ts - Purpose

### 🧪 Testing
How to test the changes

### 📝 Notes
Any important context, decisions, or gotchas
```

---

## 📁 Context Organization

The context folder is organized by topic:

```
context/
├── CONTEXT_INDEX.md          # Read this first (~100 lines)
├── PROJECT_OVERVIEW.md       # Lightweight overview
├── CHANGELOG.md              # Search, don't read linearly
├── SEARCH_GUIDE.md           # How to search effectively
│
├── architecture/             # Read when modifying structure
│   ├── CLI_SYSTEM.md             # CLI implementation and flow
│   ├── BUILD_SYSTEM.md           # Build and bundling process
│   ├── CLACK_PROMPTS.md          # Interactive prompt system
│   └── RESOURCE_BUNDLING.md      # How resources.ts is generated
│
├── templates/                # Read specific template when needed
│   ├── TEMPLATE_SYSTEM.md        # How templates work
│   ├── ADDING_TEMPLATES.md       # Adding new templates
│   ├── AVAILABLE_TEMPLATES.md    # List of all templates
│   ├── HTTP_TEMPLATES.md         # HTTP template types
│   ├── CDN_TEMPLATES.md          # CDN template types
│   ├── TEMPLATE_GENERATION.md    # Build process for templates
│   ├── DEPENDENCY_MANAGEMENT.md  # Managing template dependencies
│   └── VALIDATION_SYSTEM.md      # Template validation
│
└── development/              # Read when implementing/testing
    ├── IMPLEMENTATION_GUIDE.md   # Coding patterns
    ├── TESTING_GUIDE.md          # Testing CLI and templates
    └── UPDATE_SCRIPTS.md         # Dependency update scripts
```

---

## 🔍 Search Tips

**Instead of reading CHANGELOG.md:**
```bash
grep -i "template" context/CHANGELOG.md
grep -i "http-react" context/CHANGELOG.md
grep -i "fix.*cli" context/CHANGELOG.md
```

**Find template documentation:**
```bash
ls context/templates/ | grep -i "http"
```

**Search across all context:**
```bash
grep -r "clack prompts" context/
grep -r "starter kit" context/
```

**See `context/SEARCH_GUIDE.md` for comprehensive search patterns.**

---

## CLI Tool Overview

**create-fastedge-app** is a CLI tool for scaffolding FastEdge applications from templates.

### Key Capabilities:
- **Interactive Prompts**: Using @clack/prompts for beautiful CLI UX
- **Multiple Templates**: HTTP (base, React, React+Hono) and CDN
- **Multi-Language**: JavaScript, TypeScript, AssemblyScript, Rust
- **Template Generation**: Builds starter kits into bundled resources
- **Dual Consumer**: Used by npm CLI and FastEdge MCP Server

### Usage:
```bash
# npm
npm create fastedge-app

# npx
npx create-fastedge-app

# From MCP Server
scaffold-fastedge-project tool
```

### Tech Stack:
- **Language**: TypeScript
- **CLI Framework**: @clack/prompts
- **Build Tool**: esbuild + custom starter-kit builder
- **Package Manager**: pnpm

---

## Quick Reference

**Common Commands:**
```bash
pnpm install
pnpm run build              # Build everything (templates + CLI)
pnpm run build:starter-kit  # Build templates only
pnpm run build:create-app   # Build CLI only
pnpm start                  # Build and run CLI
```

**Project Structure:**
```
create-fastedge-app/
├── src/
│   ├── assets/             # Template starter kits
│   │   ├── http/           # HTTP templates
│   │   │   ├── base-example/
│   │   │   ├── react-app/
│   │   │   └── react-app-hono/
│   │   └── cdn/            # CDN templates
│   │       └── base-example/
│   │
│   ├── create-starter-kit/ # Template builder
│   │   ├── index.ts        # Build entrypoint
│   │   ├── create-starter-kit.ts
│   │   └── types.ts
│   │
│   ├── create-app/         # CLI implementation
│   │   ├── index.ts        # CLI entrypoint
│   │   ├── create-files.ts
│   │   ├── validate-config.ts
│   │   ├── print-info.ts
│   │   └── resources.ts    # Generated from build
│   │
│   └── utils/              # Shared utilities
│
├── bin/
│   └── create-fastedge-app.js  # CLI binary
│
├── dist/
│   └── resources.ts        # Generated template bundle
│
├── scripts/                # Build scripts
├── esbuild/                # Build configuration
├── update-cargo-dependency.js
├── update-npm-package.js
└── package.json
```

**Key Files:**
- `src/assets/` - Template source files
- `src/create-starter-kit/index.ts` - Template build logic
- `src/create-app/index.ts` - CLI implementation
- `dist/resources.ts` - Generated template bundle (copied to src/create-app/)

---

## Summary: How to Work Efficiently

1. **Read `context/CONTEXT_INDEX.md` first** (~100 lines, ~250 tokens)
2. **Use the decision tree** to identify what docs are relevant
3. **Read only what you need** for your current task (~500-2,000 tokens)
4. **Use grep to search** CHANGELOG and large docs instead of reading linearly
5. **Follow links** in documentation to discover related information
6. **Create task checklists** for non-trivial tasks
7. **Use parallel agents** when tasks are independent
8. **Update documentation** after completing significant work

**Token Savings**: 75-80% reduction vs. reading all docs upfront

**Result**: Faster agent startup, better focus, scalable documentation system

---

## Important Notes

**This is a standalone repository:**
- Can be used independently
- Does not depend on the coordinator structure
- Has its own git repository
- Self-contained with all dependencies

**When working in this repo:**
- Follow the patterns established here
- Update context files in this repo's context/ folder
- Keep documentation focused on the CLI tool and templates

**Dual consumer model:**
- **npm CLI**: `npm create fastedge-app` - Direct usage by developers
- **MCP Server**: Uses `dist/resources.ts` - Programmatic template access

---

**Last Updated**: February 2026
