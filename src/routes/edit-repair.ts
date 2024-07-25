import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middleware/jwtAuth";
import { JWTPayload } from "./utils/jwt-payload";

export async function editRepair(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    "/repairs/:id",
    {
      schema: {
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
        throw new Error("Conserto não encontrado");
      }

      if (
        existingRepair.prestadorId != tokenData.userId &&
        existingRepair.usuarioId != tokenData.userId
      ) {
        throw new Error("Token não validado");
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
