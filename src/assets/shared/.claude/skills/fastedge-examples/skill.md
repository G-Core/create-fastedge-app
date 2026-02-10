# FastEdge Examples Skill

## Overview

This skill helps you discover real-world FastEdge application examples and implementation patterns from the official FastEdge Examples repository.

**Official Examples Repository**: https://github.com/G-Core/FastEdge-examples

## Discovery Pattern

Instead of copying code blindly, **use this skill to discover relevant examples based on your current task**.

### How to Use Examples

1. **Identify your use case** - What are you trying to build?
2. **Search the examples repo** - Use the categories below to find relevant examples
3. **Read the example** - Understand the pattern and approach
4. **Adapt to your needs** - Don't copy-paste, understand and modify

## Example Categories

### HTTP Applications

**Basic Request Handling**:
- `http-base-*` - Simple HTTP request/response examples
- Shows: Basic fetch event handling, response creation, status codes

**React Applications**:
- `http-react-*` - React applications running at the edge
- Shows: Client-side rendering, static file serving, routing

**React + Hono Applications**:
- `http-react-hono-*` - Full-stack React with Hono backend
- Shows: API routes, middleware, server-side logic, React frontend

**Multi-Language Examples**:
- `*-javascript/` - JavaScript implementations
- `*-typescript/` - TypeScript implementations
- `*-rust/` - Rust implementations
- `*-assemblyscript/` - AssemblyScript implementations

### CDN Applications

**Basic CDN**:
- `cdn-base-*` - Basic CDN request/response handling
- Shows: CDN properties access, request manipulation, response modification

**CDN Use Cases**:
- Cache control and optimization
- Request routing and redirection
- Response header manipulation
- Origin failover and load balancing

## Common Patterns in Examples

### Pattern: Request Inspection

Found in: Most HTTP and CDN examples

```javascript
addEventListener("fetch", (event) => {
  const request = event.request;

  // Inspect request properties
  const url = new URL(request.url);
  const method = request.method;
  const headers = request.headers;

  // Use inspection to make decisions
  if (url.pathname === "/api/data") {
    event.respondWith(handleApiRequest(request));
  } else {
    event.respondWith(new Response("Hello"));
  }
});
```

### Pattern: Environment Variables

Found in: Most examples with configuration

```javascript
import { getEnv } from "fastedge::env";

const apiUrl = getEnv("API_URL");
const debugMode = getEnv("DEBUG") === "true";
```

### Pattern: Key-Value Storage

Found in: Examples with state management

```javascript
import { openKVNamespace } from "fastedge::kv";

const store = await openKVNamespace("my-namespace");
await store.put("key", "value");
const value = await store.get("key");
```

### Pattern: Secrets Management

Found in: Examples with API integrations

```javascript
import { getSecret } from "fastedge::secrets";

const apiKey = await getSecret("API_KEY");
// Use apiKey securely
```

### Pattern: CDN Properties

Found in: CDN examples

```javascript
import { getCDNProperties } from "fastedge::cdn";

const cdnProps = await getCDNProperties();
const clientIP = cdnProps.clientIP;
const country = cdnProps.country;
```

## Example Discovery Workflow

### Task: "Build an API proxy with authentication"

1. **Search**: Look for `http-base-*` examples with API patterns
2. **Find**: `http-base-typescript/` or `http-react-hono-typescript/`
3. **Pattern**: Request handling + environment variables for API URL
4. **Adapt**: Add authentication header from secrets

### Task: "Build a geo-routing CDN application"

1. **Search**: Look for `cdn-base-*` examples
2. **Find**: `cdn-base-rust/` or `cdn-base-typescript/`
3. **Pattern**: CDN properties access for geo-IP
4. **Adapt**: Route based on country/region from CDN properties

### Task: "Build a full-stack application with React"

1. **Search**: Look for `http-react-hono-*` examples
2. **Find**: `http-react-hono-typescript/`
3. **Pattern**: API routes with Hono + React frontend
4. **Adapt**: Add your API endpoints and React components

### Task: "Build a caching layer"

1. **Search**: Look for examples with KV storage
2. **Find**: HTTP or CDN examples using `fastedge::kv`
3. **Pattern**: Check cache, fetch on miss, store result
4. **Adapt**: Add cache invalidation logic

## Language-Specific Guidance

### JavaScript Examples

- **Best for**: Quick prototypes, simple logic, rapid development
- **Look at**: `*-javascript/` directories
- **Pattern**: Async/await, Fetch API, straightforward logic

### TypeScript Examples

- **Best for**: Type safety, large applications, team development
- **Look at**: `*-typescript/` directories
- **Pattern**: Interface definitions, type-safe APIs, better IDE support

### Rust Examples

- **Best for**: Performance-critical code, systems programming patterns
- **Look at**: `*-rust/` directories
- **Pattern**: Strong typing, error handling with Result, zero-cost abstractions

### AssemblyScript Examples

- **Best for**: TypeScript-like syntax with WebAssembly performance
- **Look at**: `*-assemblyscript/` directories
- **Pattern**: TypeScript syntax, compiled to efficient WASM

## Example Repository Structure

```
FastEdge-examples/
├── http-base-javascript/         # Basic HTTP (JavaScript)
├── http-base-typescript/         # Basic HTTP (TypeScript)
├── http-base-rust/              # Basic HTTP (Rust)
├── http-react-javascript/       # React app (JavaScript)
├── http-react-typescript/       # React app (TypeScript)
├── http-react-hono-javascript/  # React + Hono (JavaScript)
├── http-react-hono-typescript/  # React + Hono (TypeScript)
├── cdn-base-typescript/         # CDN app (TypeScript)
├── cdn-base-rust/              # CDN app (Rust)
└── cdn-base-assemblyscript/    # CDN app (AssemblyScript)
```

## Tips for Using Examples

### Do:
- ✅ Read examples to understand patterns
- ✅ Adapt examples to your specific use case
- ✅ Learn from multiple language implementations
- ✅ Check example README files for context
- ✅ Use examples as reference, not copy-paste source

### Don't:
- ❌ Copy-paste without understanding
- ❌ Assume examples are production-ready
- ❌ Use examples as the only documentation
- ❌ Skip reading example comments and docs
- ❌ Ignore language-specific best practices

## Finding Examples on GitHub

### Search by Use Case

```bash
# Search for routing examples
# In GitHub: search "routing" in FastEdge-examples repo

# Search for authentication examples
# In GitHub: search "auth" or "authentication"

# Search for KV storage examples
# In GitHub: search "kv" or "storage"
```

### Search by API

```bash
# Find examples using specific APIs
# Search: "getEnv" - Environment variables
# Search: "getSecret" - Secrets management
# Search: "openKVNamespace" - Key-Value storage
# Search: "getCDNProperties" - CDN properties
```

### Search by Pattern

```bash
# Find examples with specific patterns
# Search: "middleware" - Middleware patterns
# Search: "fetch" - Fetch API usage
# Search: "Response" - Response creation patterns
```

## Integration with Other Skills

- **fastedge-development** - Core development patterns and APIs
- **fastedge-debugging** - Test examples locally before deployment
- **fastedge-deployment** - Deploy example-based apps to production

## Quick Reference

| Task | Example Category | Key Pattern |
|------|-----------------|-------------|
| Simple HTTP API | `http-base-*` | Fetch event, Request/Response |
| React SPA | `http-react-*` | Static serving, routing |
| Full-stack app | `http-react-hono-*` | API + frontend |
| CDN optimization | `cdn-base-*` | CDN properties, caching |
| Geo-routing | `cdn-base-*` | CDN properties (country, IP) |
| API proxy | `http-base-*` | Fetch upstream, modify response |
| Auth gateway | `http-base-*` | Secrets, request inspection |
| Cache layer | Any with KV | KV storage, cache patterns |

## Example-Driven Development Workflow

1. **Start with an example** - Find closest match to your use case
2. **Test locally** - Use fastedge-debugger to test example
3. **Understand the pattern** - Read code and comments
4. **Modify incrementally** - Make small changes, test each
5. **Deploy when ready** - Use MCP tools to deploy

## Resources

- **Examples Repository**: https://github.com/G-Core/FastEdge-examples
- **Each Example Has**:
  - README.md - Overview and usage
  - Source code - Implementation
  - package.json / Cargo.toml - Dependencies
  - .env.example - Configuration template

---

**Remember**: Examples are learning tools. Understand the pattern, adapt to your needs, and test thoroughly before deploying to production.
