import { JWTPayload } from "./utils/jwt-payload";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middleware/jwtAuth";
import { Unauthorized } from "./_errors/unauthorized";
import { NotFound } from "./_errors/not-found";

export async function getAllRepairs(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/repairs",
    {
      schema: {
        querystring: z.object({
          pageIndex: z.string().nullish().default("0").transform(Number),
        }),
        response: {
          200: z.object({
            message: z.string(),
            repairs: z
              .object({
                observacao: z.string().nullable(),
                status: z.string(),
                data: z.date(),
                prestadorId: z.string().cuid(),
                usuarioId: z.string().cuid(),
                usuario: z.object({
                  nome: z.string(),
                  tipo: z.string(),
                }),
                prestador: z.object({
                  nome: z.string(),
                  tipo: z.string(),
                }),
              })
              .array(),
            total: z.number(),
          }),
        },
      },
    },
    async (req, res) => {
      const { pageIndex } = req.query;
      const tokenData = (await verifyJWT(req, res)) as JWTPayload;

      const [repairs, total] = await Promise.all([
        prisma.consertos.findMany({
          where: tokenData.volunteer
            ? { prestadorId: tokenData.userId }
            : { usuarioId: tokenData.userId },
          select: {
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
          where: tokenData.volunteer
            ? { prestadorId: tokenData.userId }
            : { usuarioId: tokenData.userId },
        }),
      ]);

      if (
        repairs[0].usuarioId != tokenData.userId &&
        repairs[0].prestadorId != tokenData.userId
      ) {
        throw new Unauthorized("Token não validado");
      }

      if (!repairs) {
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
