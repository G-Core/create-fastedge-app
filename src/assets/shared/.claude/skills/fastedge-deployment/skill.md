# FastEdge Deployment Skill

## Overview

This skill covers deploying FastEdge applications to production using the FastEdge MCP server. The MCP server provides tools for building WASM, uploading binaries, and managing deployments.

## Prerequisites

Before deploying, ensure you have:

1. **Tested locally** - Always test with fastedge-debugger first
2. **Built WASM** - Your application compiled to .wasm
3. **MCP server configured** - Connection to FastEdge MCP server
4. **Credentials** - FastEdge API credentials configured

## MCP Server Tools

The FastEdge MCP server provides several deployment tools:

### 1. build-wasm

Compiles your source code to WebAssembly:

```
Tool: build-wasm
Purpose: Build FastEdge application to WASM binary

Parameters:
- source_path: Path to source code
- output_path: Where to save .wasm file
- language: javascript | typescript | rust | assemblyscript

Example:
{
  "source_path": "./src/index.js",
  "output_path": "./dist/app.wasm",
  "language": "javascript"
}
```

### 2. upload-binary

Uploads WASM binary to FastEdge:

```
Tool: upload-binary
Purpose: Upload WASM binary to FastEdge cloud

Parameters:
- wasm_path: Path to .wasm file
- app_name: Application name (optional)

Example:
{
  "wasm_path": "./dist/app.wasm",
  "app_name": "my-edge-app"
}

Response:
{
  "binary_id": "bin_abc123",
  "size": "1.2MB",
  "uploaded_at": "2025-01-15T10:30:00Z"
}
```

### 3. update-or-create-app

Creates or updates application deployment:

```
Tool: update-or-create-app
Purpose: Deploy application with configuration

Parameters:
- app_name: Application name
- binary_id: Binary ID from upload-binary
- client_id: FastEdge client ID
- plan_id: FastEdge plan ID (optional)
- status: active | inactive

Example:
{
  "app_name": "my-edge-app",
  "binary_id": "bin_abc123",
  "client_id": "client_xyz",
  "status": "active"
}

Response:
{
  "app_id": "app_789",
  "url": "https://my-edge-app.fastedge.gcore.io",
  "status": "active"
}
```

### 4. update-env-vars-app

Updates environment variables and secrets:

```
Tool: update-env-vars-app
Purpose: Configure environment variables

Parameters:
- app_id: Application ID
- env_vars: Object with environment variables

Example:
{
  "app_id": "app_789",
  "env_vars": {
    "DEBUG": "false",
    "API_URL": "https://api.production.com",
    "CACHE_TTL": "3600"
  }
}
```

### 5. get-secret-id

Retrieves secret IDs for sensitive configuration:

```
Tool: get-secret-id
Purpose: Get secret ID for secure configuration

Parameters:
- secret_name: Name of secret

Example:
{
  "secret_name": "api_key"
}

Response:
{
  "secret_id": "secret_abc123"
}
```

## Deployment Workflow

### Complete Deployment Process

```
1. Develop & Test Locally
   - Write code
   - Build to WASM
   - Test with fastedge-debugger
   - Verify all functionality works
   ↓
2. Build for Production
   - Use build-wasm tool
   - Ensure optimized build
   - Check WASM file size
   ↓
3. Upload Binary
   - Use upload-binary tool
   - Save binary_id for deployment
   ↓
4. Configure Application
   - Use update-or-create-app tool
   - Set app name, binary_id, client_id
   - Set status to "active"
   ↓
5. Set Environment Variables
   - Use update-env-vars-app tool
   - Configure production env vars
   - Add secrets if needed
   ↓
6. Verify Deployment
   - Test deployed URL
   - Check application logs
   - Verify functionality
```

## Example Deployment Scripts

### Manual Deployment

```bash
#!/bin/bash
# deploy.sh - Manual deployment script

set -e

echo "🚀 Starting deployment..."

# 1. Build WASM
echo "📦 Building WASM..."
npm run build

# 2. Ask Claude to deploy via MCP
echo "☁️ Deploying to FastEdge..."
echo "Please use the following MCP tools:"
echo "1. upload-binary with wasm_path: ./dist/app.wasm"
echo "2. update-or-create-app with binary_id from step 1"
echo "3. update-env-vars-app with production env vars"

echo "✅ Build complete. Ready for MCP deployment."
```

### Agent-Driven Deployment

When working with AI agents, use this workflow:

1. **Build**: Agent runs `npm run build`
2. **Test**: Agent uses fastedge-debugger REST API to test
3. **Deploy**: Agent uses MCP tools to deploy

Example agent instructions:

```
"Deploy the FastEdge application:
1. Build WASM using npm run build
2. Test locally with fastedge-debugger
3. If tests pass, use MCP tools to:
   - upload-binary (./dist/app.wasm)
   - update-or-create-app (name: my-app, binary_id from upload)
   - update-env-vars-app (set production env vars)
4. Verify deployment by checking the deployed URL"
```

## Environment Variables Best Practices

### Development vs Production

Use different configurations for development and production:

**Development** (in debugger):
```json
{
  "DEBUG": "true",
  "LOG_LEVEL": "verbose",
  "API_URL": "https://staging.api.example.com",
  "CACHE_TTL": "60"
}
```

**Production** (via MCP):
```json
{
  "DEBUG": "false",
  "LOG_LEVEL": "error",
  "API_URL": "https://api.example.com",
  "CACHE_TTL": "3600"
}
```

### Secrets Management

Never hardcode secrets. Use the secrets system:

1. **Create secrets** in FastEdge dashboard
2. **Get secret IDs** via `get-secret-id` tool
3. **Reference in code** via `getSecret()` function

```javascript
// In your application
import { getSecret } from "fastedge::secret";

const apiKey = await getSecret("api_key");
const dbPassword = await getSecret("db_password");
```

## Deployment Checklist

Before deploying to production:

- [ ] Code tested locally with fastedge-debugger
- [ ] All tests pass
- [ ] Error handling implemented
- [ ] Environment variables configured
- [ ] Secrets properly set up
- [ ] Performance tested
- [ ] Security reviewed
- [ ] WASM build optimized
- [ ] File size acceptable
- [ ] Staging deployment tested
- [ ] Rollback plan ready

## Common Deployment Patterns

### Pattern 1: Blue-Green Deployment

Deploy to staging first:

```
1. Deploy to staging
   - Use update-or-create-app with app_name: "my-app-staging"
   - Test thoroughly

2. Deploy to production
   - Use update-or-create-app with app_name: "my-app"
   - Same binary_id as staging

3. Monitor production
   - Check logs
   - Verify metrics

4. Rollback if needed
   - Use previous binary_id
   - Update application
```

### Pattern 2: Incremental Deployment

Test with increasing load:

```
1. Deploy to test app
   - Limited traffic

2. Verify functionality
   - Check all endpoints
   - Monitor errors

3. Deploy to production
   - Full traffic

4. Monitor closely
   - First 24 hours critical
```

### Pattern 3: Feature Flags

Use environment variables for feature flags:

```javascript
import { getEnv } from "fastedge::env";

const newFeatureEnabled = getEnv("FEATURE_NEW_API") === "true";

if (newFeatureEnabled) {
  return handleNewAPI(request);
} else {
  return handleOldAPI(request);
}
```

Deploy with feature disabled, then enable via `update-env-vars-app`.

## Monitoring & Verification

### Post-Deployment Verification

After deployment, verify:

1. **Application URL** - Is it accessible?
   ```bash
   curl https://my-app.fastedge.gcore.io/health
   ```

2. **Endpoints** - Do all routes work?
   ```bash
   curl https://my-app.fastedge.gcore.io/
   curl https://my-app.fastedge.gcore.io/api/data
   ```

3. **Environment Variables** - Are they set correctly?
   - Check application behavior
   - Verify configuration-dependent features

4. **Error Handling** - Test error scenarios
   ```bash
   curl https://my-app.fastedge.gcore.io/invalid-endpoint
   ```

### Logging & Debugging

- Use `console.log()` for debugging (visible in FastEdge logs)
- Use `console.error()` for errors
- Monitor application logs in FastEdge dashboard
- Set appropriate LOG_LEVEL via environment variables

## Rollback Procedure

If deployment fails:

1. **Identify issue**
   - Check logs
   - Test endpoints
   - Review error messages

2. **Rollback to previous version**
   ```
   Use update-or-create-app with previous binary_id
   ```

3. **Verify rollback**
   - Test application
   - Check logs
   - Monitor metrics

4. **Fix issue**
   - Fix code locally
   - Test with debugger
   - Redeploy when ready

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy FastEdge App

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install

      - name: Build WASM
        run: npm run build

      - name: Test with debugger
        run: |
          # Start debugger
          cd ../fastedge-debugger && npm start &
          sleep 5

          # Run tests
          cd ../my-app && ./test-scripts/run-tests.sh

      - name: Deploy via MCP
        run: |
          # Use Claude or MCP client to deploy
          # This step depends on your MCP setup
          echo "Deploy using MCP tools"
```

## Security Considerations

1. **Never commit credentials**
   - Use secrets system
   - Use environment variables
   - Use .gitignore properly

2. **Validate inputs**
   - Sanitize user input
   - Validate request parameters
   - Prevent injection attacks

3. **Use HTTPS**
   - FastEdge serves over HTTPS automatically
   - Ensure API calls use HTTPS

4. **Rate limiting**
   - Implement rate limiting if needed
   - Protect against abuse

5. **Authentication**
   - Implement proper auth
   - Verify tokens/API keys
   - Use secrets for credentials

## Troubleshooting

### Issue: "Binary upload failed"

**Solutions**:
- Check WASM file exists: `ls -lh ./dist/app.wasm`
- Verify file size (under size limits)
- Check MCP connection
- Retry upload

### Issue: "Application not responding"

**Solutions**:
- Check application status (should be "active")
- Verify binary_id is correct
- Check application logs
- Test locally with same WASM binary

### Issue: "Environment variables not working"

**Solutions**:
- Verify variables set via `update-env-vars-app`
- Check spelling of variable names
- Ensure using `getEnv()` correctly in code
- Redeploy application after setting variables

### Issue: "Secrets not accessible"

**Solutions**:
- Verify secrets exist in FastEdge dashboard
- Use `get-secret-id` to verify secret IDs
- Check secret names match exactly
- Ensure using `getSecret()` with correct names

## Best Practices

1. **Test before deploy** - Always test locally first
2. **Use staging** - Deploy to staging before production
3. **Monitor deployments** - Watch logs after deployment
4. **Document changes** - Keep deployment log
5. **Automate testing** - Use CI/CD for consistency
6. **Version control** - Tag releases in git
7. **Gradual rollout** - Use feature flags for risky changes
8. **Have rollback plan** - Know how to revert quickly

## Resources

- **FastEdge Dashboard**: Manage applications and view logs
- **MCP Server**: FastEdge-mcp-server repository
- **API Documentation**: FastEdge API reference
- **Examples**: https://github.com/G-Core/FastEdge-examples

## Related Skills

- `fastedge-development` - Build FastEdge applications
- `fastedge-debugging` - Test locally before deploying
- `fastedge-examples` - Browse example applications
