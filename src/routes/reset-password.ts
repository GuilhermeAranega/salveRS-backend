import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { hashData } from "./utils/hash-data";
import {
  compareHashedData,
  compareHashedData,
} from "./utils/compare-hashed-data";
import { NotFound } from "./_errors/not-found";
import { Unauthorized } from "./_errors/unauthorized";
import { BadRequest } from "./_errors/bad-request";

interface JWTPayload {
  email: string;
  userId: string;
  pwdRestore: boolean;
}

export async function resetPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/users/reset/:id",
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          novaSenha: z.string().min(8),
          token: z.string(),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      const { id } = req.params;
      const { novaSenha, token } = req.body;

      const [user, link] = await Promise.all([
        prisma.usuarios.findUnique({
          where: { id },
        }),
        prisma.links.findUnique({
          where: {
            token,
          },
        }),
      ]);

      if (!user || !link) {
        throw new NotFound("Usuário ou token não encontrado");
      }

      const tokenData = (await app.jwt.verify(token)) as JWTPayload;

      if (tokenData.email != user.email || tokenData.userId != user.id) {
        throw new Unauthorized("Token não validado");
      }

      if (await compareHashedData(user.senha, novaSenha)) {
        throw new BadRequest("A senha não pode ser igual a anterior");
      }

      const hashedNovaSenha = await hashData(novaSenha);

      await Promise.all([
        prisma.links.delete({
          where: {
            userId: id,
          },
        }),
        prisma.usuarios.update({
          where: { id },
          data: { senha: hashedNovaSenha },
        }),
      ]);

      return res.status(200).send({ message: "Senha redefinida com sucesso" });
    }
  );
}
