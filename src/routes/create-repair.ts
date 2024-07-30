import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middleware/jwtAuth";
import { JWTPayload } from "./utils/jwt-payload";
import { BadRequest } from "./_errors/bad-request";
import { Unauthorized } from "./_errors/unauthorized";

export async function createRepair(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/repairs",
    {
      schema: {
        summary: "Create a repair",
        tags: ["repairs"],
        body: z.object({
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
      const { usuarioId, itensIds, observacao } = req.body;
      const tokenData = (await verifyJWT(req, res)) as JWTPayload;

      if (tokenData.userId != usuarioId) {
        throw new Unauthorized("Token não validado");
      }

      const repair = await prisma.consertos.create({
        data: {
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

      await prisma.notificacoes.create({
        data: {
          message: "Há um novo conserto disponível",
          global: true,
        },
      });

      return res.status(201).send({
        message: "Conserto criado com sucesso",
        repairId: repair.id,
      });
    }
  );
}
