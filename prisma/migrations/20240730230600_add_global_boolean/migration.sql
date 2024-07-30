-- AlterTable
ALTER TABLE "notificacoes" ADD COLUMN     "global" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "user_id" DROP NOT NULL;
