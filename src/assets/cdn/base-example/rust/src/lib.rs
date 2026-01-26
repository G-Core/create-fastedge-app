use proxy_wasm::traits::*;
use proxy_wasm::types::*;

proxy_wasm::main! {{
    proxy_wasm::set_log_level(LogLevel::Info); // Set the log level to info - for more logging reduce this to LogLevel::Trace
    proxy_wasm::set_root_context(|_| -> Box<dyn RootContext> { Box::new(HttpBodyRoot) });
}}

struct HttpBodyRoot;

impl Context for HttpBodyRoot {}

impl RootContext for HttpBodyRoot {
    fn create_http_context(&self, _context_id: u32) -> Option<Box<dyn HttpContext>> {
        Some(Box::new(HttpBody {}))
    }
    fn get_type(&self) -> Option<ContextType> {
        Some(ContextType::HttpContext)
    }
}

struct HttpBody {}

impl Context for HttpBody {}

impl HttpContext for HttpBody {
    fn on_http_request_headers(&mut self, _: usize, _: bool) -> Action {
        println!("on_http_request_headers: ");
        // Process the request headers here...

        Action::Continue
    }

    fn on_http_request_body(&mut self, _: usize, end_of_stream: bool) -> Action {
        if end_of_stream {
            // Wait until the complete body is buffered
            println!("on_http_request_body: ");
            // Process the request body here...
            // NOTE: if altering the body, remember to update the content-length header accordingly in the previous hook on_http_request_headers.
        }
        Action::Continue
    }

    fn on_http_response_headers(&mut self, _: usize, _: bool) -> Action {
        println!("on_http_response_headers: ");
        // Process the response headers here...

        Action::Continue
    }

    fn on_http_response_body(&mut self, _: usize, end_of_stream: bool) -> Action {
        if end_of_stream {
            println!("on_http_response_body: ");
            // Process the response body here...
            // NOTE: if altering the body, remember to update the content-length header accordingly in the previous hook on_http_response_headers.
        }
        Action::Continue
    }
}