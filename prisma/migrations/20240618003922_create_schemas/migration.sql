-- CreateEnum
CREATE TYPE "Tipo" AS ENUM ('empresa', 'pessoa_fisica');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "documento" VARCHAR(14) NOT NULL,
    "telefone" VARCHAR(14) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "idade" INTEGER NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "cep" VARCHAR(11) NOT NULL,
    "rua" VARCHAR(255) NOT NULL,
    "numero" INTEGER NOT NULL,
    "complemento" VARCHAR(255) NOT NULL,
    "bairro" VARCHAR(255) NOT NULL,
    "cidade" VARCHAR(255) NOT NULL,
    "tipo" "Tipo" NOT NULL DEFAULT 'pessoa_fisica',

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prestadores" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "documento" VARCHAR(14) NOT NULL,
    "telefone" VARCHAR(14) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "idade" INTEGER NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "cep" VARCHAR(11) NOT NULL,
    "rua" VARCHAR(255) NOT NULL,
    "numero" INTEGER NOT NULL,
    "complemento" VARCHAR(255) NOT NULL,
    "bairro" VARCHAR(255) NOT NULL,
    "cidade" VARCHAR(255) NOT NULL,
    "tipo" "Tipo" NOT NULL DEFAULT 'pessoa_fisica',

    CONSTRAINT "prestadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consertos" (
    "id" TEXT NOT NULL,
    "prestadorId" TEXT NOT NULL,
    "usuariosId" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacao" TEXT NOT NULL,

    CONSTRAINT "consertos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "consertos" ADD CONSTRAINT "consertos_prestadorId_fkey" FOREIGN KEY ("prestadorId") REFERENCES "prestadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consertos" ADD CONSTRAINT "consertos_usuariosId_fkey" FOREIGN KEY ("usuariosId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
