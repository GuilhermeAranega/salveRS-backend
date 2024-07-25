import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middleware/jwtAuth";
import { JWTPayload } from "./utils/jwt-payload";

export async function deleteVolunteer(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/volunteers/:id",
    {
      schema: {
        params: z.object({
          id: z.string().cuid(),
        }),
      },
    },
    async (req, res) => {
      const data = (await verifyJWT(req, res)) as JWTPayload;
      const { id } = req.params;

      if (data.userId != id || !data.volunteer) {
        throw new Error("Token inválido");
      }

      const volunteer = await prisma.prestadores.findUnique({
        where: { id },
      });

      if (!volunteer) {
        throw new Error("Voluntário não encontrado");
      }

      await prisma.prestadores.delete({
        where: { id },
      });

      return res.status(204);
    }
  );
}
