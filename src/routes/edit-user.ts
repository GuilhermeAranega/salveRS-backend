import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { verifyJWT } from "../middleware/jwtAuth";
import { JWTPayload } from "./utils/jwt-payload";

export async function editUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    "/users",
    {
      schema: {
        body: z.object({
          nome: z.string().min(3),
          telefone: z.string().length(11).optional(),
          email: z.string().email().optional(),
          endereco: z
            .object({
              cep: z.string().length(8).optional(),
              rua: z.string().optional(),
              numero: z.number().int().positive().max(1000).optional(),
              complemento: z.string().optional(),
              bairro: z.string().optional(),
              cidade: z.string().optional(),
            })
            .optional(),
        }),
        response: {
          200: z.object({
            message: z.string(),
            updatedUser: z.object({
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
      const data = req.body;
      const tokenData = (await verifyJWT(req, res)) as JWTPayload;

      const existingUser = await prisma.usuarios.findUnique({
        where: { id: tokenData.userId },
      });

      if (!existingUser) {
        throw new Error("Esse usuário não existe");
      }

      const updatedUser = await prisma.usuarios.update({
        where: {
          id: tokenData.userId,
        },
        data,
        select: {
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

      return res.status(200).send({
        message: "Usuário atualizado com sucesso",
        updatedUser: {
          nome: updatedUser.nome,
          telefone: updatedUser.telefone,
          email: updatedUser.email,
          documento: updatedUser.documento,
          idade: updatedUser.idade,
          tipo: updatedUser.tipo,
          endereco: {
            cep: updatedUser.cep,
            rua: updatedUser.rua,
            numero: updatedUser.numero,
            complemento: updatedUser.complemento,
            bairro: updatedUser.bairro,
            cidade: updatedUser.cidade,
          },
        },
      });
    }
  );
}
