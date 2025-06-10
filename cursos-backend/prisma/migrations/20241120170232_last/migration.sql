-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TipoPregunta" ADD VALUE 'FECHA';
ALTER TYPE "TipoPregunta" ADD VALUE 'DESPLEGABLE';
ALTER TYPE "TipoPregunta" ADD VALUE 'DESPLEGABLE_MULTIPLE';

-- AlterTable
ALTER TABLE "Horario" ADD COLUMN     "repeatsWeekly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" TEXT;

-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "comisionId" TEXT NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_comisionId_fkey" FOREIGN KEY ("comisionId") REFERENCES "Comision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
