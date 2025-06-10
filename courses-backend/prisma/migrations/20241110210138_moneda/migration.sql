/*
  Warnings:

  - Made the column `fechaInicio` on table `Comision` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fechaFin` on table `Comision` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `moneda` to the `Pago` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comision" ALTER COLUMN "fechaInicio" SET NOT NULL,
ALTER COLUMN "fechaFin" SET NOT NULL;

-- AlterTable
ALTER TABLE "Pago" ADD COLUMN     "moneda" TEXT NOT NULL;
