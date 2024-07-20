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
import { getItem } from "./routes/get-item";
import { deleteItem } from "./routes/delete-item";
import { editUser } from "./routes/edit-user";
import { getRepair } from "./routes/get-repair";
import { editRepair } from "./routes/edit-repair";
import { createRepair } from "./routes/create-repair";
import { deleteRepair } from "./routes/delete-repair";

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(fastifyJwt, { secret: "key", sign: { expiresIn: "3d" } });

app.register(createUser);
app.register(authenticateUser);
app.register(requestPasswordReset);
app.register(resetPassword);
app.register(getUser);
app.register(editUser);
app.register(deleteUser);
app.register(createItem);
app.register(getItem);
app.register(deleteItem);
app.register(getRepair);
app.register(editRepair);
app.register(createRepair);
app.register(deleteRepair);

app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("HTTP Server running on port 3333");
});
