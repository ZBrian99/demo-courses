import { z } from 'zod';
import { Role } from '../types/types';

// Schema para edición de usuario (sin password)
export const userEditSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  fechaNacimiento: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
  dni: z.string().min(1, 'El DNI es obligatorio'),
  tipoDni: z.string().min(1, 'El tipo de documento es obligatorio'),
  email: z.string().email('Ingrese un email válido'),
  telefono: z.string().optional(),
  pais: z.string().optional(),
  provincia: z.string().optional(),
  ciudad: z.string().optional(),
  profesion: z.union([z.string(), z.null()]).optional(),
  resume: z.union([z.string(), z.null()]).optional(),
  rol: z.nativeEnum(Role, {
    errorMap: () => ({ message: 'Seleccione un rol válido' }),
  }),
});

export type UserEditFormData = z.infer<typeof userEditSchema>; 