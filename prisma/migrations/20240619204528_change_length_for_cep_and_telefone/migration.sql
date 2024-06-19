/*
  Warnings:

  - You are about to alter the column `telefone` on the `prestadores` table. The data in that column could be lost. The data in that column will be cast from `VarChar(14)` to `VarChar(11)`.
  - You are about to alter the column `cep` on the `prestadores` table. The data in that column could be lost. The data in that column will be cast from `VarChar(11)` to `VarChar(8)`.
  - You are about to alter the column `telefone` on the `usuarios` table. The data in that column could be lost. The data in that column will be cast from `VarChar(14)` to `VarChar(11)`.
  - You are about to alter the column `cep` on the `usuarios` table. The data in that column could be lost. The data in that column will be cast from `VarChar(11)` to `VarChar(8)`.

*/
-- AlterTable
ALTER TABLE "prestadores" ALTER COLUMN "telefone" SET DATA TYPE VARCHAR(11),
ALTER COLUMN "cep" SET DATA TYPE VARCHAR(8);

-- AlterTable
ALTER TABLE "usuarios" ALTER COLUMN "telefone" SET DATA TYPE VARCHAR(11),
ALTER COLUMN "cep" SET DATA TYPE VARCHAR(8);
