async function eventHandler(event: FetchEvent): Promise<Response> {
  return new Response("Hello from FastEdge!");
}

addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(eventHandler(event));
});