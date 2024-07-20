import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middleware/jwtAuth";
import { JWTPayload } from "./utils/jwt-payload";

export async function createRepair(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/repairs",
    {
      schema: {
        body: z.object({
          prestadorId: z.string().cuid(),
          usuarioId: z.string().cuid(),
          itensIds: z.string().cuid().array(),
          observacao: z.string().optional(),
        }),
        response: {
          201: z.object({
            message: z.string(),
            repairId: z.string().cuid(),
          }),
        },
      },
    },
    async (req, res) => {
      const { prestadorId, usuarioId, itensIds, observacao } = req.body;
      const tokenData = (await verifyJWT(req, res)) as JWTPayload;

      if (tokenData.userId != usuarioId) {
        throw new Error("Token não validado");
      }

      const repair = await prisma.consertos.create({
        data: {
          prestador: {
            connect: {
              id: prestadorId,
            },
          },
          usuario: {
            connect: {
              id: usuarioId,
            },
          },
          itens: {
            connect: itensIds.map((id) => ({ id })),
          },
          observacao,
        },
      });

      return res.status(201).send({
        message: "Item criado com sucesso",
        repairId: repair.id,
      });
    }
  );
}
