# FastEdge Development Skill

## Overview

FastEdge is a WebAssembly-based edge computing platform that enables developers to run applications at the edge of G-Core's CDN network. This skill provides patterns and best practices for building edge applications.

**Language Support**: JavaScript, TypeScript, Rust, AssemblyScript
**Examples in this skill**: Rust (for language-specific examples, see the `fastedge-examples` skill)

## Core Architecture

### Event-Driven Model

FastEdge HTTP applications use the fetch event listener pattern (WASI-HTTP):

```rust
use fastedge::{body::Body, http::{Request, Response, StatusCode}};

#[fastedge::http]
async fn main(req: Request<Body>) -> Result<Response<Body>, Box<dyn std::error::Error>> {
    let response = Response::builder()
        .status(StatusCode::OK)
        .body(Body::from("Hello from FastEdge!"))?;

    Ok(response)
}
```

FastEdge CDN applications use proxy-wasm hooks:

```rust
use proxy_wasm::traits::*;
use proxy_wasm::types::*;

impl HttpContext for MyContext {
    fn on_http_request_headers(&mut self, _num_headers: usize) -> Action {
        // Modify request headers before forwarding
        Action::Continue
    }

    fn on_http_response_headers(&mut self, _num_headers: usize) -> Action {
        // Modify response headers
        Action::Continue
    }
}
```

> **Note**: For JavaScript, TypeScript, and AssemblyScript examples, see the FastEdge-examples repository via the `fastedge-examples` skill.

### Key Capabilities

- **Request/Response Manipulation** - Modify headers, body, status codes
- **Key-Value Storage** - Edge-local data storage
- **Environment Variables** - Configuration via env vars
- **Secrets Management** - Secure credential storage
- **Multi-Language Support** - JavaScript, TypeScript, Rust, AssemblyScript
- **Low-Latency Deployment** - Global edge network
- **Geo-IP Headers** - Location-based routing

## Environment Variables & Secrets

### Environment Variables

Use for non-sensitive configuration:

```rust
use fastedge::env::get_env;

let base_url = get_env("BASE_URL").unwrap_or_default();
let debug_mode = get_env("DEBUG").unwrap_or_default() == "true";
let api_endpoint = get_env("API_ENDPOINT").unwrap_or_default();
```

### Secrets

Use for sensitive data (API keys, passwords, tokens):

```rust
use fastedge::secrets::get_secret;

// Secrets are async
let api_key = get_secret("api_key").await?;
let database_password = get_secret("db_password").await?;
let auth_token = get_secret("auth_token").await?;
```

## Request/Response Patterns

### Request Modification

```rust
use fastedge::http::{HeaderMap, HeaderName, HeaderValue, Request, Response};

async fn modify_request(req: Request<Body>) -> Result<Response<Body>, Box<dyn std::error::Error>> {
    let mut headers = HeaderMap::new();

    // Copy existing headers
    for (key, value) in req.headers() {
        headers.insert(key.clone(), value.clone());
    }

    // Add custom headers
    headers.insert(
        HeaderName::from_static("x-edge-modified"),
        HeaderValue::from_static("true"),
    );
    headers.insert(
        HeaderName::from_static("x-timestamp"),
        HeaderValue::from_str(&format!("{}",
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)?
                .as_secs()
        ))?,
    );

    // Create new request with modified headers
    let new_req = Request::builder()
        .method(req.method())
        .uri(req.uri())
        .body(req.into_body())?;

    // Forward the request
    Ok(fastedge::http::fetch(new_req).await?)
}
```

### Response Modification

```rust
use fastedge::http::{Response, StatusCode};
use fastedge::body::Body;

async fn modify_response(resp: Response<Body>) -> Result<Response<Body>, Box<dyn std::error::Error>> {
    let (parts, body) = resp.into_parts();
    let body_bytes = fastedge::body::to_bytes(body).await?;
    let body_str = String::from_utf8(body_bytes.to_vec())?;

    let modified_body = body_str.replace("old-content", "new-content");

    let mut response = Response::new(Body::from(modified_body));
    *response.status_mut() = parts.status;
    *response.headers_mut() = parts.headers;

    response.headers_mut().insert(
        "x-modified-by",
        "FastEdge".parse()?,
    );
    response.headers_mut().insert(
        "cache-control",
        "public, max-age=3600".parse()?,
    );

    Ok(response)
}
```

### Content-Length Warning

> **⚠️ CRITICAL for CDN Applications (proxy-wasm)**
>
> When manipulating `onRequestBody` or `onResponseBody`, you **MUST** update the `content-length` header in the previous step (`onRequestHeader` or `onResponseHeader`).
>
> **Applications will fail** if you change body content without updating content-length.

## Error Handling

### Comprehensive Error Handling Pattern

```rust
use fastedge::http::{Request, Response, StatusCode};
use fastedge::body::Body;
use serde_json::json;

async fn handle_request(req: Request<Body>) -> Result<Response<Body>, Box<dyn std::error::Error>> {
    match process_request(req).await {
        Ok(response) => Ok(response),
        Err(e) => {
            eprintln!("Request processing failed: {:?}", e);

            // Match on error types
            let (status, error_message) = match e.downcast_ref::<ValidationError>() {
                Some(err) => (
                    StatusCode::BAD_REQUEST,
                    json!({ "error": "Bad Request", "message": err.to_string() })
                ),
                None => match e.downcast_ref::<AuthenticationError>() {
                    Some(_) => (
                        StatusCode::UNAUTHORIZED,
                        json!({ "error": "Unauthorized" })
                    ),
                    None => match e.downcast_ref::<NotFoundError>() {
                        Some(_) => (
                            StatusCode::NOT_FOUND,
                            json!({ "error": "Not Found" })
                        ),
                        None => (
                            StatusCode::INTERNAL_SERVER_ERROR,
                            json!({ "error": "Internal Server Error" })
                        ),
                    },
                },
            };

            Ok(Response::builder()
                .status(status)
                .header("Content-Type", "application/json")
                .body(Body::from(error_message.to_string()))?)
        }
    }
}
```

## Building FastEdge Applications

### Rust Build

```bash
# Install wasm32-wasi target
rustup target add wasm32-wasi

# Build to WASM
cargo build --target wasm32-wasi --release

# Output will be in target/wasm32-wasi/release/
```

**Cargo.toml dependencies**:

```toml
[dependencies]
fastedge = "0.1"
tokio = { version = "1", features = ["macros", "rt"] }

[lib]
crate-type = ["cdylib"]
```

### Other Languages

For JavaScript, TypeScript, and AssemblyScript build instructions, see:
- **fastedge-examples skill** - Links to language-specific examples
- **FastEdge-examples repository** - Complete example projects with build configs
- **FastEdge documentation** - https://g-core.github.io/FastEdge-sdk-js/

## Best Practices

### 1. Performance Optimization

- **Keep code lightweight** - Edge runtime has size constraints
- **Minimize dependencies** - Each dependency increases bundle size
- **Use async/await** - Non-blocking operations are essential
- **Implement caching** - Cache-Control headers, edge storage
- **Avoid heavy computations** - Offload to backend services if needed

### 2. Security

- **Validate inputs** - Always sanitize and validate user input
- **Use secrets** - Never hardcode credentials
- **Implement authentication** - Verify tokens, API keys
- **Set CORS headers** - Control cross-origin access
- **Sanitize outputs** - Prevent XSS attacks

```rust
// Example: Input validation
use regex::Regex;

fn validate_request(req: &Request<Body>) -> Result<String, ValidationError> {
    let url = req.uri().to_string();
    let id = extract_query_param(&url, "id")?;

    let re = Regex::new(r"^[a-zA-Z0-9-]+$")?;
    if !re.is_match(&id) {
        return Err(ValidationError::new("Invalid ID format"));
    }

    Ok(id)
}
```

### 3. Error Handling

- **Handle errors gracefully** - Don't expose internal errors
- **Use appropriate status codes** - 400, 401, 404, 500, etc.
- **Log errors** - Use eprintln! for debugging
- **Provide meaningful messages** - Help users understand issues

### 4. Development Workflow

1. **Local Development** - Use fastedge-debugger for testing
2. **Test Before Deploy** - Always test locally first
3. **Version Control** - Commit working code
4. **Incremental Deployment** - Test on staging first
5. **Monitor Performance** - Check logs and metrics

## Application Types

### HTTP Applications

Basic request/response handling:

```rust
use fastedge::{body::Body, http::{Request, Response, StatusCode}};

#[fastedge::http]
async fn main(req: Request<Body>) -> Result<Response<Body>, Box<dyn std::error::Error>> {
    let path = req.uri().path();

    match path {
        "/" => {
            Ok(Response::builder()
                .status(StatusCode::OK)
                .header("Content-Type", "text/plain")
                .body(Body::from("Hello from FastEdge!"))?)
        }
        "/api/data" => {
            let data = serde_json::json!({ "data": "example" });
            Ok(Response::builder()
                .status(StatusCode::OK)
                .header("Content-Type", "application/json")
                .body(Body::from(data.to_string()))?)
        }
        _ => {
            Ok(Response::builder()
                .status(StatusCode::NOT_FOUND)
                .body(Body::from("Not Found"))?)
        }
    }
}
```

### CDN Applications (Proxy WASM)

Event-driven CDN hooks:

```rust
use proxy_wasm::traits::*;
use proxy_wasm::types::*;

impl HttpContext for MyContext {
    fn on_http_request_headers(&mut self, _num_headers: usize) -> Action {
        // Modify request headers before forwarding
        self.set_http_request_header("X-Custom-Header", Some("value"));
        Action::Continue
    }

    fn on_http_request_body(&mut self, _body_size: usize, _end_of_stream: bool) -> Action {
        // Modify request body
        // ⚠️ Remember to update content-length in on_http_request_headers
        Action::Continue
    }

    fn on_http_response_headers(&mut self, _num_headers: usize) -> Action {
        // Modify response headers
        self.set_http_response_header("Cache-Control", Some("public, max-age=3600"));
        Action::Continue
    }

    fn on_http_response_body(&mut self, _body_size: usize, _end_of_stream: bool) -> Action {
        // Modify response body
        // ⚠️ Remember to update content-length in on_http_response_headers
        Action::Continue
    }
}
```

## Language-Specific Notes

### Rust Benefits

- **Maximum performance** - Compiled to highly optimized WASM
- **Memory safety** - No null pointers, no data races
- **Compile-time guarantees** - Catches errors before runtime
- **Zero-cost abstractions** - High-level code, low-level performance

**Pattern Matching**:
```rust
match req.method() {
    &Method::GET => handle_get(req).await,
    &Method::POST => handle_post(req).await,
    &Method::PUT => handle_put(req).await,
    _ => Ok(method_not_allowed()),
}
```

**Error Handling with Result**:
```rust
fn process_data(data: &str) -> Result<String, Box<dyn std::error::Error>> {
    let parsed = serde_json::from_str(data)?;
    Ok(transform(parsed))
}
```

### Other Languages

For JavaScript, TypeScript, and AssemblyScript:
- **Syntax and patterns** - See FastEdge-examples repository
- **Build configuration** - Language-specific build tools
- **Type safety** - TypeScript provides compile-time checking
- **Performance** - Rust and AssemblyScript offer better performance than JavaScript

**Finding language-specific examples**:
- Use the `fastedge-examples` skill to discover examples
- Visit https://github.com/G-Core/FastEdge-examples
- Look for `http-base-{language}`, `http-react-{language}`, `cdn-base-{language}`

## Resources

- **Documentation**: https://g-core.github.io/FastEdge-sdk-js/
- **Examples**: https://github.com/G-Core/FastEdge-examples
- **Rust Crate**: https://crates.io/crates/fastedge
- **Rust Docs**: https://docs.rs/fastedge
- **Debugger**: Use fastedge-debugger for local testing
- **VSCode Extension**: FastEdge Launcher for IDE integration

## Related Skills

- `fastedge-debugging` - Learn how to test locally with the debugger
- `fastedge-deployment` - Learn how to deploy to production
- `fastedge-examples` - Browse example applications and language-specific patterns
