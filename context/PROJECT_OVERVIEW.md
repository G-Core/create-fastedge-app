# create-fastedge-app - Project Overview

## What is create-fastedge-app?

**create-fastedge-app** is a CLI tool that scaffolds FastEdge applications from templates. It provides an interactive command-line experience for creating new FastEdge projects with pre-configured setups for different use cases (HTTP apps, React sites, CDN edge functions).

### Key Value Proposition

- **Quick Start**: Create FastEdge apps in seconds with proven templates
- **Interactive Experience**: Beautiful CLI prompts using @clack/prompts
- **Multiple Templates**: HTTP, React, React+Hono, CDN options
- **Multi-Language**: JavaScript, TypeScript, AssemblyScript support
- **Dual Consumer**: Used by both npm CLI and FastEdge MCP Server

---

## Usage

### As npm Package

**Create new app**:

```bash
# Using npm
npm create fastedge-app

# Using npx
npx create-fastedge-app

# Using pnpm
pnpm create fastedge-app
```

**Interactive prompts ask for**:

1. Project name
2. Template type (HTTP or CDN)
3. Specific template (base, React, React+Hono)
4. Language (JavaScript, TypeScript, AssemblyScript)
5. Installation preference

**Result**: Fully scaffolded FastEdge project ready to build and deploy

## Tech Stack

### Core Technologies

- **Language**: TypeScript
- **CLI Framework**: @clack/prompts (beautiful CLI UX)
- **Build Tool**: esbuild (CLI bundling) + custom starter-kit builder
- **Package Manager**: pnpm
- **Node**: 20+ (defined in .node-version)

### Key Dependencies

- `@clack/prompts` - Interactive CLI prompts
- `@iarna/toml` - TOML parsing (Cargo.toml for Rust)
- `arg` - Command-line argument parsing
- `glob` - File pattern matching
- `picocolors` - Terminal colors

### Development Dependencies

- `tsx` - TypeScript execution
- `esbuild` - Fast bundler
- `npm-run-all2` - Script orchestration

---

## Project Structure

```
create-fastedge-app/
├── src/
│   ├── assets/                     # Template starter kits (source)
│   │   ├── http/                   # HTTP application templates
│   │   │   ├── base-example/       # Basic HTTP
│   │   │   │   ├── javascript/     # JS variant
│   │   │   │   └── typescript/     # TS variant
│   │   │   ├── react-app/          # React static site
│   │   │   │   ├── javascript/
│   │   │   │   └── typescript/
│   │   │   └── react-app-hono/     # React + Hono backend
│   │   │       └── typescript/
│   │   └── cdn/                    # CDN edge templates
│   │       └── base-example/
│   │           └── assemblyscript/
│   │
│   ├── create-starter-kit/         # Template builder
│   │   ├── index.ts                # Build entrypoint
│   │   ├── create-starter-kit.ts   # Template processing logic
│   │   └── types.ts                # Type definitions
│   │
│   ├── create-app/                 # CLI implementation
│   │   ├── index.ts                # CLI entrypoint
│   │   ├── create-files.ts         # File generation logic
│   │   ├── validate-config.ts      # Input validation
│   │   ├── print-info.ts           # CLI output formatting
│   │   └── resources.ts            # Generated template bundle (copied from dist/)
│   │
│   └── utils/                      # Shared utilities
│
├── bin/
│   └── create-fastedge-app.js      # CLI binary (generated)
│
├── dist/
│   └── resources.ts                # Generated template bundle
│
├── scripts/
│   └── create-available-templates.js
│
├── esbuild/
│   └── create-app.js               # esbuild configuration
│
├── update-cargo-dependency.js      # Rust dependency updater
├── update-npm-package.js           # npm dependency updater
├── package.json
└── tsconfig.json
```

---

## How It Works

### Complete Flow (User Perspective)

1. **User runs command**:

   ```bash
   npm create fastedge-app
   ```

2. **CLI displays welcome**:

   ```
   ╭────────────────────────────────────────╮
   │  Welcome to FastEdge App Generator!    │
   ╰────────────────────────────────────────╯
   ```

3. **Interactive prompts**:
   - "What is your project name?" → validates directory availability
   - "Select template type:" → HTTP or CDN
   - "Select template:" → base, React, React+Hono (based on type)
   - "Select language:" → JS, TS, AssemblyScript (based on template)
   - "Install dependencies?" → Yes/No

4. **File generation**:
   - Creates project directory
   - Writes all template files
   - Generates package.json / Cargo.toml
   - Copies configuration files

5. **Post-setup display**:

   ```
   ✓ Project created successfully!

   Next steps:
     cd my-app
     npm install
     npm run build
   ```

### Build Flow (Developer Perspective)

**Step 1: Build starter kits** (`pnpm run build:starter-kit`):

```typescript
// src/create-starter-kit/index.ts
const templates = await processTemplates("src/assets");
// Reads all template directories
// Processes files into template objects
// Generates dist/resources.ts
```

**Step 2: Copy resources** (`pnpm run copy:resources`):

```bash
cp ./dist/resources.ts ./src/create-app/resources.ts
```

**Step 3: Build CLI** (`pnpm run build:create-app`):

```typescript
// esbuild/create-app.js
esbuild.build({
  entryPoints: ["src/create-app/index.ts"],
  bundle: true,
  platform: "node",
  outfile: "bin/create-fastedge-app.js",
});
```

**Result**:

- `bin/create-fastedge-app.js` - Bundled CLI with templates
- `dist/resources.ts` - Standalone template bundle for MCP Server

---

## Template System

### Template Structure

**Each template contains**:

- Source code files (`.js`, `.ts`, `.as`)
- Build configuration (`package.json`, `Cargo.toml`, `asconfig.json`)
- README with instructions
- Example code and comments

**Template metadata**:

```typescript
interface Template {
  name: string; // e.g., "http-base-typescript"
  type: "http" | "cdn"; // Template category
  language: string; // 'javascript', 'typescript', 'assemblyscript'
  files: TemplateFile[]; // Array of file contents
}

interface TemplateFile {
  path: string; // Relative path in project
  content: string; // File contents (can include placeholders)
}
```

### Template Types

**HTTP Templates**:

- `http-base` - Basic HTTP request/response handling
  - Service Workers API pattern
  - Minimal dependencies
  - Variants: JavaScript, TypeScript

- `http-react-app` - Static React site hosting
  - Vite build system
  - React 18+
  - Variants: JavaScript, TypeScript

- `http-react-app-hono` - React + Hono backend
  - Vite frontend
  - Hono routing on edge
  - API routes
  - Variants: TypeScript only

**CDN Templates**:

- `cdn-base` - CDN proxy with traffic modification
  - Request/response manipulation
  - Header modification
  - Caching control
  - Variants: AssemblyScript

### Language Support

**JavaScript**:

- CommonJS or ESM
- FastEdge SDK JS
- Node.js style coding

**TypeScript**:

- Type safety
- Modern syntax
- FastEdge SDK JS with types

**AssemblyScript**:

- WebAssembly-first
- Low-level performance
- CDN use cases

**Rust**:

- High performance
- Memory safe
- FastEdge SDK Rust
- Supported in http-base and cdn-base templates

---

## Template Generation Process

### Building Templates

**Input**: `src/assets/` directories with template projects

**Process**:

1. Scan `src/assets/` recursively
2. For each template directory:
   - Read all files
   - Process file contents (handle templates, placeholders)
   - Extract metadata (name, type, language)
   - Create template object
3. Generate TypeScript object with all templates
4. Write to `dist/resources.ts`

**Output**: `dist/resources.ts`

```typescript
export const templates = {
  "http-base-javascript": {
    name: "http-base-javascript",
    type: "http",
    language: "javascript",
    files: [
      { path: "src/index.js", content: "..." },
      { path: "package.json", content: "..." },
      // ...
    ],
  },
  // ... more templates
};
```

### Using Templates

**CLI usage** (`src/create-app/index.ts`):

```typescript
import { templates } from "./resources.ts";

const selectedTemplate = templates[templateKey];

// Generate files
for (const file of selectedTemplate.files) {
  const content = processPlaceholders(file.content, {
    projectName: userInput.projectName,
    // ... other variables
  });

  fs.writeFileSync(path.join(projectDir, file.path), content);
}
```

**MCP Server usage**:

```typescript
import { templates } from "create-fastedge-app/dist/resources.ts";

// scaffold-fastedge-project tool
const template = templates[templateName];
// Same file generation logic
```

---

## Dependency Management

### Updating Template Dependencies

**npm packages** (across all templates):

```bash
./update-npm-package.js <package-name> <version>

# Example
./update-npm-package.js @gcoredev/fastedge-sdk-js ^2.2.0
```

**How it works**:

- Finds all `package.json` files in `src/assets/`
- Updates specified dependency/devDependency
- Maintains version prefix (^, ~, etc.)

**Cargo dependencies** (Rust templates):

```bash
./update-cargo-dependency.js <crate-name> <version>

# Example
./update-cargo-dependency.js fastedge 0.1.0
```

**How it works**:

- Finds all `Cargo.toml` files in `src/assets/`
- Updates specified dependency
- Uses TOML parser for safe updates

### Why These Scripts Exist

**Problem**: Templates duplicated across variants (JS/TS, multiple templates)
**Solution**: Automated updates ensure consistency

**Benefits**:

- Update all templates at once
- Prevent version drift
- Reduce manual errors

---

## CLI System

### Clack Prompts

**@clack/prompts** provides:

- Beautiful UI components
- Progress indicators
- Spinners
- Multi-select
- Validation

**Example prompt**:

```typescript
import * as clack from "@clack/prompts";

const projectName = await clack.text({
  message: "What is your project name?",
  placeholder: "my-fastedge-app",
  validate: (value) => {
    if (!value) return "Project name is required";
    if (fs.existsSync(value)) return "Directory already exists";
  },
});

const templateType = await clack.select({
  message: "Select template type:",
  options: [
    { value: "http", label: "HTTP Application" },
    { value: "cdn", label: "CDN Edge Function" },
  ],
});
```

### Validation

**Input validation** (`src/create-app/validate-config.ts`):

- Project name: alphanumeric, hyphens, no spaces
- Directory availability: must not exist
- Template selection: must be valid template key
- Language: must be supported by template

**File validation**:

- Template must have all required files
- package.json must be valid JSON
- Build configuration must be present

---

## Dual Consumer Model

### npm CLI Consumer

**How it works**:

1. User runs `npm create fastedge-app`
2. npm downloads package
3. Executes `bin/create-fastedge-app.js`
4. CLI runs with bundled `resources.ts`

**Benefits**:

- No external dependencies for templates
- Fast, offline-capable
- Single binary distribution

### MCP Server Consumer

**How it works**:

1. MCP Server imports `dist/resources.ts`
2. `scaffold-fastedge-project` tool accesses templates
3. Generates files programmatically

**Benefits**:

- Code reuse (same templates)
- Consistency between CLI and MCP
- Single source of truth

**Integration point**:

```typescript
// In FastEdge MCP Server
import { templates } from "path/to/create-fastedge-app/dist/resources.ts";

// scaffold-fastedge-project tool
export const scaffoldProject = async (args) => {
  const template = templates[args.templateName];
  // Use same template, different output mechanism
};
```

---

## Development Workflow

### Building

```bash
pnpm install
pnpm run build              # Full build (templates + CLI)
```

### Testing Locally

```bash
pnpm start                  # Build and run CLI
# or
pnpm run build && ./bin/create-fastedge-app.js
```

### Adding New Template

1. Create directory in `src/assets/{type}/{name}/{language}/`
2. Add template files (source, config, README)
3. Build: `pnpm run build:starter-kit`
4. Test: `pnpm start`
5. Update documentation

### Updating Dependencies

```bash
# Update FastEdge SDK across all templates
./update-npm-package.js @gcoredev/fastedge-sdk-js ^2.3.0

# Rebuild templates
pnpm run build:starter-kit
```

---

## Key Design Decisions

### Why @clack/prompts?

- Beautiful, modern CLI UX
- Rich components (spinners, multi-select, etc.)
- Built-in validation
- Cancel handling

### Why Generate resources.ts?

- Bundle templates into single file
- Offline-capable CLI
- Fast template access
- Type-safe template objects

### Why Dual Consumer Model?

- Code reuse between CLI and MCP
- Single source of truth for templates
- Consistency across tools

### Why Update Scripts?

- Many templates with shared dependencies
- Prevent version drift
- Automated, error-free updates

---

## Related Projects

- **[FastEdge MCP Server](../FastEdge-mcp-server)** - Consumes `dist/resources.ts`
- **[FastEdge SDK JS](https://github.com/G-Core/FastEdge-sdk-js)** - Used in templates
- **[FastEdge SDK Rust](https://github.com/G-Core/FastEdge-sdk-rust)** - Rust template support
- **[FastEdge VSCode Extension](../FastEdge-vscode)** - Complementary tooling

---

## Status: Current Features

**Fully Implemented**:

- ✅ Interactive CLI with @clack/prompts
- ✅ HTTP base template (JS/TS/Rust)
- ✅ React static site template (JS/TS)
- ✅ React + Hono template (TS)
- ✅ CDN base template (AssemblyScript/Rust)
- ✅ Rust template support (http-base, cdn-base)
- ✅ Template generation system
- ✅ Dual consumer model (npm + MCP)
- ✅ Dependency update scripts
- ✅ `--list-templates` flag for programmatic access

**Planned/Future**:

- More HTTP templates (API, SSR, etc.)
- More CDN templates
- Rust support for React templates

---

**Last Updated**: February 11, 2026
