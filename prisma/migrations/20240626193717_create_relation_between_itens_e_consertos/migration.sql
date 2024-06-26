-- AlterTable
ALTER TABLE "itens" ADD COLUMN     "consertosId" TEXT;

-- AddForeignKey
ALTER TABLE "itens" ADD CONSTRAINT "itens_consertosId_fkey" FOREIGN KEY ("consertosId") REFERENCES "consertos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
