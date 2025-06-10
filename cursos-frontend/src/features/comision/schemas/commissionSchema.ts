import { z } from 'zod';
import dayjs from 'dayjs';

// Schema para horarios
const horarioSchema = z.object({
  day: z.string().min(1, 'El día es requerido'),
  startTime: z.string().min(1, 'La hora de inicio es requerida'),
  endTime: z.string().min(1, 'La hora de fin es requerida'),
}).refine((data) => {
  if (!data.startTime || !data.endTime) return true;
  
  const start = dayjs(`2000-01-01 ${data.startTime}`);
  const end = dayjs(`2000-01-01 ${data.endTime}`);
  
  // Solo verificamos que la hora fin no sea anterior a la hora inicio
  return !end.isBefore(start);
}, {
  message: 'La hora de fin no puede ser anterior a la hora de inicio',
  path: ['endTime']
});

// Schema para profesores y vendedores
const userSchema = z.object({
  id: z.string().min(1, 'ID requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  apellido: z.string().nullable(),
  email: z.string().email('Email inválido'),
  dni: z.string().min(1, 'DNI requerido'),
});

// Schema para links
const linkSchema = z.object({
  titulo: z.string().min(1, 'El título del link es requerido'),
  url: z.string().min(1,'URL inválida'),
});

// Schema base de la comisión (sin refinements)
const baseCommissionSchema = z.object({
  // Step 1
  cursoId: z.string().min(1, 'Debe seleccionar un curso'),
  codigoComision: z.string().min(1, 'El código es requerido'),
  cupo: z.string().optional(),
  modalidad: z.string().min(1, 'Debe seleccionar una modalidad'),
  pais: z.string().min(1, 'El país es requerido'),
  provincia: z.string().optional(),
  ubicacion: z.string().optional(),
  fechaInicio: z.string().min(1, 'La fecha de inicio es requerida'),
  fechaFin: z.string().min(1, 'La fecha de fin es requerida'),
  horarios: z.array(horarioSchema),
  cargaHoraria: z.string()
    .min(1, 'La carga horaria es requerida')
    .refine((value) => {
      // Validar formato "2" o "2.5"
      const decimalFormat = /^\d+(\.\d+)?$/;
      // Validar formato "2:30"
      const timeFormat = /^\d+:[0-5][0-9]$/;
      
      return decimalFormat.test(value) || timeFormat.test(value);
    }, {
      message: 'Formatos válidos: 2 | 2.5 | 2:30'
    })
    .transform((value) => {
      // Convertir todos los formatos a formato "HH:mm"
      if (value.includes(':')) return value;
      
      const numValue = parseFloat(value);
      const hours = Math.floor(numValue);
      const minutes = Math.round((numValue - hours) * 60);
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }),

  // Step 2
  profesores: z.array(userSchema),
    // .min(1, 'Debe seleccionar al menos un profesor'),

  // Step 3
  vendedores: z.array(userSchema),
    // .min(1, 'Debe seleccionar al menos un vendedor'),

  // Step 4
  links: z.array(linkSchema).optional(),
});

// Definimos el tipo para las claves del schema
type SchemaKeys = keyof z.infer<typeof baseCommissionSchema>;

// Schema principal con refinements
export const commissionSchema = baseCommissionSchema.refine((data) => {
  if (!data.fechaInicio || !data.fechaFin) return true;
  const inicio = dayjs(data.fechaInicio);
  const fin = dayjs(data.fechaFin);
  return fin.isAfter(inicio);
}, {
  message: 'La fecha de fin debe ser posterior a la fecha de inicio',
  path: ['fechaFin']
});

// Definimos los campos como arrays tipados
export const step1Fields: SchemaKeys[] = [
  'cursoId',
  'codigoComision',
  'cupo',
  'modalidad',
  'pais',
  'provincia',
  'ubicacion',
  'fechaInicio',
  'fechaFin',
  'horarios',
  'cargaHoraria'
];

export const step2Fields: SchemaKeys[] = ['profesores'];
export const step3Fields: SchemaKeys[] = ['vendedores'];
export const step4Fields: SchemaKeys[] = ['links'];

// Definimos los campos para validación
export const allFields: SchemaKeys[] = [
  ...step1Fields,
  ...step2Fields,
  ...step3Fields,
  ...step4Fields
];

// Helper function para crear schemas parciales tipados
const createPartialSchema = (fields: SchemaKeys[]) => {
  const shape = fields.reduce((acc, key) => ({
    ...acc,
    [key]: baseCommissionSchema.shape[key]
  }), {});
  
  return z.object(shape);
};

// Creamos los schemas para cada paso usando el helper
export const step1Schema = createPartialSchema(step1Fields);
export const step2Schema = createPartialSchema(step2Fields);
export const step3Schema = createPartialSchema(step3Fields);
export const step4Schema = createPartialSchema(step4Fields);

// Types
export type CommissionSchema = z.infer<typeof commissionSchema>;
export type Step1Schema = z.infer<typeof step1Schema>;
export type Step2Schema = z.infer<typeof step2Schema>;
export type Step3Schema = z.infer<typeof step3Schema>;
export type Step4Schema = z.infer<typeof step4Schema>; 