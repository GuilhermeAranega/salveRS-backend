-- DropForeignKey
ALTER TABLE "itens" DROP CONSTRAINT "itens_consertosId_fkey";

-- AlterTable
ALTER TABLE "itens" ALTER COLUMN "consertosId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "itens" ADD CONSTRAINT "itens_consertosId_fkey" FOREIGN KEY ("consertosId") REFERENCES "consertos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
