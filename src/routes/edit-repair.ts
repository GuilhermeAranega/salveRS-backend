import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middleware/jwtAuth";
import { JWTPayload } from "./utils/jwt-payload";
import { NotFound } from "./_errors/not-found";
import { BadRequest } from "./_errors/bad-request";
import { Unauthorized } from "./_errors/unauthorized";

export async function editRepair(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    "/repairs/:id",
    {
      schema: {
        summary: "Edit a repair",
        tags: ["repairs"],
        params: z.object({
          id: z.string().cuid(),
        }),
        body: z.object({
          prestadorId: z.string().cuid().optional(),
          usuarioId: z.string().cuid(),
          itensIds: z.string().cuid().array().optional(),
          observacao: z.string().optional().optional(),
          status: z.enum(["recebido", "consertando", "pronto"]).optional(),
        }),
        response: {
          200: z.object({
            message: z.string(),
            updatedRepair: z.object({
              observacao: z.string().optional(),
              status: z.string(),
              data: z.date(),
            }),
          }),
        },
      },
    },
    async (req, res) => {
      const data = req.body;
      const { id } = req.params;
      const tokenData = (await verifyJWT(req, res)) as JWTPayload;

      const existingRepair = await prisma.consertos.findUnique({
        where: { id },
      });

      if (!existingRepair) {
        throw new NotFound("Conserto não encontrado");
      }

      if (data.usuarioId != tokenData.userId) {
        throw new Unauthorized("Token não validado");
      }

      const updatedRepair = await prisma.consertos.update({
        where: {
          id,
        },
        data,
        include: {
          usuario: true,
          prestador: true,
        },
      });

      await prisma.notificacoes.create({
        data: {
          message: "Um conserto foi atualizado",
          userId: updatedRepair.usuarioId,
        },
      });

      return res.status(200).send({
        message: "Reparo atualizado com sucesso",
        updatedRepair: {
          observacao: updatedRepair.observacao ?? "",
          data: updatedRepair.data,
          status: updatedRepair.status,
        },
      });
    }
  );
}
