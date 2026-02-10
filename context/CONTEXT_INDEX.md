# create-fastedge-app - Context Index

**READ THIS FIRST** - This is your navigation hub for understanding create-fastedge-app.

---

## Quick Overview

**create-fastedge-app** is a CLI tool for scaffolding FastEdge applications from templates. It provides an interactive experience using @clack/prompts and generates projects from built-in starter kits.

**Key Features**:
- Interactive CLI prompts for template selection
- Multiple templates: HTTP (base, React, React+Hono) and CDN
- Multi-language support: JavaScript, TypeScript, AssemblyScript, Rust
- Template generation system that bundles starter kits
- Dual consumer: npm CLI + FastEdge MCP Server

**Tech Stack**: TypeScript, @clack/prompts, esbuild, pnpm

---

## Decision Tree: What to Read When

### Working with Templates

**Task: Add new template**
→ Read: `templates/TEMPLATE_SYSTEM.md`
→ Read: `templates/ADDING_TEMPLATES.md`
→ Grep: `CHANGELOG.md` for "template" or similar additions

**Task: Modify existing template**
→ Read: specific template doc (`HTTP_TEMPLATES.md` or `CDN_TEMPLATES.md`)
→ Read: `templates/TEMPLATE_SYSTEM.md`

**Task: Update template dependencies**
→ Read: `templates/DEPENDENCY_MANAGEMENT.md`
→ Read: `development/UPDATE_SCRIPTS.md`

**Task: Fix template validation**
→ Read: `templates/VALIDATION_SYSTEM.md`
→ Grep: `CHANGELOG.md` for "validation"

### Working with CLI

**Task: Modify CLI prompts**
→ Read: `architecture/CLI_SYSTEM.md`
→ Read: `architecture/CLACK_PROMPTS.md`

**Task: Change file generation logic**
→ Read: `architecture/CLI_SYSTEM.md`
→ Read: `templates/TEMPLATE_GENERATION.md`

**Task: Add new CLI option**
→ Read: `architecture/CLI_SYSTEM.md`
→ Read: `development/IMPLEMENTATION_GUIDE.md`

### Build System

**Task: Modify build process**
→ Read: `architecture/BUILD_SYSTEM.md`
→ Read: `templates/TEMPLATE_GENERATION.md`

**Task: Change resource bundling**
→ Read: `architecture/RESOURCE_BUNDLING.md`
→ Read: `architecture/BUILD_SYSTEM.md`

**Task: Fix build scripts**
→ Read: `architecture/BUILD_SYSTEM.md`
→ Grep: `CHANGELOG.md` for "build"

### Understanding the System

**Task: Understand CLI flow**
→ Read: `PROJECT_OVERVIEW.md`
→ Read: `architecture/CLI_SYSTEM.md`

**Task: Understand template system**
→ Read: `templates/TEMPLATE_SYSTEM.md`
→ Read: `templates/AVAILABLE_TEMPLATES.md`

**Task: Understand dual consumer model**
→ Read: `PROJECT_OVERVIEW.md`
→ Read: `architecture/RESOURCE_BUNDLING.md`

---

## Documentation Map

### Core Starting Points

| Document | Lines | When to Read |
|----------|-------|--------------|
| **CONTEXT_INDEX.md** | ~100 | **Always read first** |
| **PROJECT_OVERVIEW.md** | ~200 | Understanding the CLI tool |
| **SEARCH_GUIDE.md** | ~50 | Learning how to search docs |
| **CHANGELOG.md** | Variable | **Never read linearly** - use grep |

### Architecture (Read when modifying structure)

| Document | Focus | Read When |
|----------|-------|-----------|
| **CLI_SYSTEM.md** | CLI implementation, prompts | Modifying CLI behavior |
| **BUILD_SYSTEM.md** | Build process, scripts | Changing build configuration |
| **CLACK_PROMPTS.md** | Interactive prompts | Adding/modifying prompts |
| **RESOURCE_BUNDLING.md** | Template bundling | Resource generation |

### Templates (Read specific template when needed)

| Document | Focus | Read When |
|----------|-------|-----------|
| **TEMPLATE_SYSTEM.md** | How templates work | Adding/modifying templates |
| **ADDING_TEMPLATES.md** | Template creation guide | Adding new templates |
| **AVAILABLE_TEMPLATES.md** | List of all templates | Overview of templates |
| **HTTP_TEMPLATES.md** | HTTP template types | Working with HTTP templates |
| **CDN_TEMPLATES.md** | CDN template types | Working with CDN templates |
| **TEMPLATE_GENERATION.md** | Build process | Understanding generation |
| **DEPENDENCY_MANAGEMENT.md** | Updating dependencies | Dependency updates |
| **VALIDATION_SYSTEM.md** | Template validation | Validation logic |

### Development (Read when implementing/testing)

| Document | Focus | Read When |
|----------|-------|-----------|
| **IMPLEMENTATION_GUIDE.md** | Coding patterns | Starting development |
| **TESTING_GUIDE.md** | Testing CLI/templates | Testing changes |
| **UPDATE_SCRIPTS.md** | Dependency scripts | Using update scripts |

---

## Search Patterns

**Don't read CHANGELOG.md linearly** - Use these search patterns:

```bash
# Find template changes
grep -i "http-react" context/CHANGELOG.md
grep -i "template.*add" context/CHANGELOG.md

# Find CLI changes
grep -i "prompt" context/CHANGELOG.md
grep -i "clack" context/CHANGELOG.md

# Find build changes
grep -i "build" context/CHANGELOG.md
grep -i "resource" context/CHANGELOG.md

# Find specific fixes
grep -i "fix.*template" context/CHANGELOG.md
```

See `SEARCH_GUIDE.md` for more patterns.

---

## Key Concepts

### CLI Flow

1. **User runs**: `npm create fastedge-app` or `npx create-fastedge-app`
2. **CLI starts**: Displays welcome and prompts
3. **Interactive prompts**: Template type, language, project name, etc.
4. **Validation**: Check inputs, directory availability
5. **File generation**: Create project files from selected template
6. **Post-setup**: Display next steps, installation commands

### Template System

**Template structure**:
```
src/assets/
├── http/                   # HTTP application templates
│   ├── base-example/      # Basic HTTP request/response
│   ├── react-app/         # Static React site
│   └── react-app-hono/    # React + Hono backend
└── cdn/                    # CDN edge templates
    └── base-example/       # Traffic modification
```

**Each template has**:
- Source files (language-specific)
- Build configuration
- Package dependencies
- README documentation

### Build Process

1. **Build templates**: `pnpm run build:starter-kit`
   - Reads `src/assets/` starter kits
   - Processes into template objects
   - Generates `dist/resources.ts`

2. **Copy resources**: `pnpm run copy:resources`
   - Copies `dist/resources.ts` to `src/create-app/resources.ts`

3. **Build CLI**: `pnpm run build:create-app`
   - Bundles CLI with esbuild
   - Includes resources.ts
   - Outputs to `bin/create-fastedge-app.js`

### Dual Consumer Model

**npm CLI**:
- Direct usage: `npm create fastedge-app`
- Bundled resources in CLI binary
- Interactive user experience

**FastEdge MCP Server**:
- Imports `dist/resources.ts`
- Programmatic template access
- Used by `scaffold-fastedge-project` tool

---

## Available Templates

**HTTP Templates**:
- **http/base-example** - Basic HTTP (JS/TS)
- **http/react-app** - React static site (JS/TS)
- **http/react-app-hono** - React + Hono (JS/TS)

**CDN Templates**:
- **cdn/base-example** - CDN proxy (AssemblyScript)

**Language Support**:
- JavaScript
- TypeScript
- AssemblyScript
- Rust (planned)

---

## Token Efficiency Strategy

**Estimated token costs:**
- This file (CONTEXT_INDEX.md): ~250 tokens
- PROJECT_OVERVIEW.md: ~500 tokens
- Architecture doc: ~500-1,000 tokens each
- Template doc: ~500-1,500 tokens each
- CHANGELOG.md: **Don't read** - grep only

**Typical task token usage:**
- Simple template fix: ~750 tokens (this file + 1 template doc)
- New template: ~1,500-2,500 tokens (this file + 2-3 docs)
- CLI change: ~1,000-2,000 tokens (this file + CLI docs)

**Compare to reading everything upfront: ~8,000+ tokens**

---

## Getting Help

**Common questions:**

1. **How do I add a new template?**
   → Read: `templates/ADDING_TEMPLATES.md`

2. **How does the build process work?**
   → Read: `architecture/BUILD_SYSTEM.md`

3. **How do I test my changes?**
   → Read: `development/TESTING_GUIDE.md`

4. **How do prompts work?**
   → Read: `architecture/CLACK_PROMPTS.md`

5. **How do I update dependencies?**
   → Read: `templates/DEPENDENCY_MANAGEMENT.md`

---

## Next Steps

1. **If you haven't already**: Read `PROJECT_OVERVIEW.md` for a lightweight introduction
2. **Use the decision tree above** to find docs relevant to your task
3. **Read SEARCH_GUIDE.md** to learn effective search patterns
4. **Follow links** in documentation to discover related information

**Remember**: Only read what you need for your current task. The system is designed for just-in-time discovery.

---

**Last Updated**: February 2026
