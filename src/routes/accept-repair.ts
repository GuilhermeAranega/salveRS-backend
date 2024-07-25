import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middleware/jwtAuth";
import { JWTPayload } from "./utils/jwt-payload";

export async function acceptRepair(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/volunteers/accept-repair/:id",
    {
      schema: {
        params: z.object({
          id: z.string().cuid(),
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
      const { id } = req.params;
      const tokenData = (await verifyJWT(req, res)) as JWTPayload;

      if (!tokenData.volunteer) {
        throw new Error("Você não tem permissão para acessar essa rota");
      }

      const existingRepair = await prisma.consertos.findUnique({
        where: { id: id },
      });

      if (!existingRepair) {
        throw new Error("Conserto não encontrado");
      }

      if (existingRepair.prestadorId) {
        throw new Error("Ese conserto já foi aceito por um voluntário");
      }

      const repair = await prisma.consertos.update({
        where: { id },
        data: {
          prestador: {
            connect: {
              id: tokenData.userId,
            },
          },
        },
      });

      return res.status(201).send({
        message: "Conserto aceito com sucesso",
        repairId: repair.id,
      });
    }
  );
}
