/*
  Warnings:

  - A unique constraint covering the columns `[comisionId]` on the table `Formulario` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[telefono]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Comision" DROP CONSTRAINT "Comision_formularioId_fkey";

-- AlterTable
ALTER TABLE "Formulario" ADD COLUMN     "comisionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Formulario_comisionId_key" ON "Formulario"("comisionId");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_telefono_key" ON "Usuario"("telefono");

-- AddForeignKey
ALTER TABLE "Comision" ADD CONSTRAINT "Comision_formularioId_fkey" FOREIGN KEY ("formularioId") REFERENCES "Formulario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
