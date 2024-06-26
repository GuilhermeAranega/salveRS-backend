import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { hashData } from "./utils/hash-data";

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
        }),
      },
    },
    async (req, res) => {
      const { id } = req.params;
      const { novaSenha } = req.body;

      const user = await prisma.usuarios.findUnique({
        where: { id },
      });

      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      try {
        await req.jwtVerify({ key: id + user.senha });
      } catch {
        throw new Error("Token expirado");
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
