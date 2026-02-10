# FastEdge Application - AI Agent Instructions

## 🎯 Discovery-Based Context System

This FastEdge application includes **skills** for AI-assisted development. Skills provide task-specific guidance without overwhelming you with unnecessary information.

**Key Principle**: Don't read all skills upfront. Use the skill index below to find what you need, when you need it.

---

## Available Skills

Your project includes these skills in `.claude/skills/`:

### 1. fastedge-development
**When to use**: Building FastEdge application logic, working with APIs, environment variables, secrets

**Covers**:
- Core FastEdge patterns (fetch events, request/response)
- Environment variables and secrets management
- Key-Value storage
- Multi-language development (JavaScript, TypeScript, Rust, AssemblyScript)
- Build process and compilation

**Use for tasks like**:
- "Add environment variable support"
- "Implement API request handling"
- "Use secrets for API keys"
- "Build and compile the application"

### 2. fastedge-debugging
**When to use**: Testing locally, debugging issues, CI/CD integration

**Covers**:
- Local testing with fastedge-debugger
- REST API for automated testing
- Debugging workflows
- CI/CD integration patterns
- Common troubleshooting

**Use for tasks like**:
- "Test this application locally"
- "Debug response issues"
- "Set up automated testing"
- "Add CI/CD pipeline"

### 3. fastedge-deployment
**When to use**: Deploying to production, managing environment variables and secrets in production

**Covers**:
- MCP tools for deployment
- Environment variable management
- Secrets management in production
- Deployment workflows and patterns
- Multi-environment strategies

**Use for tasks like**:
- "Deploy to production"
- "Update environment variables"
- "Add production secrets"
- "Create staging environment"

### 4. fastedge-examples
**When to use**: Finding reference implementations, learning patterns, discovering use cases

**Covers**:
- Official FastEdge-examples repository
- Example discovery patterns
- Language-specific examples
- Common implementation patterns
- Use case reference

**Use for tasks like**:
- "Find example of API proxy"
- "Show me React app examples"
- "How to implement caching"
- "Find CDN routing examples"

---

## How AI Agents Should Use Skills

### For Developers Using AI Assistants

When working with Claude, Copilot, or other AI assistants:

1. **State your task clearly**: "Add authentication to the API"
2. **Let the agent discover skills**: The agent will load relevant skills automatically
3. **Iterate based on guidance**: Follow the patterns from the loaded skill

### For AI Agents (Claude, etc.)

**IMPORTANT**: Do NOT read all skills at once. Follow this pattern:

1. **Understand the task** - What is the user trying to accomplish?
2. **Identify relevant skill** - Use the index above to select 1-2 relevant skills
3. **Load just-in-time** - Read only the skills needed for this specific task
4. **Follow skill guidance** - Apply patterns from the skill to solve the task

**Example Task Flow**:

```
User: "Add environment variables for API configuration"

Agent thinking:
- Task: Environment variables
- Relevant skill: fastedge-development (covers env vars)
- Action: Read .claude/skills/fastedge-development/skill.md
- Apply: Follow environment variable patterns from skill
```

**Token Efficiency**:
- Reading 1 skill: ~400-500 lines, ~1,500 tokens
- Reading all skills: ~1,500 lines, ~6,000 tokens
- **Savings**: 75% reduction by loading on-demand

---

## Skill Decision Tree

Quick lookup for common tasks:

| Task Category | Read This Skill | Avoid Reading |
|--------------|-----------------|---------------|
| **Building features** | fastedge-development | deployment, debugging |
| **Testing locally** | fastedge-debugging | deployment, examples |
| **Deploying** | fastedge-deployment | development, debugging |
| **Finding patterns** | fastedge-examples | deployment, debugging |
| **Environment setup** | fastedge-development | examples |
| **Production issues** | fastedge-deployment | examples |
| **Learning FastEdge** | fastedge-examples, fastedge-development | deployment |
| **CI/CD setup** | fastedge-debugging | examples |

---

## Development Workflow

### Recommended Workflow: Create → Test → Deploy

1. **Create/Modify** (use fastedge-development skill)
   - Write your application code
   - Add environment variables, secrets, KV storage as needed
   - Follow patterns from skill

2. **Test Locally** (use fastedge-debugging skill)
   - Start fastedge-debugger: `npm start` or `cargo run`
   - Test your application locally
   - Verify all functionality works
   - **NEVER skip testing before deployment**

3. **Deploy** (use fastedge-deployment skill)
   - Only after local testing passes
   - Deploy using MCP tools or manual deployment
   - Configure production environment variables and secrets

### Anti-Pattern: Skip Testing

❌ **Don't**: Write code → Deploy directly
✅ **Do**: Write code → Test locally → Deploy

**Why**: Local testing catches issues early, saves time, prevents production problems.

---

## Project Structure

```
your-fastedge-app/
├── claude.md              # This file - AI instructions
├── .claude/
│   └── skills/            # Task-specific skills
│       ├── fastedge-development/
│       ├── fastedge-debugging/
│       ├── fastedge-deployment/
│       └── fastedge-examples/
│
├── src/                   # Your application code
├── package.json           # Dependencies (JS/TS)
├── Cargo.toml            # Dependencies (Rust)
├── .env.example          # Environment variables template
└── README.md             # Project documentation
```

---

## Quick Start for AI Agents

### Task: "Add a new API endpoint"

1. Load: `.claude/skills/fastedge-development/skill.md`
2. Find: Request handling patterns
3. Apply: Create new endpoint following pattern
4. Recommend: Test locally (reference fastedge-debugging)

### Task: "Deploy this application"

1. Check: Has user tested locally? Recommend if not
2. Load: `.claude/skills/fastedge-deployment/skill.md`
3. Find: Deployment workflow
4. Apply: Follow MCP tool usage or manual deployment

### Task: "Fix failing test"

1. Load: `.claude/skills/fastedge-debugging/skill.md`
2. Find: Debugging patterns and common issues
3. Apply: Troubleshooting guidance
4. Recommend: Patterns from fastedge-development if needed

### Task: "How do other apps handle auth?"

1. Load: `.claude/skills/fastedge-examples/skill.md`
2. Find: Authentication example references
3. Guide: Point to relevant examples in FastEdge-examples repo
4. Optional: Load fastedge-development for implementation details

---

## For Human Developers

### Using This Project with AI Assistants

1. **Ask specific questions**: "How do I add environment variables?"
2. **Trust the discovery pattern**: Let your AI assistant load relevant skills
3. **Test locally first**: Always use fastedge-debugger before deploying
4. **Check examples**: When stuck, ask for example references

### Using This Project Manually

1. **Read skills directly**: Browse `.claude/skills/` for guidance
2. **Start with development**: Read fastedge-development first
3. **Test before deploy**: Follow fastedge-debugging patterns
4. **Learn from examples**: Check fastedge-examples for reference implementations

---

## Summary

✅ **Do**:
- Load skills on-demand based on current task
- Follow Create → Test → Deploy workflow
- Use fastedge-examples to discover patterns
- Test locally before deploying

❌ **Don't**:
- Read all skills upfront (wastes tokens)
- Skip local testing
- Deploy without testing
- Ignore skill guidance

---

**FastEdge Documentation**: https://docs.gcore.com/cloud/fastedge
**Example Repository**: https://github.com/G-Core/FastEdge-examples
**Support**: https://gcore.com/support
