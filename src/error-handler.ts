import { FastifyInstance } from "fastify";
import { BadRequest } from "./routes/_errors/bad-request";
import { Unauthorized } from "./routes/_errors/unauthorized";
import { ZodError } from "zod";
import { NotFound } from "./routes/_errors/not-found";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Error during validation",
      errors: error.flatten().fieldErrors,
    });
  }

  if (error instanceof BadRequest) {
    return reply.status(400).send({ message: error.message });
  }

  if (error instanceof Unauthorized) {
    return reply.status(401).send({ message: error.message });
  }

  if (error instanceof NotFound) {
    return reply.status(404).send({ message: error.message });
  }

  reply.status(500).send({ message: "Internal server error" });
};
