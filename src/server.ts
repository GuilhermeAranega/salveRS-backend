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

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(fastifyJwt, { secret: "key", sign: { expiresIn: "3d" } });

app.register(createUser);
app.register(authenticateUser);
app.register(requestPasswordReset);
app.register(resetPassword);
app.register(getUser);

app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("HTTP Server running on port 3333");
});
