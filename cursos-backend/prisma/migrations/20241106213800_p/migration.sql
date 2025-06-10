/*
  Warnings:

  - The values [PREINSCRITO,INSCRITO] on the enum `EstadoInscripcion` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EstadoInscripcion_new" AS ENUM ('PREINSCRIPTO', 'INSCRIPTO', 'SUSPENDIDO', 'FINALIZADO', 'CANCELADO', 'OTRO');
ALTER TABLE "Inscripcion" ALTER COLUMN "estado" DROP DEFAULT;
ALTER TABLE "Inscripcion" ALTER COLUMN "estado" TYPE "EstadoInscripcion_new" USING ("estado"::text::"EstadoInscripcion_new");
ALTER TYPE "EstadoInscripcion" RENAME TO "EstadoInscripcion_old";
ALTER TYPE "EstadoInscripcion_new" RENAME TO "EstadoInscripcion";
DROP TYPE "EstadoInscripcion_old";
ALTER TABLE "Inscripcion" ALTER COLUMN "estado" SET DEFAULT 'PREINSCRIPTO';
COMMIT;

-- AlterTable
ALTER TABLE "Inscripcion" ALTER COLUMN "estado" SET DEFAULT 'PREINSCRIPTO';
