# FastEdge Debugging Skill

## Overview

The fastedge-debugger is a local testing runtime that allows you to test FastEdge applications before deploying to production. It provides both a web UI and REST API for programmatic testing.

## Why Debug Locally?

**Always test locally before deploying to production:**

1. **Faster iteration** - No deployment wait time
2. **Safe testing** - No impact on production
3. **Better debugging** - Real-time logs and inspection
4. **Cost effective** - No edge compute costs during development

## Getting Started

### Installation

The debugger can be used in multiple ways:

**As a standalone tool:**
```bash
# Clone the repository
git clone https://github.com/G-Core/fastedge-debugger
cd fastedge-debugger

# Install dependencies
npm install

# Start the debugger
npm start
```

**In a Codespace:**
- The debugger is pre-installed in the fastedge-template Codespace
- Access the UI via the Ports panel (port 5179)

**Via VSCode Extension:**
- Install the FastEdge-vscode extension
- Use the "Debug: FastEdge App" command
- Debugger opens in a webview panel

### Debugger Ports

- **5179**: Web UI and REST API
- **5178**: WebSocket for log streaming (optional)

## Web UI Usage

### Starting the Web UI

1. Build your WASM file:
   ```bash
   npm run build
   ```

2. Start the debugger:
   ```bash
   npm start
   ```

3. Open browser to: `http://localhost:5179`

### UI Features

- **Load WASM Module** - Upload your compiled .wasm file
- **Test Requests** - Send HTTP requests with custom headers/body
- **View Responses** - See response status, headers, and body
- **Real-time Logs** - Console output from your application
- **Configuration** - Set environment variables and application mode

## REST API Usage (For Agents)

The debugger provides a comprehensive REST API for programmatic testing. This is especially useful for AI agents automating the test workflow.

### API Endpoints

#### 1. Health Check

```bash
GET /health

Response: { "status": "ok" }
```

#### 2. Load WASM Module

```bash
POST /api/load
Content-Type: application/json

{
  "wasmPath": "/path/to/your/app.wasm"
}

Response: { "success": true }
```

#### 3. Execute HTTP Request

```bash
POST /api/execute
Content-Type: application/json

{
  "method": "GET",
  "url": "http://localhost/api/test",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer token123"
  },
  "body": "{\"data\": \"test\"}"
}

Response: {
  "status": 200,
  "headers": { "content-type": "application/json" },
  "body": "{\"result\": \"success\"}"
}
```

#### 4. Call Specific Function

```bash
POST /api/call
Content-Type: application/json

{
  "function": "handleRequest",
  "args": ["arg1", "arg2"]
}

Response: { "result": "..." }
```

#### 5. Get Configuration

```bash
GET /api/config

Response: {
  "mode": "http",
  "envVars": {
    "DEBUG": "true",
    "API_URL": "https://api.example.com"
  }
}
```

#### 6. Update Configuration

```bash
POST /api/config
Content-Type: application/json

{
  "mode": "http",
  "envVars": {
    "DEBUG": "true",
    "API_URL": "https://api.example.com",
    "NEW_VAR": "value"
  }
}

Response: { "success": true }
```

## Testing Workflow

### Manual Testing Workflow

1. **Build** - Compile your code to WASM
2. **Load** - Upload WASM to debugger
3. **Configure** - Set environment variables
4. **Test** - Send test requests
5. **Debug** - Check logs and responses
6. **Iterate** - Fix issues and rebuild

### Automated Testing Workflow (For Agents)

```bash
#!/bin/bash
# Example: Automated test script

# 1. Build the application
echo "Building WASM..."
npm run build

# 2. Ensure debugger is running
curl -s http://localhost:5179/health || exit 1

# 3. Load the WASM module
echo "Loading WASM..."
curl -X POST http://localhost:5179/api/load \
  -H "Content-Type: application/json" \
  -d '{"wasmPath": "./dist/app.wasm"}'

# 4. Configure environment
echo "Configuring environment..."
curl -X POST http://localhost:5179/api/config \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "http",
    "envVars": {
      "DEBUG": "true",
      "API_URL": "https://api.example.com"
    }
  }'

# 5. Run test requests
echo "Testing endpoints..."

# Test root endpoint
curl -X POST http://localhost:5179/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "method": "GET",
    "url": "http://localhost/",
    "headers": {}
  }' | jq .

# Test API endpoint
curl -X POST http://localhost:5179/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "method": "POST",
    "url": "http://localhost/api/data",
    "headers": {"Content-Type": "application/json"},
    "body": "{\"test\": \"data\"}"
  }' | jq .

echo "Testing complete!"
```

## Application Modes

### HTTP Mode

For standard HTTP request/response applications:

```json
{
  "mode": "http"
}
```

Test with standard HTTP requests to any URL path.

### CDN Mode

For CDN proxy applications:

```json
{
  "mode": "cdn"
}
```

Test CDN event hooks (onRequestHeader, onRequestBody, etc.).

## Environment Variables for Testing

### Setting Environment Variables

Via API:
```bash
curl -X POST http://localhost:5179/api/config \
  -H "Content-Type: application/json" \
  -d '{
    "envVars": {
      "DEBUG": "true",
      "BASE_URL": "https://staging.example.com",
      "FEATURE_FLAG": "enabled"
    }
  }'
```

### Testing with Different Configurations

Test multiple scenarios by changing environment variables:

```bash
# Test production config
curl -X POST http://localhost:5179/api/config \
  -d '{"envVars": {"ENV": "production", "DEBUG": "false"}}'

# Run tests
./run-tests.sh

# Test staging config
curl -X POST http://localhost:5179/api/config \
  -d '{"envVars": {"ENV": "staging", "DEBUG": "true"}}'

# Run tests again
./run-tests.sh
```

## Debugging Tips

### 1. Check Logs

The debugger captures all console output from your application:

- **Web UI**: Logs appear in the "Logging" panel
- **WebSocket**: Connect to `ws://localhost:5178` for streaming logs

### 2. Test Edge Cases

Always test:
- Missing/invalid parameters
- Malformed requests
- Large payloads
- Special characters
- Authentication scenarios
- Error conditions

### 3. Performance Testing

Test response times locally:

```bash
# Use time to measure response
time curl -X POST http://localhost:5179/api/execute \
  -H "Content-Type: application/json" \
  -d '{"method": "GET", "url": "http://localhost/"}'
```

### 4. Iterative Development

Keep the debugger running and rebuild on changes:

```bash
# Watch mode
npm run build:watch

# In another terminal, auto-reload tests
while inotifywait -e modify ./dist/app.wasm; do
  curl -X POST http://localhost:5179/api/load \
    -d '{"wasmPath": "./dist/app.wasm"}'
  ./run-tests.sh
done
```

## Common Issues

### Issue: "Module failed to load"

**Cause**: WASM file path is incorrect or file doesn't exist

**Solution**:
```bash
# Check file exists
ls -lh ./dist/app.wasm

# Use absolute path
curl -X POST http://localhost:5179/api/load \
  -d "{\"wasmPath\": \"$(pwd)/dist/app.wasm\"}"
```

### Issue: "Connection refused"

**Cause**: Debugger is not running

**Solution**:
```bash
# Start the debugger
cd fastedge-debugger
npm start

# Or check if it's already running
curl http://localhost:5179/health
```

### Issue: "Environment variables not working"

**Cause**: Variables set after loading WASM

**Solution**:
```bash
# Always configure BEFORE loading WASM
curl -X POST http://localhost:5179/api/config \
  -d '{"envVars": {"KEY": "value"}}'

curl -X POST http://localhost:5179/api/load \
  -d '{"wasmPath": "./dist/app.wasm"}'
```

## Best Practices

1. **Always test locally first** - Never deploy untested code
2. **Automate testing** - Create test scripts for common scenarios
3. **Test with realistic data** - Use production-like test data
4. **Test error cases** - Ensure proper error handling
5. **Check performance** - Verify acceptable response times
6. **Use environment variables** - Test different configurations
7. **Keep debugger running** - Faster development cycle

## Integration with Development Workflow

### Recommended Workflow

```
1. Write code
   ↓
2. Build to WASM (npm run build)
   ↓
3. Load into debugger
   ↓
4. Test with REST API
   ↓
5. Check logs for errors
   ↓
6. If tests pass → Deploy to production
   If tests fail → Go back to step 1
```

### CI/CD Integration

Include debugging in your CI pipeline:

```yaml
# .github/workflows/test.yml
- name: Test with debugger
  run: |
    npm install
    npm run build

    # Start debugger in background
    cd ../fastedge-debugger
    npm start &
    sleep 5

    # Run tests
    cd ../my-app
    ./test-scripts/run-all-tests.sh
```

## Resources

- **Debugger Repository**: https://github.com/G-Core/fastedge-debugger
- **API Documentation**: See fastedge-debugger/docs/API.md
- **VSCode Extension**: Use "Debug: FastEdge App" command
- **Examples**: https://github.com/G-Core/FastEdge-examples

## Related Skills

- `fastedge-development` - Learn how to build FastEdge applications
- `fastedge-deployment` - Learn how to deploy after testing
- `fastedge-examples` - Browse example applications
