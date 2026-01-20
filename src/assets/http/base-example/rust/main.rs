async fn event_handler(event: FetchEvent) -> Result<Response, Error> {
    Ok(Response::new("Hello from FastEdge!"))
}

add_event_listener("fetch", |event| {
    event.respond_with(event_handler(event));
});