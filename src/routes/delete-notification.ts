import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middleware/jwtAuth";
import { NotFound } from "./_errors/not-found";
import { JWTPayload } from "./utils/jwt-payload";
import { Unauthorized } from "./_errors/unauthorized";

export async function getAllNotifications(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/notifications/:id",
    {
      schema: {
        params: z.object({
          id: z.string().cuid(),
        }),
      },
    },
    async (req, res) => {
      const { id } = req.params;
      const tokenData = (await verifyJWT(req, res)) as JWTPayload;

      const notification = await prisma.notificacoes.findUnique({
        where: { id },
      });

      if (!notification) {
        throw new NotFound("Notificação não encontrada");
      }

      if (notification.userId != tokenData.userId) {
        throw new Unauthorized("Token não validado");
      }

      await prisma.notificacoes.delete({
        where: { id },
      });

      return res.status(204);
    }
  );
}
