import { JWTPayload } from "./utils/jwt-payload";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middleware/jwtAuth";
import { NotFound } from "./_errors/not-found";
import { Unauthorized } from "./_errors/unauthorized";

export async function getRepairById(app: FastifyInstance) {
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
              prestador: z
                .object({
                  nome: z.string().nullish(),
                  tipo: z.string().nullish(),
                  endereco: z.object({
                    cep: z.string().nullish(),
                    rua: z.string().nullish(),
                    numero: z.number().int().positive().max(1000).nullish(),
                    complemento: z.string().nullish(),
                    bairro: z.string().nullish(),
                    cidade: z.string().nullish(),
                  }),
                })
                .optional(),
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
        throw new NotFound("Conserto não encontrado");
      }

      if (
        repair.prestadorId != tokenData.userId &&
        repair.usuarioId != tokenData.userId
      ) {
        throw new Unauthorized("Token não validado");
      }

      if (!repair.prestador) {
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
          },
        });
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
            nome: repair.prestador.nome ?? "",
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
