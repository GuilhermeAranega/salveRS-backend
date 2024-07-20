import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middleware/jwtAuth";

export async function createItem(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/items",
    {
      schema: {
        body: z.object({
          descricao: z.string().min(5),
          qtd: z.number().int().positive().min(1).max(20),
          consertoId: z.string().cuid(),
        }),
        response: {
          201: z.object({
            message: z.string(),
            itemId: z.string().cuid(),
          }),
        },
      },
      onRequest: [verifyJWT],
    },
    async (req, res) => {
      const { descricao, qtd, consertoId } = req.body;

      const conserto = await prisma.consertos.findUnique({
        where: { id: consertoId },
      });

      if (!conserto) {
        throw new Error("conserto não encontrado");
      }

      const item = await prisma.itens.create({
        data: {
          descricao,
          quantidade: qtd,
          conserto: {
            connect: {
              id: consertoId,
            },
          },
        },
      });

      return res.status(201).send({
        message: "Item criado com sucesso",
        itemId: item.id,
      });
    }
  );
}
