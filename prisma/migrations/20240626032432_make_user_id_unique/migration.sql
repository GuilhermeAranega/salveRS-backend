/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `links` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "links_user_id_key" ON "links"("user_id");
