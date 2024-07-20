import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middleware/jwtAuth";

export async function deleteItem(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/items/:id",
    {
      schema: {
        params: z.object({
          id: z.string().cuid(),
        }),
      },
    },
    async (req, res) => {
      const { id } = req.params;

      const tokenData = await verifyJWT;
      console.log(tokenData); // ! ver token pra validar se o item que vai ser excluido pertence ao usuario

      const item = await prisma.itens.findUnique({
        where: { id },
        select: {
          conserto: true,
        },
      });
      console.log(item);

      if (!item) {
        throw new Error("Item não encontrado");
      }

      await prisma.itens.delete({
        where: { id },
      });

      return res.status(204);
    }
  );
}
