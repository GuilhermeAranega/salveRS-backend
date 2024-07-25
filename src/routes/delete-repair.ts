import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middleware/jwtAuth";
import { JWTPayload } from "./utils/jwt-payload";
import { NotFound } from "./_errors/not-found";
import { BadRequest } from "./_errors/bad-request";
import { Unauthorized } from "./_errors/unauthorized";

export async function deleteRepair(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/repairs/:id",
    {
      schema: {
        summary: "Delete a repair",
        tags: ["repairs"],
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
        throw new NotFound("Conserto não encontrado");
      }

      if (tokenData.userId != repair.usuarioId) {
        throw new Unauthorized("Token não validado");
      }

      await prisma.consertos.delete({
        where: { id },
      });

      return res.status(204);
    }
  );
}
