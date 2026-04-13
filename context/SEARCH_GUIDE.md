# Search Guide - create-fastedge-app

Quick reference for searching documentation efficiently.

---

## Why Search Instead of Read?

**CHANGELOG.md** and other large docs can be thousands of lines. **Searching is 10-20x faster** than reading linearly and uses far fewer tokens.

---

## Searching CHANGELOG.md

**NEVER read CHANGELOG.md linearly** - Always use grep or search tools.

### Common Searches

**Find template additions/changes**:
```bash
grep -i "template" context/CHANGELOG.md
grep -i "http-react" context/CHANGELOG.md
grep -i "cdn-base" context/CHANGELOG.md
```

**Find CLI changes**:
```bash
grep -i "prompt" context/CHANGELOG.md
grep -i "clack" context/CHANGELOG.md
grep -i "cli" context/CHANGELOG.md
```

**Find bug fixes**:
```bash
grep -i "fix.*bug" context/CHANGELOG.md
grep -i "fix.*template" context/CHANGELOG.md
grep -i "fix.*build" context/CHANGELOG.md
```

**Find build changes**:
```bash
grep -i "build" context/CHANGELOG.md
grep -i "esbuild" context/CHANGELOG.md
grep -i "resource" context/CHANGELOG.md
```

**Find dependency updates**:
```bash
grep -i "dependency" context/CHANGELOG.md
grep -i "fastedge-sdk" context/CHANGELOG.md
```

**Date-based searches**:
```bash
grep "## \[2026-" context/CHANGELOG.md  # All 2026 entries
grep "## \[2026-02" context/CHANGELOG.md  # February 2026
```

### Context Around Matches

**Show 3 lines before and after**:
```bash
grep -C 3 "http-react" context/CHANGELOG.md
```

**Show 5 lines after**:
```bash
grep -A 5 "## \[2026" context/CHANGELOG.md
```

---

## Finding Template Documentation

**List all template docs**:
```bash
ls context/templates/
```

**Find specific template**:
```bash
ls context/templates/ | grep -i "http"
ls context/templates/ | grep -i "cdn"
```

---

## Searching Across All Context

**Search all files for keyword**:
```bash
grep -r "clack prompts" context/
grep -r "starter kit" context/
grep -r "resources.ts" context/
```

**Case-insensitive**:
```bash
grep -ri "template" context/
```

**With line numbers**:
```bash
grep -rn "build system" context/
```

---

## Searching Within Specific Docs

**Architecture docs**:
```bash
grep -i "prompt" context/architecture/CLI_SYSTEM.md
grep -i "bundle" context/architecture/BUILD_SYSTEM.md
```

**Template docs**:
```bash
grep -i "react" context/templates/HTTP_TEMPLATES.md
grep -i "assemblyscript" context/templates/CDN_TEMPLATES.md
```

---

## Common Search Patterns

| Looking for | Search Pattern |
|-------------|----------------|
| How template works | `grep -ri "template-name" context/templates/` |
| When template was added | `grep -i "template-name" context/CHANGELOG.md` |
| Bug fix history | `grep -i "fix.*keyword" context/CHANGELOG.md` |
| CLI flow | `grep -ri "prompt\|clack" context/architecture/` |
| Build process | `grep -ri "build\|esbuild" context/architecture/` |
| Template generation | `grep -ri "resources.ts" context/` |
| Dependency management | `grep -ri "update.*dependency" context/` |

---

## VS Code Search

**Use VS Code's built-in search** (Ctrl+Shift+F / Cmd+Shift+F):
- Search scope: `context/`
- Case-insensitive: Toggle icon
- Regex: Toggle icon
- Include/exclude patterns

**Example queries**:
- `clack` in `context/`
- `template` in `context/templates/`
- `@clack/prompts` (find package references)

---

## Grep Tool in Claude Code

**Preferred method when using Claude Code**:
```typescript
Grep tool with:
- pattern: "search-term"
- path: "context/"
- output_mode: "content" (with context)
- -i: true (case-insensitive)
```

**Benefits**:
- Respects .gitignore
- Optimized for codebases
- Returns formatted results

---

## When to Read vs Search

**Read entire doc when**:
- Learning about new template (<500 lines)
- Understanding architecture overview
- First time working in area

**Search instead when**:
- Looking for specific information
- Checking if template exists
- Finding implementation details
- Reviewing change history

---

## Key Takeaways

1. **Always search CHANGELOG.md** - Never read linearly
2. **grep is your friend** - Fast, powerful, token-efficient
3. **Use -i for case-insensitive** - Catches more matches
4. **Use -r for recursive** - Search across all files
5. **Context flags (-C, -A, -B)** - See surrounding lines
6. **VS Code search** - When you need interactive results

---

**Last Updated**: February 2026
