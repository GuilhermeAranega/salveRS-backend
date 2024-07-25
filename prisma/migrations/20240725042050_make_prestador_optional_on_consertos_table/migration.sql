-- DropForeignKey
ALTER TABLE "consertos" DROP CONSTRAINT "consertos_prestadorId_fkey";

-- AlterTable
ALTER TABLE "consertos" ALTER COLUMN "prestadorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "consertos" ADD CONSTRAINT "consertos_prestadorId_fkey" FOREIGN KEY ("prestadorId") REFERENCES "prestadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
