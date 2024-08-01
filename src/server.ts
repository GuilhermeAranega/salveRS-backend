import fastify from "fastify";

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";

import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { fastifyJwt } from "@fastify/jwt";
import { errorHandler } from "./error-handler";
import fCookie from "@fastify/cookie";

import { createUser } from "./routes/create-user";
import { authenticateUser } from "./routes/authenticate-user";
import { requestPasswordReset } from "./routes/request-password-reset";
import { resetPassword } from "./routes/reset-password";
import { getUser } from "./routes/get-user";
import { deleteUser } from "./routes/delete-user";
import { createItem } from "./routes/create-item";
import { getItemById } from "./routes/get-item-by-id";
import { deleteItem } from "./routes/delete-item";
import { editUser } from "./routes/edit-user";
import { getRepairById } from "./routes/get-repair-by-id";
import { editRepair } from "./routes/edit-repair";
import { createRepair } from "./routes/create-repair";
import { deleteRepair } from "./routes/delete-repair";
import { createVolunteer } from "./routes/create-volunteer";
import { editVolunteer } from "./routes/edit-volunteer";
import { authenticateVolunteer } from "./routes/authenticate-volunteer";
import { requestVolunteerPasswordReset } from "./routes/request-volunteer-password-reset";
import { resetVolunteerPassword } from "./routes/reset-volunteer.password";
import { getVolunteer } from "./routes/get-volunteer";
import { deleteVolunteer } from "./routes/delete-volunteer";
import { getAllItems } from "./routes/get-all-items";
import { getAllRepairs } from "./routes/get-all-repairs";
import { acceptRepair } from "./routes/accept-repair";
import { getAllPendingRepairs } from "./routes/get-all-pending-repairs";

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "SalveRS API",
      description: "Especificações da API para o projeto SalveRS",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyJwt, { secret: "key", sign: { expiresIn: "3d" } });
app.register(fCookie, {
  secret: process.env.COOKIE_SECRET,
});

// ? User Routes
app.register(createUser);
app.register(authenticateUser);
app.register(requestPasswordReset);
app.register(resetPassword);
app.register(getUser);
app.register(editUser);
app.register(deleteUser);

// ? Item Routes
app.register(createItem);
app.register(getItemById);
app.register(getAllItems);
app.register(deleteItem);

// ? Repair Routes
app.register(createRepair);
app.register(getRepairById);
app.register(getAllRepairs);
app.register(getAllPendingRepairs);
app.register(editRepair);
app.register(deleteRepair);

// ? Volunteer Routes
app.register(createVolunteer);
app.register(authenticateVolunteer);
app.register(requestVolunteerPasswordReset);
app.register(resetVolunteerPassword);
app.register(getVolunteer);
app.register(editVolunteer);
app.register(deleteVolunteer);
app.register(acceptRepair);

app.setErrorHandler(errorHandler);

app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("HTTP Server running on port 3333");
});
