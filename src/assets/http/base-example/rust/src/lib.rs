use wstd::http::body::Body;
use wstd::http::{Method, Request, Response, StatusCode};

#[wstd::http_server]
async fn main(request: Request<Body>) -> anyhow::Result<Response<Body>> {
    match request.method() {
        &Method::GET | &Method::HEAD => (),
        _ => {
            return Ok(Response::builder()
                .status(StatusCode::METHOD_NOT_ALLOWED)
                .header("allow", "GET, HEAD")
                .body(Body::from("This method is not allowed\n"))?);
        }
    };

    let path = request.uri().path();

    Ok(Response::builder()
        .status(StatusCode::OK)
        .header("content-type", "text/plain;charset=UTF-8")
        .body(Body::from(format!(
            "Hello from FastEdge! You made a request to {path}"
        )))?)
}
