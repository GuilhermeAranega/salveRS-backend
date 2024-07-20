-- CreateEnum
CREATE TYPE "Status" AS ENUM ('recebido', 'consertando', 'pronto');

-- AlterTable
ALTER TABLE "consertos" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'recebido';
