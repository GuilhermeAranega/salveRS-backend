import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middleware/jwtAuth";
import { NotFound } from "./_errors/not-found";

export async function getAllPendingRepairs(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/repairs/pending",
    {
      schema: {
        summary: "Get all repairs that are pending",
        tags: ["repairs"],
        querystring: z.object({
          pageIndex: z.string().nullish().default("0").transform(Number),
        }),
        response: {
          200: z.object({
            message: z.string(),
            repairs: z
              .object({
                id: z.string().cuid(),
                observacao: z.string().nullable(),
                status: z.string(),
                data: z.date(),
                prestadorId: z.string().cuid().nullable(),
                usuarioId: z.string().cuid(),
                usuario: z.object({
                  nome: z.string(),
                  tipo: z.string(),
                }),
                prestador: z
                  .object({
                    nome: z.string(),
                    tipo: z.string(),
                  })
                  .nullable(),
              })
              .array(),
            total: z.number(),
          }),
        },
      },
      onRequest: [verifyJWT],
    },
    async (req, res) => {
      const { pageIndex } = req.query;

      const [repairs, total] = await Promise.all([
        prisma.consertos.findMany({
          where: { prestador: null },
          select: {
            id: true,
            observacao: true,
            status: true,
            data: true,
            usuarioId: true,
            prestadorId: true,
            usuario: {
              select: {
                nome: true,
                tipo: true,
              },
            },
            prestador: {
              select: {
                nome: true,
                tipo: true,
              },
            },
          },
          take: 10,
          skip: pageIndex * 10,
        }),
        prisma.consertos.count({
          where: { prestador: null },
        }),
      ]);

      if (repairs.length === 0) {
        throw new NotFound("Consertos não encontrados");
      }

      return res.status(201).send({
        message: "Consertos encontrados com sucesso",
        repairs,
        total,
      });
    }
  );
}
