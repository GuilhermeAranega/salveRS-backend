import { BadRequest } from "./_errors/bad-request";
import { Unauthorized } from "./_errors/unauthorized";
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
        summary: "Accept a repair solicitation",
        tags: ["volunteers"],
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
        throw new Unauthorized("Você não tem permissão para acessar essa rota");
      }

      const existingRepair = await prisma.consertos.findUnique({
        where: { id: id },
      });

      if (!existingRepair) {
        throw new BadRequest("Conserto não encontrado");
      }

      if (existingRepair.prestadorId) {
        throw new BadRequest("Ese conserto já foi aceito por um voluntário");
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
        select: {
          id: true,
          usuarioId: true,
          prestador: {
            select: {
              nome: true,
            },
          },
        },
      });

      await prisma.notificacoes.create({
        data: {
          userId: repair.usuarioId,
          message: repair.prestador
            ? `Seu conserto foi aceito por ${repair.prestador.nome}`
            : "Seu conserto foi aceito por um voluntário",
        },
      });

      return res.status(201).send({
        message: "Conserto aceito com sucesso",
        repairId: repair.id,
      });
    }
  );
}
