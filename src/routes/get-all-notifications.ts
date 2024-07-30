import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middleware/jwtAuth";
import { NotFound } from "./_errors/not-found";
import { JWTPayload } from "./utils/jwt-payload";
import { create } from "domain";

export async function getAllNotifications(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/notifications",
    {
      schema: {
        response: {
          200: z.object({
            message: z.string(),
            notifications: z
              .object({
                message: z.string(),
                createdAt: z.date(),
              })
              .array(),
          }),
        },
      },
    },
    async (req, res) => {
      const tokenData = (await verifyJWT(req, res)) as JWTPayload;

      const notifications = await prisma.notificacoes.findMany({
        where: tokenData.volunteer
          ? { global: true }
          : { userId: tokenData.userId },
        select: {
          message: true,
          createdAt: true,
        },
      });

      if (notifications.length === 0) {
        throw new NotFound("Notificações não encontradas");
      }

      return res.status(201).send({
        message: "Notificações encontradas",
        notifications,
      });
    }
  );
}
