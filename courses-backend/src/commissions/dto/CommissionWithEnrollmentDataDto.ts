export interface CommissionWithEnrollmentDataDto {
  id: string;
  codigoComision: string;
  fechaInicio: string;
  fechaFin: string;
  // fechaInicio: Date | string;
  // fechaFin: Date | string;
  estado: string;
  totalInscripciones: number;
  cantidadPreinscritos: number;
  cantidadInscritos: number;
  curso: {
    id: string;
    nombre: string;
    codigo: string;
  };
  formulario?: {
    id: string;
    title: string;
    nombre: string;
  };
  linkReferido?: string;
}
