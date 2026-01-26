use fastedge::{
    body::Body,
    http::{header, Error, Method, Request, Response, StatusCode},
};

#[fastedge::http]
fn main(req: Request<Body>) -> Result<Response<Body>, Error> {
    match req.method() {
        &Method::GET | &Method::HEAD => (),
        _ => {
            return Response::builder()
                .status(StatusCode::METHOD_NOT_ALLOWED)
                .header(header::ALLOW, "GET, HEAD")
                .body(Body::from("This method is not allowed\n"));
        }
    };

    // get request path
    let path = req.uri().path();
    let response_body = format!("You made a request to: {}", path);

    let rsp = Response::builder()
        .status(StatusCode::OK)
        .body(Body::from(response_body))?;

    Ok(rsp)
}
