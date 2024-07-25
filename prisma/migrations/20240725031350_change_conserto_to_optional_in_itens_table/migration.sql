/*
  Warnings:

  - Added the required column `usuariosId` to the `itens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "itens" ADD COLUMN     "usuariosId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "itens" ADD CONSTRAINT "itens_usuariosId_fkey" FOREIGN KEY ("usuariosId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
