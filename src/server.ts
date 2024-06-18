import { fastify } from "fastify";

const server = fastify();

server.get("/", (req, res) => {
  console.log("req");
});

server.listen({ port: 3333 }, () => {
  console.log("HTTP Server running on port 3333");
});
