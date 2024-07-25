import { NotFound } from "./_errors/not-found";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middleware/jwtAuth";
import { JWTPayload } from "./utils/jwt-payload";

export async function getVolunteer(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/volunteers",
    {
      schema: {
        response: {
          200: z.object({
            message: z.string(),
            volunteer: z.object({
              id: z.string().cuid(),
              nome: z.string().min(3),
              telefone: z.string().length(11),
              email: z.string().email(),
              documento: z.string(),
              idade: z.number().int().positive().max(100),
              tipo: z.enum(["empresa", "pessoa_fisica"]),
              endereco: z.object({
                cep: z.string().length(8),
                rua: z.string(),
                numero: z.number().int().positive().max(1000),
                complemento: z.string(),
                bairro: z.string(),
                cidade: z.string(),
              }),
            }),
          }),
        },
      },
    },
    async (req, res) => {
      const data = (await verifyJWT(req, res)) as JWTPayload;

      const volunteer = await prisma.prestadores.findUnique({
        where: { id: data.userId },
        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
          documento: true,
          idade: true,
          tipo: true,
          conserto: true,
          cep: true,
          rua: true,
          numero: true,
          complemento: true,
          bairro: true,
          cidade: true,
        },
      });

      if (!volunteer) {
        throw new NotFound("Voluntário não encontrado");
      }

      return res.status(200).send({
        message: "Voluntário encontrado",
        volunteer: {
          id: volunteer.id,
          nome: volunteer.nome,
          telefone: volunteer.telefone,
          email: volunteer.email,
          documento: volunteer.documento,
          idade: volunteer.idade,
          tipo: volunteer.tipo,
          endereco: {
            cep: volunteer.cep,
            rua: volunteer.rua,
            numero: volunteer.numero,
            complemento: volunteer.complemento,
            bairro: volunteer.bairro,
            cidade: volunteer.cidade,
          },
        },
      });
    }
  );
}
