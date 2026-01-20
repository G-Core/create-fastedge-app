async function eventHandler(event) {
  return new Response("Hello from FastEdge!");
}

addEventListener("fetch", (event) => {
  event.respondWith(eventHandler(event));
});