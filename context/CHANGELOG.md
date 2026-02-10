# create-fastedge-app - Changelog

**IMPORTANT**: Do not read this file linearly. Use grep to search for keywords.

**Example searches**:
```bash
grep -i "template" context/CHANGELOG.md
grep -i "http-react" context/CHANGELOG.md
grep -i "fix.*cli" context/CHANGELOG.md
grep "## \[2026-" context/CHANGELOG.md
```

See `SEARCH_GUIDE.md` for more search patterns.

---

## [2026-02-10] - Reverted to Language-Agnostic Skills (Rust Examples)

### Overview
Reverted the conditional blocks templating system. Simplified fastedge-development skill to use Rust examples only, with links to FastEdge-examples repository for other languages.

### What Was Completed

**Reverted Template Processing** (create-starter-kit.ts):
- Removed `replaceTemplateVariables()` function (~30 lines)
- Removed `filterConditionalBlocks()` function (~90 lines)
- Removed `processSharedFiles()` function (~20 lines)
- Restored simple shared file merging (no processing)

**Simplified fastedge-development Skill** (420 lines, reduced from 1,128):
- Shows Rust examples only (chosen as reference language)
- Both HTTP (WASI-HTTP) and CDN (proxy-wasm) patterns
- Links to FastEdge-examples repository for other languages
- Clear note at top: "Examples in this skill: Rust"
- Removed 700+ lines of conditional blocks

**Reasoning**:
- Conditional blocks made skills unmaintainable (3x size increase)
- Examples should be discoverable via fastedge-examples skill and repo
- AI agents naturally find language-specific examples when needed
- Rust chosen as reference due to explicit types and comprehensive patterns

**Other Skills Unchanged**:
- `fastedge-debugging/` - Already language-agnostic (REST API)
- `fastedge-deployment/` - Already language-agnostic (MCP tools)
- `fastedge-examples/` - Links to examples repo (language discovery)
- `claude.md` - Discovery-based instructions

### Impact
- **Maintainability restored** - 420 lines vs 1,128 lines (63% reduction)
- **Clear reference** - Rust examples show patterns clearly
- **Discoverability preserved** - Examples repo provides all languages
- **Simpler build** - No template processing needed
- **Better developer experience** - Skills point to comprehensive examples

**Files Modified**: 2
- `create-starter-kit.ts` - Removed ~140 lines of template processing
- `fastedge-development/skill.md` - Simplified to 420 lines (Rust only)

### Testing
```bash
# Build templates (no processing)
pnpm run build:starter-kit

# Generate any language project
npx create-fastedge-app test-project --template http-base --language typescript

# Verify skill is language-agnostic (Rust examples)
cat test-project/.claude/skills/fastedge-development/skill.md | head -10
# Expected: "Examples in this skill: Rust"

# Verify examples skill provides discovery
cat test-project/.claude/skills/fastedge-examples/skill.md | grep "typescript"
# Expected: Links to TypeScript examples in FastEdge-examples repo
```

**User Feedback**: "having seen how unwieldly this template style skills is getting I prefer to remove this Option B templating mechanism"

---

## [2026-02-10] - Language-Specific Skills with Conditional Blocks [REVERTED]

**Note**: This approach was implemented but reverted in favor of language-agnostic skills with example repository links.

### Overview
Implemented template processing system to provide language-specific skill content. Skills now show JavaScript, TypeScript, Rust, or AssemblyScript examples based on the target language.

### What Was Completed

**Template Processing System** (create-starter-kit.ts):
- Added `replaceTemplateVariables()` - Replaces {{LANGUAGE}} and {{LANG_BLOCK}} placeholders
- Added `filterConditionalBlocks()` - Filters {{#if-language}}...{{/if-language}} blocks
- Added `processSharedFiles()` - Processes all shared files for target language
- Integrated into scaffold generation pipeline

**fastedge-development Skill Updated** (1,128 lines, expanded from 357):
- Event-driven model examples for all 4 languages
- Environment variables examples (JS, TS, Rust, AS)
- Secrets management examples (JS, TS, Rust, AS)
- Request/Response modification examples (JS, TS, Rust, AS)
- Error handling patterns (JS, TS, Rust, AS)
- Build instructions specific to each language
- HTTP and CDN application examples (JS, TS, Rust, AS)
- Language-specific tips and benefits sections

**Conditional Block Syntax**:
```markdown
{{#if-javascript}}
```javascript
// JavaScript example
```
{{/if-javascript}}

{{#if-rust}}
```rust
// Rust example
```
{{/if-rust}}
```

**Template Variables**:
- `{{LANGUAGE}}` → Replaced with actual language (javascript, typescript, rust, assemblyscript)
- `{{LANG_BLOCK}}` → Code fence language identifier

### Impact
- **Accurate examples** - Developers see examples in their chosen language
- **Better learning** - Language-specific syntax and patterns
- **Professional UX** - Generated projects feel tailored, not generic
- **Maintainability** - Single source of truth with multi-language support
- **Scalability** - Easy to add more languages or examples

**Processing Example**:
```
TypeScript project generated:
- {{LANGUAGE}} → typescript
- {{#if-typescript}}...{{/if-typescript}} → Kept
- {{#if-javascript}}...{{/if-javascript}} → Removed
- {{#if-rust}}...{{/if-rust}} → Removed
- {{#if-assemblyscript}}...{{/if-assemblyscript}} → Removed
```

**Files Modified**: 1 (create-starter-kit.ts - added ~90 lines)
**Files Updated**: 1 (fastedge-development/skill.md - expanded to 1,128 lines)
**Languages Supported**: 4 (JavaScript, TypeScript, Rust, AssemblyScript)

### Testing
```bash
# Rebuild templates with new processing
pnpm run build:starter-kit

# Generate Rust project
npx create-fastedge-app test-rust --template http-base --language rust

# Verify Rust examples in skills
cat test-rust/.claude/skills/fastedge-development/skill.md | grep -A5 "```rust"
# Expected: Rust code examples, no JavaScript/TypeScript

# Generate TypeScript project
npx create-fastedge-app test-ts --template http-base --language typescript

# Verify TypeScript examples in skills
cat test-ts/.claude/skills/fastedge-development/skill.md | grep -A5 "```typescript"
# Expected: TypeScript code examples, no JavaScript/Rust
```

**Addresses**: User feedback that all examples were in JavaScript, regardless of project language

---

## [2026-02-10] - Discovery Pattern & Missing Skill Completion

### Overview
Added top-level `claude.md` to teach discovery pattern and completed missing `fastedge-examples/skill.md` with comprehensive examples guidance.

### What Was Completed

**Top-Level claude.md Created** (254 lines):
- Discovery-based context system explanation
- Skill index and decision tree
- Task-to-skill mapping
- AI agent guidance for on-demand skill loading
- Human developer guidance
- Create → Test → Deploy workflow emphasis

**fastedge-examples Skill Completed** (284 lines):
- Links to official FastEdge-examples repository (https://github.com/G-Core/FastEdge-examples)
- Example discovery patterns by use case
- Language-specific guidance (JS, TS, Rust, AssemblyScript)
- Common pattern explanations
- Search and discovery workflows
- Integration with other skills

**Files Created**:
- `src/assets/shared/claude.md` - Top-level discovery instructions
- `src/assets/shared/.claude/skills/fastedge-examples/skill.md` - Examples discovery skill

### Impact
- **Teaches discovery pattern** - AI agents and developers learn not to read all skills
- **Completes skill set** - All 4 skills now have full documentation
- **Examples discoverability** - Links to FastEdge-examples repo with search patterns
- **Token efficiency** - Guidance on loading 1 skill (~1,500 tokens) vs all skills (~6,000 tokens)
- **Better onboarding** - New projects explain how to use skills effectively

**Files Created**: 2
**Lines Added**: ~538 (254 + 284)

### Testing
```bash
npx create-fastedge-app test-project --template http-base

# Verify top-level claude.md
cat test-project/claude.md
# Expected: Discovery instructions, skill index

# Verify all skills complete
ls test-project/.claude/skills/
cat test-project/.claude/skills/fastedge-examples/skill.md
# Expected: Examples repository guidance
```

**Addresses**: User feedback on missing discovery pattern and incomplete fastedge-examples skill

---

## [2026-02-10] - Skills Infrastructure Integration

### Overview
Implemented skills-based discovery system. All generated projects now include `.claude/skills/` directory with 4 comprehensive skills.

### What Was Completed

**Skills Created** (1,410+ lines total):
- `fastedge-development/` - SDK usage, patterns, error handling, build process
- `fastedge-debugging/` - REST API, testing workflows, CI/CD, troubleshooting
- `fastedge-deployment/` - MCP tools, deployment patterns, env vars, secrets
- `fastedge-examples/` - Links to examples, common patterns, use cases

**Build System Modified**:
- File: `src/create-starter-kit/create-starter-kit.ts`
- Added `readSharedFiles()` function
- Skills automatically merged into all templates

**Result**: Every generated project includes `.claude/skills/` with comprehensive guidance.

### Impact
- **75%+ token savings** vs hardcoded context
- **Dynamic discovery** - AI agents load relevant skills on-demand
- **Decoupled** - Documentation separate from tools
- **User-editable** - Developers can customize skills

**Files Created**: 8 (4 skills × 2 files)
**Files Modified**: 1 (create-starter-kit.ts)
**Lines Added**: ~1,400

### Testing
```bash
npx create-fastedge-app test-project --template http-base
ls test-project/.claude/skills/
# Expected: fastedge-development, fastedge-debugging, fastedge-deployment, fastedge-examples
```

**Part of**: FastEdge Ecosystem Refactoring - Phase 1: Skills Infrastructure

---

## Format for New Entries

```markdown
## [YYYY-MM-DD] - Feature/Template/Fix Name

### Overview
Brief description of what was accomplished

### 🎯 What Was Completed

#### 1. Component/Template Name
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

## [2026-02-09] - Initial Context Documentation

### Overview
Created comprehensive context documentation system following discovery-based pattern for the create-fastedge-app repository.

### 🎯 What Was Completed

#### 1. Core Documentation Structure
- Created `claude.md` - Top-level agent instructions (~350 lines)
- Created `context/CONTEXT_INDEX.md` - Navigation hub (~150 lines)
- Created `context/PROJECT_OVERVIEW.md` - Comprehensive overview (~400 lines)
- Created `context/SEARCH_GUIDE.md` - Search patterns guide (~80 lines)
- Created `context/CHANGELOG.md` - This file (searchable history)

**Files Created:**
- `claude.md` - Top-level instructions
- `context/CONTEXT_INDEX.md` - Documentation navigation
- `context/PROJECT_OVERVIEW.md` - Project overview
- `context/SEARCH_GUIDE.md` - Search patterns
- `context/CHANGELOG.md` - This file

**Directory Structure Created:**
- `context/architecture/` - For architecture docs
- `context/templates/` - For template-specific docs
- `context/development/` - For development guides

### 📝 Notes

**Documentation Philosophy:**
- Discovery-based: Read only what's needed for current task
- Token-efficient: Prevents reading thousands of unnecessary lines
- Decision-tree driven: Quick lookup for common tasks
- Searchable: Use grep instead of linear reading

**Coverage:**
- CLI tool overview and workflow
- Template system and generation process
- Build system and resource bundling
- Dual consumer model (npm CLI + MCP Server)
- Available templates (HTTP and CDN)
- Dependency management scripts

**Future Documentation Needed:**

**Architecture**:
- `architecture/CLI_SYSTEM.md` - CLI implementation details
- `architecture/BUILD_SYSTEM.md` - Build process and scripts
- `architecture/CLACK_PROMPTS.md` - Interactive prompt system
- `architecture/RESOURCE_BUNDLING.md` - How resources.ts is generated

**Templates**:
- `templates/TEMPLATE_SYSTEM.md` - How templates work
- `templates/ADDING_TEMPLATES.md` - Guide for adding new templates
- `templates/AVAILABLE_TEMPLATES.md` - List of all templates with details
- `templates/HTTP_TEMPLATES.md` - HTTP template specifics
- `templates/CDN_TEMPLATES.md` - CDN template specifics
- `templates/TEMPLATE_GENERATION.md` - Template build process
- `templates/DEPENDENCY_MANAGEMENT.md` - Managing template dependencies
- `templates/VALIDATION_SYSTEM.md` - Template validation logic

**Development**:
- `development/IMPLEMENTATION_GUIDE.md` - Coding patterns and conventions
- `development/TESTING_GUIDE.md` - Testing CLI and templates
- `development/UPDATE_SCRIPTS.md` - Using dependency update scripts

---

**Note**: Add new entries at the TOP of this file (reverse chronological order)
