import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { compareHashedData } from "./utils/compare-hashed-data";
import { BadRequest } from "./_errors/bad-request";

export async function authenticateVolunteer(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/volunteers/authenticate",
    {
      schema: {
        summary: "Authenticate a volunteer",
        tags: ["volunteers"],
        body: z.object({
          email: z.string().email(),
          senha: z.string().min(8),
          tipo: z.enum(["empresa", "pessoa_fisica"]),
        }),
        response: {
          200: z.object({
            message: z.string(),
            token: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      const data = req.body;

      const volunteer = await prisma.prestadores.findUnique({
        where: { email: data.email },
      });

      if (!volunteer) {
        throw new BadRequest("Email não cadastrado ou senha inválida");
      }

      if (!(await compareHashedData(volunteer.senha, data.senha))) {
        throw new BadRequest("Email não cadastrado ou senha inválida");
      }

      const token = await res.jwtSign({
        userId: volunteer.id,
        tipo: data.tipo,
        email: data.email,
        volunteer: true,
      });

      return res.status(200).header("authorization", token).send({
        message: "Autenticado com sucesso",
        token,
      });
    }
  );
}
