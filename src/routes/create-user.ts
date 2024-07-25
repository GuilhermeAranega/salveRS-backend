import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { cpf, cnpj } from "cpf-cnpj-validator";
import { hashData } from "./utils/hash-data";
import { BadRequest } from "./_errors/bad-request";

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/users",
    {
      schema: {
        summary: "Create an user",
        tags: ["users"],
        body: z.object({
          nome: z.string().min(3),
          documento: z.string().min(11),
          telefone: z.string().length(11),
          email: z.string().email(),
          idade: z.number().int().positive().min(16).max(100),
          senha: z.string().min(8),
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
        response: {
          201: z.object({
            message: z.string(),
            userId: z.string().cuid(),
          }),
        },
      },
    },
    async (req, res) => {
      const data = req.body;

      if (data.tipo == "pessoa_fisica") {
        if (!cpf.isValid(data.documento)) {
          throw new BadRequest("Número de CPF inválido");
        }
      } else {
        if (!cnpj.isValid(data.documento)) {
          throw new BadRequest("Número de CNPJ inválido");
        }
      }

      const [existingEmail, existingPhone, existingDocument] =
        await Promise.all([
          prisma.usuarios.findUnique({
            where: { email: data.email },
          }),
          prisma.usuarios.findUnique({
            where: { telefone: data.telefone },
          }),
          prisma.usuarios.findUnique({
            where: { documento: data.documento },
          }),
        ]);

      if (existingEmail || existingPhone || existingDocument) {
        throw new BadRequest(
          "Já existe um outro usuário com esse email, telefone ou documento"
        );
      }

      const hashedSenha = await hashData(data.senha);

      const user = await prisma.usuarios.create({
        data: {
          nome: data.nome,
          documento: data.documento,
          telefone: data.telefone,
          email: data.email,
          idade: data.idade,
          senha: hashedSenha,
          tipo: data.tipo,
          cep: data.endereco.cep,
          rua: data.endereco.rua,
          numero: data.endereco.numero,
          complemento: data.endereco.complemento,
          bairro: data.endereco.bairro,
          cidade: data.endereco.cidade,
        },
      });

      return res.status(201).send({
        message: "Usuário criado com sucesso",
        userId: user.id,
      });
    }
  );
}
