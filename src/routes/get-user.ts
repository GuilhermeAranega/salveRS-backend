import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middleware/jwtAuth";

interface JWTPayload {
  userId: string;
  tipo: string;
  email: string;
}

export async function getUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/users",
    {
      schema: {
        response: {
          200: z.object({
            message: z.string(),
            user: z.object({
              nome: z.string().min(3),
              telefone: z.string().length(11),
              email: z.string().email(),
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

      const user = await prisma.usuarios.findUnique({
        where: { id: data.userId },
        select: {
          nome: true,
          email: true,
          telefone: true,
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

      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      return res.status(200).send({
        message: "Usuário encontrado",
        user: {
          nome: user.nome,
          telefone: user.telefone,
          email: user.email,
          idade: user.idade,
          tipo: user.tipo,
          endereco: {
            cep: user.cep,
            rua: user.rua,
            numero: user.numero,
            complemento: user.complemento,
            bairro: user.bairro,
            cidade: user.cidade,
          },
        },
      });
    }
  );
}
