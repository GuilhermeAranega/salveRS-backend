import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { compareHashedData } from "./utils/compare-hashed-data";

export async function authenticateUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/users/authenticate",
    {
      schema: {
        body: z.object({
          email: z.string().email(),
          senha: z.string().min(8),
          tipo: z.enum(["empresa", "pessoa_fisica"]),
        }),
        response: {
          200: z.object({
            message: z.string(),
            token: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      const data = req.body;

      const user = await prisma.usuarios.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        throw new Error("Email não cadastrado");
      }

      if (!(await compareHashedData(user.senha, data.senha))) {
        throw new Error("Senha inválida");
      }

      const token = await res.jwtSign({
        userId: user.id,
        tipo: data.tipo,
        email: data.email,
      });

      return res.status(200).header("authorization", token).send({
        message: "Autenticado com sucesso",
        token,
      });
    }
  );
}
