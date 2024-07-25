import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { sendEmail } from "./utils/send-email";
import { NotFound } from "./_errors/not-found";

export async function requestVolunteerPasswordReset(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/volunteers/reset",
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

      const volunteer = await prisma.prestadores.findUnique({
        where: { email },
      });

      if (!volunteer) {
        throw new NotFound("Email não cadastrado");
      }

      const token = await res.jwtSign(
        {
          email: email,
          userId: volunteer.id,
          pwdRestore: true,
        },
        {
          sign: { expiresIn: "10m", key: volunteer.id + volunteer.senha },
        }
      );

      const existingToken = await prisma.links.findUnique({
        where: { userId: volunteer.id },
      });

      if (existingToken) {
        await prisma.links.delete({
          where: { userId: volunteer.id },
        });
      }

      await prisma.links.create({
        data: {
          userId: volunteer.id,
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
