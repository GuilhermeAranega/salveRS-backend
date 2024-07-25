import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { fastifyJwt } from "@fastify/jwt";

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

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(fastifyJwt, { secret: "key", sign: { expiresIn: "3d" } });

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
app.register(deleteItem);

// ? Repair Routes
app.register(createRepair);
app.register(getRepairById);
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

app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("HTTP Server running on port 3333");
});
