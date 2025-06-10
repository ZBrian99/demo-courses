import { Dayjs } from 'dayjs';

export interface Filters {
	nombre: string;
	estado: string;
	modalidad: string;
	// curso: string;
	// comision: string;
}

export interface Option {
	id?: string;
	order: number;
	text: string;
	value?: string;
}

export interface Question {
	id?: string;
	text: string;
	order: number;
	type: 'TEXTO_CORTO' | 'TEXTO_LARGO' | 'SELECCION' | 'CHECKBOX' | 'FECHA' | 'DESPLEGABLE' | 'DESPLEGABLE_MULTIPLE';
	isRequired: boolean;
	options?: Option[];
}

export interface Stage {
	id?: string;
	title: string;
	order: number;
	questions: Question[];
}
interface curso {
	id: string;
	codigo: string;
	nombre: string;
}
export interface Vendedor {
	linkReferido: string;
}

interface Comision {
	id: string;
	codigoComision: string;
	modalidad: string;
	curso: curso;
	fechaInicio: string;
	vendedores: Vendedor[];
}

export interface Form {
	id: string;
	title: string;
	nombre: string;
	descripcion: string;
	comision?: Comision;
	isActive: boolean;
	stages: Stage[];
	createdAt?: Dayjs;
	updatedAt?: Dayjs;
}

export interface GetLinkRef {
	comisionId: string;
	id: string;
	linkReferido: string;
	vendedorId: string;
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

export interface FormsResponse extends PaginatedResponse<Form> {}
