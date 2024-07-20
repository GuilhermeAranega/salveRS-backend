/*
  Warnings:

  - You are about to drop the column `usuariosId` on the `consertos` table. All the data in the column will be lost.
  - Added the required column `usuarioId` to the `consertos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "consertos" DROP CONSTRAINT "consertos_usuariosId_fkey";

-- AlterTable
ALTER TABLE "consertos" DROP COLUMN "usuariosId",
ADD COLUMN     "usuarioId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "consertos" ADD CONSTRAINT "consertos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
