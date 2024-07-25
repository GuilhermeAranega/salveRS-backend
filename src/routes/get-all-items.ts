import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middleware/jwtAuth";

export async function getAllItems(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/items/by-repair/:id",
    {
      schema: {
        params: z.object({
          id: z.string().cuid(),
        }),
        response: {
          200: z.object({
            message: z.string(),
            items: z
              .object({
                descricao: z.string(),
                qtd: z.number().int().positive(),
              })
              .array(),
          }),
        },
      },
      onRequest: [verifyJWT],
    },
    async (req, res) => {
      const { id } = req.params;

      const items = await prisma.itens.findMany({
        where: { conserto: { id } },
        select: {
          descricao: true,
          quantidade: true,
        },
      });

      if (items.length == 0) {
        throw new Error("Item não encontrado");
      }

      return res.status(201).send({
        message: "Itens encontrado com sucesso",
        items: items.map((item) => ({
          descricao: item.descricao,
          qtd: item.quantidade,
        })),
      });
    }
  );
}
