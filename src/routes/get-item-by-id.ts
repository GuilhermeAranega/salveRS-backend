import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middleware/jwtAuth";

export async function getItem(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/items/:id",
    {
      schema: {
        params: z.object({
          id: z.string().cuid(),
        }),
        response: {
          200: z.object({
            message: z.string(),
            item: z.object({
              descricao: z.string().min(5),
              qtd: z.number().int().positive().min(1).max(20),
            }),
          }),
        },
      },
      onRequest: [verifyJWT],
    },
    async (req, res) => {
      const { id } = req.params;

      const item = await prisma.itens.findUnique({
        where: { id },
      });

      if (!item) {
        throw new Error("Item não encontrado");
      }

      return res.status(201).send({
        message: "Item encontrado com sucesso",
        item: {
          descricao: item.descricao,
          qtd: item.quantidade,
        },
      });
    }
  );
}
