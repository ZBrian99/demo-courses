import { z } from 'zod';

export const personalInfoSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  fechaNacimiento: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
  tipoDni: z.string().min(1, 'El tipo de documento es obligatorio'),
  dni: z.string().min(1, 'El número de documento es obligatorio')
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>; 