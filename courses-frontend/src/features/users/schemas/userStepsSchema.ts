import { z } from 'zod';
import { Role } from '../types/types';

// Campos para cada paso
export const step1Fields = ['nombre', 'apellido', 'fechaNacimiento', 'tipoDni', 'dni', 'password', 'confirmPassword'] as const;
export const step2Fields = ['email', 'telefono', 'pais', 'provincia', 'ciudad'] as const;
export const step3Fields = ['profesion', 'resume', 'rol'] as const;

export const allFields = [...step1Fields, ...step2Fields, ...step3Fields] as const;

export type FieldNames = typeof allFields[number];

// Schema base para el paso 1 (Información Personal)
const personalInfoSchemaBase = {
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  fechaNacimiento: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
  tipoDni: z.string().min(1, 'El tipo de documento es obligatorio'),
  dni: z.string().min(1, 'El número de documento es obligatorio'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
    // .regex(/[A-Z]/, 'La contraseña debe tener al menos una letra mayúscula')
    // .regex(/[a-z]/, 'La contraseña debe tener al menos una letra minúscula')
    // .regex(/\d/, 'La contraseña debe tener al menos un número'),
  confirmPassword: z.string().min(1, 'La confirmación de contraseña es obligatoria')
};

// Schema base para el paso 2 (Información de Contacto)
const contactInfoSchemaBase = {
  email: z.string().email('Ingrese un correo electrónico válido'),
  telefono: z.string().min(1, 'El teléfono es obligatorio'),
  pais: z.string().min(1, 'El país es obligatorio'),
  provincia: z.string().min(1, 'La provincia es obligatoria'),
  ciudad: z.string().min(1, 'La ciudad es obligatoria')
};

// Schema base para el paso 3 (Información Profesional)
const professionalInfoSchemaBase = {
  profesion: z.string().optional(),
  resume: z.string().optional(),
  rol: z.nativeEnum(Role, {
    errorMap: () => ({ message: 'Debe seleccionar un rol válido' })
  })
};

// Schemas individuales para cada paso
export const personalInfoSchema = z.object(personalInfoSchemaBase)
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  });

export const contactInfoSchema = z.object(contactInfoSchemaBase);

export const professionalInfoSchema = z.object(professionalInfoSchemaBase);

// Schema completo del usuario
export const userSchema = z.object({
  ...personalInfoSchemaBase,
  ...contactInfoSchemaBase,
  ...professionalInfoSchemaBase
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

export type UserFormData = z.infer<typeof userSchema>; 