import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { hashData } from "./utils/hash-data";
import { compareHashedData } from "./utils/compare-hashed-data";

interface JWTPayload {
  email: string;
  userId: string;
  pwdRestore: boolean;
}

export async function resetVolunteerPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/volunteers/reset/:id",
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

      const [volunteer, link] = await Promise.all([
        prisma.prestadores.findUnique({
          where: { id },
        }),
        prisma.links.findUnique({
          where: {
            token,
          },
        }),
      ]);
      if (!volunteer || !link) {
        throw new Error("Usuário ou token não encontrado");
      }

      const tokenData = (await app.jwt.verify(token)) as JWTPayload;

      if (
        tokenData.email != volunteer.email ||
        tokenData.userId != volunteer.id
      ) {
        throw new Error("Token não validado");
      }

      if (await compareHashedData(volunteer.senha, novaSenha)) {
        throw new Error("A senha não pode ser igual a anterior");
      }

      const hashedNovaSenha = await hashData(novaSenha);

      await Promise.all([
        prisma.links.delete({
          where: {
            userId: id,
          },
        }),
        prisma.prestadores.update({
          where: { id },
          data: { senha: hashedNovaSenha },
        }),
      ]);

      return res.status(200).send({ message: "Senha redefinida com sucesso" });
    }
  );
}
