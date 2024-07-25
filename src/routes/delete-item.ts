import { NotFound } from "./_errors/not-found";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middleware/jwtAuth";
import { JWTPayload } from "./utils/jwt-payload";
import { Unauthorized } from "./_errors/unauthorized";

export async function deleteItem(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/items/:id",
    {
      schema: {
        summary: "Delete an item",
        tags: ["items"],
        params: z.object({
          id: z.string().cuid(),
        }),
      },
    },
    async (req, res) => {
      const { id } = req.params;
      const tokenData = (await verifyJWT(req, res)) as JWTPayload;

      const item = await prisma.itens.findUnique({
        where: { id },
        select: {
          conserto: true,
        },
      });

      if (!item) {
        throw new NotFound("Item não encontrado");
      }

      if (item.conserto?.usuarioId != tokenData.userId) {
        throw new Unauthorized("Token não validado");
      }

      await prisma.itens.delete({
        where: { id },
      });

      return res.status(204);
    }
  );
}
