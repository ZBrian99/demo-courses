/*
  Warnings:

  - The values [PREINSCRIPTO,INSCRIPTO,SUSPENDIDO,FINALIZADO,CANCELADO,OTRO] on the enum `EstadoInscripcion` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EstadoInscripcion_new" AS ENUM ('Pendiente', 'Parcial', 'Completo', 'Cancelado', 'Inactivo');
ALTER TABLE "Inscripcion" ALTER COLUMN "estado" DROP DEFAULT;
ALTER TABLE "Inscripcion" ALTER COLUMN "estado" TYPE "EstadoInscripcion_new" USING ("estado"::text::"EstadoInscripcion_new");
ALTER TYPE "EstadoInscripcion" RENAME TO "EstadoInscripcion_old";
ALTER TYPE "EstadoInscripcion_new" RENAME TO "EstadoInscripcion";
DROP TYPE "EstadoInscripcion_old";
ALTER TABLE "Inscripcion" ALTER COLUMN "estado" SET DEFAULT 'Pendiente';
COMMIT;

-- AlterTable
ALTER TABLE "Inscripcion" ADD COLUMN     "cantidadCuotas" TEXT,
ADD COLUMN     "totalAcordado" TEXT,
ALTER COLUMN "estado" SET DEFAULT 'Pendiente';

-- AlterTable
ALTER TABLE "Pago" ADD COLUMN     "cuentaPropia" BOOLEAN;
