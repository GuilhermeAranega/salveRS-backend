/*
  Warnings:

  - Made the column `consertosId` on table `itens` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "itens" DROP CONSTRAINT "itens_consertosId_fkey";

-- AlterTable
ALTER TABLE "itens" ALTER COLUMN "consertosId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "itens" ADD CONSTRAINT "itens_consertosId_fkey" FOREIGN KEY ("consertosId") REFERENCES "consertos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
