import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middleware/jwtAuth";
import { JWTPayload } from "./utils/jwt-payload";

export async function createItem(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/items",
    {
      schema: {
        body: z.object({
          descricao: z.string().min(5),
          qtd: z.number().int().positive().min(1).max(20),
          usuarioId: z.string().cuid(),
        }),
        response: {
          201: z.object({
            message: z.string(),
            itemId: z.string().cuid(),
          }),
        },
      },
    },
    async (req, res) => {
      const { descricao, qtd, usuarioId } = req.body;
      const tokenData = (await verifyJWT(req, res)) as JWTPayload;

      if (tokenData.userId !== usuarioId) {
        throw new Error("Token não validado");
      }

      const user = await prisma.usuarios.findUnique({
        where: { id: usuarioId },
      });

      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      const item = await prisma.itens.create({
        data: {
          descricao,
          quantidade: qtd,
          usuario: {
            connect: {
              id: usuarioId,
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
