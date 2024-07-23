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
              usuario: z.object({
                nome: z.string(),
                tipo: z.string(),
              }),
              prestador: z.object({
                nome: z.string(),
                tipo: z.string(),
                endereco: z.object({
                  cep: z.string(),
                  rua: z.string(),
                  numero: z.number().int().positive().max(1000),
                  complemento: z.string(),
                  bairro: z.string(),
                  cidade: z.string(),
                }),
              }),
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
        where: { id: tokenData.userId },
      });

      if (!existingRepair) {
        throw new Error("Esse conserto não existe");
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
        message: "Usuário atualizado com sucesso",
        updatedRepair: {
          observacao: updatedRepair.observacao ?? "",
          data: updatedRepair.data,
          status: updatedRepair.status,
          usuario: {
            nome: updatedRepair.usuario.nome,
            tipo: updatedRepair.usuario.tipo,
          },
          prestador: {
            nome: updatedRepair.prestador.nome,
            tipo: updatedRepair.prestador.tipo,
            endereco: {
              cep: updatedRepair.prestador.cep,
              rua: updatedRepair.prestador.rua,
              numero: updatedRepair.prestador.numero,
              complemento: updatedRepair.prestador.complemento,
              bairro: updatedRepair.prestador.bairro,
              cidade: updatedRepair.prestador.cidade,
            },
          },
        },
      });
    }
  );
}
