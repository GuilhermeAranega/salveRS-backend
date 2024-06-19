import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/users",
    {
      schema: {
        body: z.object({
          nome: z.string().min(3),
          documento: z.string().min(11),
          telefone: z.string().length(11),
          email: z.string().email(),
          idade: z.number().int(),
          senha: z.string(),
          tipo: z.enum(["empresa", "pessoa_fisica"]),
          endereco: z.object({
            cep: z.string().length(8),
            rua: z.string(),
            numero: z.number().int(),
            complemento: z.string(),
            bairro: z.string(),
            cidade: z.string(),
          }),
        }),
        response: {
          201: z.object({
            message: z.string(),
            userId: z.string().cuid(),
          }),
        },
      },
    },
    async (req, res) => {
      console.log("create-user");
    }
  );
}
