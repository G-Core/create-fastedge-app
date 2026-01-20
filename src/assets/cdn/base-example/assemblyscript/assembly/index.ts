export * from "@gcoredev/proxy-wasm-sdk-as/assembly/proxy"; // this exports the required functions for the proxy to interact with us.
import {
  Context,
  FilterDataStatusValues,
  FilterHeadersStatusValues,
  log,
  LogLevelValues,
  registerRootContext,
  RootContext,
  setLogLevel,
} from "@gcoredev/proxy-wasm-sdk-as/assembly";

class HttpBodyRoot extends RootContext {
  createContext(context_id: u32): Context {
    setLogLevel(LogLevelValues.info); // Set the log level to info - for more logging reduce this to LogLevelValues.trace
    return new HttpBody(context_id, this);
  }
}

class HttpBody extends Context {
  constructor(context_id: u32, root_context: HttpBodyRoot) {
    super(context_id, root_context);
  }

  onRequestHeaders(
    headers: u32,
    end_of_stream: bool
  ): FilterHeadersStatusValues {
    log(LogLevelValues.info, "onRequestHeaders >>");
    // Process the request headers here...

    return FilterHeadersStatusValues.Continue;
  }

  onRequestBody(
    body_buffer_length: usize,
    end_of_stream: bool
  ): FilterDataStatusValues {
    log(LogLevelValues.info, "onRequestBody >>");
    if (!end_of_stream) {
      // Wait until the complete body is buffered
      return FilterDataStatusValues.StopIterationAndBuffer;
    }

    // Process the request body here...
    // NOTE: if altering the body, remember to update the content-length header accordingly in the previous hook onRequestHeaders.
    return FilterDataStatusValues.Continue;
  }

  onResponseHeaders(a: u32, end_of_stream: bool): FilterHeadersStatusValues {
    log(LogLevelValues.info, "onResponseHeaders >>");
    // Process the response headers here...

    return FilterHeadersStatusValues.Continue;
  }

  onResponseBody(
    body_buffer_length: usize,
    end_of_stream: bool
  ): FilterDataStatusValues {
    if (!end_of_stream) {
      // Wait until the complete body is buffered
      return FilterDataStatusValues.StopIterationAndBuffer;
    }
    log(LogLevelValues.info, "onResponseBody >>");
    // Process the response body here...
    // NOTE: if altering the body, remember to update the content-length header accordingly in the previous hook onResponseHeaders.

    return FilterDataStatusValues.Continue;
  }
}

registerRootContext((context_id: u32) => {
  return new HttpBodyRoot(context_id);
}, "httpBody");
