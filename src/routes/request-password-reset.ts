import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { sendEmail } from "./utils/send-email";

export async function requestPasswordReset(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/users/reset",
    {
      schema: {
        body: z.object({
          email: z.string().email(),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      const { email } = req.body;

      const user = await prisma.usuarios.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error("Email não cadastrado");
      }

      const token = await res.jwtSign(
        {
          email: email,
          userId: user.id,
          pwdRestore: true,
        },
        {
          sign: { expiresIn: "10m", key: user.id + user.senha },
        }
      );

      const existingToken = await prisma.links.findUnique({
        where: { userId: user.id },
      });

      if (existingToken) {
        await prisma.links.delete({
          where: { userId: user.id },
        });
      }

      await prisma.links.create({
        data: {
          userId: user.id,
          token,
        },
      });

      /* const data = await sendEmail(email, token);
      
      if (!data) {
        throw new Error("Não foi possível enviar o email");
      } */

      console.log(token);
      return res.status(200).send({ message: "Email mandado com sucesso" });
    }
  );
}
