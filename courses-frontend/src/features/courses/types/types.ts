import { Dayjs } from 'dayjs';

export interface Filters {
	curso: string;
	estado: string;
	modalidad: string;
	profesor: string;
	fechaInicio: Dayjs | null;
	fechaFin: Dayjs | null;
}

export interface FiltersProps {
	filters: Filters;

	handleFilterChange: (field: string, value: string | Dayjs | null) => void;
	clearFilters: () => void;
	applyFilters: () => void;
}

export interface PaginatedResponse<T> {
	items: T[];
	totalItems: number;
	currentPage: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	itemsPerPage: number;
}

export interface CoursesResponse extends PaginatedResponse<Course> {}

export interface CoursesListProps {
	filters: Filters;
	openModal: (id: string) => void;
	setCourseId: (id: string) => void;
	courses: Course[];
}

export interface IFormInput {
	codigo: string;
	nombre: string;
	imagenPortada?: string;
	descripcion: string;
}

// types/types.ts

// Tipo para los datos del curso
export interface createCourseData {
	id?: string;
	codigo: string;
	nombre: string;
	descripcion?: string;
	cursosRequeridos?: string[];
	horas?: number;
	isActive?: boolean;
	imagenPortada?: string;
}

export interface updateCourseData {
	id?: string;
	codigo?: string;
	nombre?: string;
	descripcion?: string;
	cursosRequeridos?: string[];
	horas?: number;
	isActive?: boolean;
	imagenPortada?: string;
	modalidad?: string;
	clases?: number;
	comisiones?: string[];
	estado?: string;
	profesor?: string;
	inicio?: string;
	fin?: string;
}

export interface Course {
	id: string;
	codigo: string;
	nombre: string;
	descripcion?: string;
	modalidad?: string;
	clases?: number;
	horas?: number;
	cursosRequeridos?: RequiredCourse[];
	comisiones?: string[];
	isActive?: boolean;
	imagenPortada?: string;
	estado?: string;
	profesor?: string;
	inicio?: string;
	fin?: string;
}

// Tipo para los cursos requeridos
export interface RequiredCourse {
	id: string;
	codigo?: string;
	nombre?: string;
}

// Tipo para los filtros del listado de cursos
export interface CourseFilters {
	curso?: string;
	estado?: string;
	modalidad?: string;
	profesor?: string;
	fechaInicio?: string;
	fechaFin?: string;
}

// Tipo para el estado del slice de cursos
export interface CoursesState {
	courses: Course[];
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
}

// export interface CommissionData {
// 	id: string;
// 	codigoComision?: string;
// 	fechaInicio?: string;
// 	fechaFin?: string;
// 	clases?: string;
// 	modalidad?: string;
// 	pais?: string;
// 	provincia?: string;
// 	ubicacion?: string;
// 	cupo?: string;
// 	estado: string; // Añadido para representar el estado de la comisión
// 	classroomLinks?: string[];
// 	whatsappLinks?: string[];
// 	infoLinks?: string[];
// 	isActive?: boolean;
// 	curso: {
// 		id: string;
// 		nombre: string;
// 		codigo: string;
// 	};
// 	horarios?: {
// 		day: string;
// 		startTime: string;
// 		endTime: string;
// 	}[];
// 	profesores?: {
// 		profesor: {
// 			id: string;
// 			usuario: {
// 				nombre: string;
// 				apellido: string | null;
// 				email: string;
// 			};
// 		};
// 	}[];
// }
