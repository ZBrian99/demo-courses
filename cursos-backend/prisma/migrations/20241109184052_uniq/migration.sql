/*
  Warnings:

  - A unique constraint covering the columns `[codigoComision]` on the table `Comision` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo]` on the table `Curso` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `Formulario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Formulario" ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "nombre" TEXT;

-- AlterTable
ALTER TABLE "Inscripcion" ADD COLUMN     "observaciones" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Comision_codigoComision_key" ON "Comision"("codigoComision");

-- CreateIndex
CREATE UNIQUE INDEX "Curso_codigo_key" ON "Curso"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Formulario_nombre_key" ON "Formulario"("nombre");
