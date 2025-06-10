// src/features/enrollments/types/enrollmentTypes.ts

export interface User {
	id: string;
	nombre: string;
	apellido: string;
	email: string;
	telefono?: string; // Hacer opcional si no siempre está presente
	pais?: string; // Hacer opcional si no siempre está presente
	dni?: string; // Hacer opcional si no siempre está presente
}

export interface Alumno {
	usuario: User; // Relación directa con el usuario
}

export interface Vendedor {
	usuario: User; // Relación directa con el usuario
}

export interface Curso {
	id: string;
	codigo: string;
	nombre: string;
	descripcion: string;
	isActive: boolean;
}

export interface Comision {
	id: string;
	codigoComision: string;
	fechaInicio: string;
	fechaFin: string;
	modalidad: string;
	pais: string;
	provincia: string;
	ubicacion: string;
	cursoId: string;
	curso: Curso;
	isActive: boolean;
}
export interface PaymentFormData {
	monto: string;
	moneda: string;
	metodoPago: string;
	tipoPago: string;
	fechaPago: string;
	observaciones?: string;
	cuentaPropia: boolean;
}

export interface Payment {
	id: string;
	inscripcionId: string;
	vendedorId: string;
	monto: string;
	moneda: string;
	metodoPago: string;
	tipoPago: string;
	fechaPago: string;
	observaciones?: string;
	cuentaPropia: boolean;
}

export interface Enrollment {
	id: string;
	alumnoId?: string; // Hacer opcional si no siempre está presente
	comisionId?: string; // Hacer opcional si no siempre está presente
	vendedorId?: string; // Hacer opcional si no siempre está presente
	isActive?: boolean; // Hacer opcional si no siempre está presente
	estado: EnrollmentStatus;
	createdAt: string;
	updatedAt?: string; // Hacer opcional si no siempre está presente
	observaciones?: string | null; // Nuevo campo agregado
	alumno: Alumno; // Relación con el alumno
	comision?: Comision; // Hacer opcional si no siempre está presente
	vendedor: Vendedor; // Relación con el vendedor
	pagos?: Payment[]; // Hacer opcional si no siempre está presente
	totalAcordado: string;
	cantidadCuotas: string;
}

export interface EnrollmentsFiltersProps {
	onFilterChange: (filters: EnrollmentsFiltersQuery) => void;
}

export interface EnrollmentsListProps {
	enrollments?: Enrollment[];
}

export interface EnrollmentsFiltersQuery {
	fechaInicio?: string;
	fechaFin?: string;
	search?: string;
	vendedorId?: string;
	alumnoId?: string;
	comisionId?: string;
	page?: number;
	limit?: number;
	status?: EnrollmentStatus;
}

// enums/enrollment-status.enum.ts
// export enum EnrollmentStatus {
// 	PREINSCRIPTO = 'PREINSCRIPTO',
// 	INSCRIPTO = 'INSCRIPTO',
// }
export enum EnrollmentStatus {
	Pendiente = 'Pendiente',
	Parcial = 'Parcial',
	Completo = 'Completo',
	Cancelado = 'Cancelado',
	Inactivo = 'Inactivo',
}

export interface PaginatedEnrollmentsResponse {
	items: Enrollment[]; // La lista de inscripciones
	totalItems: number; // Número total de inscripciones en la base de datos que coinciden con el filtro
	currentPage: number; // Página actual
	totalPages: number; // Número total de páginas
	hasNextPage: boolean; // Indica si hay una siguiente página
	hasPreviousPage: boolean; // Indica si hay una página anterior
}
export interface PaginatedCommissionEnrollmentsResponse {
	items: CommissionWithEnrollmentData[]; // Lista de comisiones con datos de inscripción
	totalItems: number; // Número total de elementos
	currentPage: number; // Página actual
	totalPages: number; // Número total de páginas
	hasNextPage: boolean; // Indica si hay una siguiente página
	hasPreviousPage: boolean; // Indica si hay una página anterior
}

export interface CommissionWithEnrollmentData {
	id: string;
	codigoComision: string;
	fechaInicio: string | null;
	fechaFin: string | null;
	clases: string | null;
	modalidad: string | null;
	pais: string | null;
	provincia: string | null;
	ubicacion: string | null;
	formularioId: string | null;
	cupo: string | null;
	classroomLinks: string[];
	whatsappLinks: string[];
	infoLinks: string[];
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	cursoId: string;
	curso: CursoData;
	formulario: FormularioData | null;
	totalInscripciones: number;
	cantidadPreinscritos: number;
	cantidadInscritos: number;
	estado: string;
	linkReferido: string;
}

export interface CursoData {
	id: string;
	nombre: string;
	codigo: string;
}

export interface FormularioData {
	id: string;
	title: string;
	nombre: string | null;
}

export interface CommissionsFiltersQuery {
	fechaInicio?: string; // Fecha de inicio para filtrar comisiones
	fechaFin?: string; // Fecha de fin para filtrar comisiones
	search?: string; // Búsqueda por texto que puede coincidir con el nombre del curso, código de la comisión, etc.
	cursoId?: string; // ID del curso asociado a la comisión
	page?: number; // Página actual para la paginación
	limit?: number; // Límite de elementos por página
	status?: CommissionStatus; // Estado de la comisión
	isActive?: boolean; // Estado activo de la comisión
}

export interface CommissionStatus {
	Próxima: string;
	'En curso': string;
	Finalizada: string;
}

export interface EnrollmentDetailsProps {
	enrollment: Enrollment;
}

// src/features/enrollments/types/enrollmentsTypes.ts

export interface RespuestaSeleccionada {
	id: string;
	text: string;
}

export interface Respuesta {
	textValue: string | null;
	opcionesSeleccionadas: RespuestaSeleccionada[];
}

export interface Opcion {
	id: string;
	text: string;
	order: number;
}

export interface Pregunta {
	id: string;
	text: string;
	type: 'TEXTO_CORTO' | 'TEXTO_LARGO' | 'SELECCION' | 'CHECKBOX';
	isRequired: boolean;
	order: number;
	respuesta: Respuesta;
	opciones: Opcion[];
}

export interface Etapa {
	id: string;
	title: string;
	order: number;
	preguntas: Pregunta[];
}

export type RespuestasPorInscripcion = Etapa[];

export interface Observation {
	id: string;
	observaciones?: string;
	totalAcordado: string;
	cantidadCuotas?: string;
	createdAt: string;
}

export interface AddObservation {
	observaciones: string;
	totalAcordado: string;
	cantidadCuotas: string;
}

// Tipos para las acciones del menú
export interface MenuState {
	anchorEl: HTMLElement | null;
	selectedId: string | null;
}

export type MenuAction = 
	| { type: 'open'; payload: { anchorEl: HTMLElement; id: string } }
	| { type: 'close' };

// Tipos para los modales
export interface ObservationFormData {
	observaciones: string;
	totalAcordado: string;
	cantidadCuotas: string;
}

export interface EnrollmentActionMenuProps {
	anchorEl: HTMLElement | null;
	onClose: () => void;
	onViewDetails: () => void;
	onAddObservation: (data: AddObservation) => void;
	onAddPayment: (paymentData: PaymentFormData) => void;
	onStatusChange: (status: EnrollmentStatus) => void;
	enrollment: Enrollment | null;
}

// Interfaces para las mutaciones
export interface PaymentMutationData extends PaymentFormData {
	enrollmentId: string;
}

export interface ObservationMutationData extends AddObservation {
	enrollmentId: string;
}

export interface ExcelGenerationData {
	comisionId: string;
	fechaInicio: string;
	fechaFin?: string;
	fileName?: string;
}

export interface ExcelGenerationResponse {
	success: boolean;
	message: string;
	fileName?: string;
}
