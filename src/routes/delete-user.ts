import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middleware/jwtAuth";
import { JWTPayload } from "./utils/jwt-payload";

export async function deleteUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/users/:id",
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

      if (data.userId != id) {
        throw new Error("Token inválido");
      }

      const user = await prisma.usuarios.findUnique({
        where: { id },
      });

      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      await prisma.usuarios.delete({
        where: { id },
      });

      return res.status(204);
    }
  );
}
