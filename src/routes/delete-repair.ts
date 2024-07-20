import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middleware/jwtAuth";
import { JWTPayload } from "./utils/jwt-payload";

export async function deleteRepair(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/repairs/:id",
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

      const repair = await prisma.consertos.findUnique({
        where: { id },
      });

      if (!repair) {
        throw new Error("Conserto não encontrado");
      }

      if (tokenData.userId != repair.usuarioId) {
        throw new Error("Token não validado");
      }

      await prisma.consertos.delete({
        where: { id },
      });

      return res.status(204);
    }
  );
}
