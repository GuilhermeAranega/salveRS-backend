import { prisma } from "../src/lib/prisma";
import { faker } from "@faker-js/faker";
import { hashData } from "../src/routes/utils/hash-data";

async function seed() {
  const userId = "clz1xebvd000008lc9ary6514";
  const userEmail = "email@example.com";
  const userPassword = "senha123456";

  const repairId = "clz1y2p91000008jt1ubh6yil";

  const volunteerId = "clz1y6cef000008jv6ebqa5el";
  const volunteerEmail = "email@example.com";
  const volunteerPassword = "senha123456";

  const itemId = "clz1ycgx8000108jv9r685tda";

  await prisma.itens.deleteMany();
  await prisma.consertos.deleteMany();
  await prisma.usuarios.deleteMany();
  await prisma.prestadores.deleteMany();
  await prisma.links.deleteMany();

  await prisma.usuarios.create({
    data: {
      id: userId,
      nome: faker.person.fullName(),
      documento: "17797725055",
      telefone: "12345678901",
      email: userEmail,
      idade: 20,
      senha: await hashData(userPassword),
      tipo: "pessoa_fisica",
      cep: "12224300",
      rua: "Rodovia Presidente Dutra",
      numero: 170,
      complemento: "apto. xx",
      bairro: "Jardim Motorama",
      cidade: "São José dos Campos",
      conserto: {
        create: {
          id: repairId,
          observacao: "obsevação",
          prestador: {
            create: {
              id: volunteerId,
              nome: faker.person.fullName(),
              documento: "13232688047",
              telefone: "09876543210",
              email: volunteerEmail,
              idade: 20,
              senha: await hashData(volunteerPassword),
              tipo: "pessoa_fisica",
              cep: "12224300",
              rua: "Rodovia Presidente Dutra",
              numero: 170,
              complemento: "apto. xx",
              bairro: "Jardim Motorama",
              cidade: "São José dos Campos",
            },
          },
        },
      },
      Itens: {
        create: {
          id: itemId,
          descricao: "Computador",
          quantidade: 1,
        },
      },
    },
  });
}

seed().then(() => {
  console.log("Database seed complete");
  prisma.$disconnect();
});
