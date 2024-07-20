/*
  Warnings:

  - You are about to alter the column `documento` on the `usuarios` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(14)`.

*/
-- AlterTable
ALTER TABLE "usuarios" ALTER COLUMN "documento" SET DATA TYPE VARCHAR(14);
