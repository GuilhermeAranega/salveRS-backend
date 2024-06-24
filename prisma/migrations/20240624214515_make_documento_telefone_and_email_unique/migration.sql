/*
  Warnings:

  - A unique constraint covering the columns `[documento]` on the table `prestadores` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[telefone]` on the table `prestadores` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `prestadores` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[documento]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[telefone]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "prestadores_documento_key" ON "prestadores"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "prestadores_telefone_key" ON "prestadores"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "prestadores_email_key" ON "prestadores"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_documento_key" ON "usuarios"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_telefone_key" ON "usuarios"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
