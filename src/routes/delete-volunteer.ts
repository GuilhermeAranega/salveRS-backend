import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middleware/jwtAuth";
import { JWTPayload } from "./utils/jwt-payload";
import { BadRequest } from "./_errors/bad-request";
import { NotFound } from "./_errors/not-found";
import { Unauthorized } from "./_errors/unauthorized";

export async function deleteVolunteer(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/volunteers/:id",
    {
      schema: {
        summary: "Delete a volunteer",
        tags: ["volunteers"],
        params: z.object({
          id: z.string().cuid(),
        }),
      },
    },
    async (req, res) => {
      const data = (await verifyJWT(req, res)) as JWTPayload;
      const { id } = req.params;

      if (data.userId != id || !data.volunteer) {
        throw new Unauthorized("Token inválido");
      }

      const volunteer = await prisma.prestadores.findUnique({
        where: { id },
      });

      if (!volunteer) {
        throw new NotFound("Voluntário não encontrado");
      }

      await prisma.prestadores.delete({
        where: { id },
      });

      return res.status(204);
    }
  );
}
