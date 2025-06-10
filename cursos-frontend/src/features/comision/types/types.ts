import { Dayjs } from 'dayjs';
import { z } from 'zod';

export interface Filters {
	curso: string;
	estado: string; // Añadir estado como filtro si se quiere filtrar por el estado de la comisión
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

export interface CoursesListProps {
	filters: Filters;
}

export interface IFormInput {
	codigo: string;
	nombre: string;
	portada: FileList;
	descripcion: string;
}

// DateSelector Props
export interface DateSelectorProps {
	label: string; // Etiqueta del campo
	name: string; // Nombre del campo en el form
	control: any; // Control de react-hook-form
	minDate?: Dayjs | undefined; // Fecha mínima que se puede seleccionar
	maxDate?: Dayjs | undefined; // Fecha máxima que se puede seleccionar
}

// TimeSelector Props
export interface TimeSelectorProps {
	label: string; // Etiqueta del campo
	name: string; // Nombre del campo en el form
	control: any; // Control de react-hook-form
	minTime?: Dayjs | undefined; // Hora mínima que se puede seleccionar
	maxTime?: Dayjs | undefined; // Hora máxima que se puede seleccionar
	errorMessage?: string; // Mensaje de error si la hora de fin es anterior a la hora de inicio
}

// CreateCommissionData Interface
export interface CreateCommissionData {
	codigoComision?: string;
	fechaInicio?: string;
	fechaFin?: string;
	cargaHoraria: string;
	modalidad?: string;
	pais?: string;
	provincia?: string;
	ubicacion?: string;
	cupo?: string;
	cursoId: string;
	profesores?: string[];
	horarios?: {
		day: string;
		startTime: string;
		endTime: string;
	}[];
	links: Link[];
	isActive?: boolean;
}

// Actualizar la interfaz CommissionData
export interface Link {
	id?: string;
	titulo: string;
	url: string;
}

export interface CommissionData {
	id: string;
	codigoComision?: string;
	fechaInicio?: string;
	fechaFin?: string;
	cargaHoraria: string;
	modalidad?: string;
	pais?: string;
	provincia?: string;
	ubicacion?: string;
	cupo?: string;
	estado: string; // Representa el estado de la comisión
	links: Link[];
	isActive?: boolean;
	curso: {
		id: string;
		nombre: string;
		codigo: string;
	};
	horarios?: {
		day: string;
		startTime: string;
		endTime: string;
	}[];
	profesores?: {
		id: string;
		nombre: string;
		apellido: string | null;
		email: string;
		dni: string;
	}[];
	vendedores?: {
		id: string;
		nombre: string;
		apellido: string | null;
		email: string;
		dni: string;
	}[];
}

export interface Horario {
	day: string;
	startTime: string;
	endTime: string;
}

export interface PaginatedResponse<T> {
	items: T[];
	totalItems: number;
	currentPage: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

// Actualizar el tipo de respuesta del servicio
export interface CommissionsResponse extends PaginatedResponse<CommissionData> {}
