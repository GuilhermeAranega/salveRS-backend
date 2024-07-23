import { JWTPayload } from "./utils/jwt-payload";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middleware/jwtAuth";

export async function getRepair(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/repairs/:id",
    {
      schema: {
        params: z.object({
          id: z.string().cuid(),
        }),
        response: {
          200: z.object({
            message: z.string(),
            repair: z.object({
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
      const { id } = req.params;
      const tokenData = (await verifyJWT(req, res)) as JWTPayload;

      const repair = await prisma.consertos.findUnique({
        where: { id },
        include: {
          usuario: true,
          prestador: true,
        },
      });

      if (!repair) {
        throw new Error("Conserto não encontrado");
      }

      if (
        repair.prestadorId != tokenData.userId &&
        repair.usuarioId != tokenData.userId
      ) {
        throw new Error("Token não validado");
      }
      return res.status(201).send({
        message: "Conserto encontrado com sucesso",
        repair: {
          observacao: repair.observacao ?? "",
          data: repair.data,
          status: repair.status,
          usuario: {
            nome: repair.usuario.nome,
            tipo: repair.usuario.tipo,
          },
          prestador: {
            nome: repair.prestador.nome,
            tipo: repair.prestador.tipo,
            endereco: {
              cep: repair.prestador.cep,
              rua: repair.prestador.rua,
              numero: repair.prestador.numero,
              complemento: repair.prestador.complemento,
              bairro: repair.prestador.bairro,
              cidade: repair.prestador.cidade,
            },
          },
        },
      });
    }
  );
}
