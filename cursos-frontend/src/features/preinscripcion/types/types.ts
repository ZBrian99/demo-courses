import { Dayjs } from 'dayjs';

// src/types/User.ts
export interface User {
	id: string;
	nombre: string;
	apellido?: string;
	fechaNacimiento?: Dayjs;
	profileImage?: string;
	email: string;
	telefono?: string;
	pais?: string;
	provincia?: string;
	ciudad?: string;
	tipoDni?: string;
	dni?: string;
	resume?: string;
	profesion?: string;
	rol: string;
	isActive: boolean;
	createdAt: Dayjs;
	updatedAt: Dayjs;
}

export interface UserNotFound {
	message: string;
}

export interface UserRegistration {
	nombre: string;
	apellido: string;
	email: string;
	tipoDni: string;
	dni: string;
	fechaNacimiento: Dayjs | null;
	telefono: string;
	pais: string;
	provincia: string;
	ciudad: string;
}

export interface Reference {
	id: string;
	vendedorId: string;
	comisionId: string;
	linkReferido: string;
	comision: {
		id: string;
		codigoComision: string;
		fechaInicio: string;
		fechaFin: string;
		clases: string | null;
		modalidad: string;
		pais: string;
		provincia: string;
		ubicacion: string;
		formularioId: string | null;
		cupo: string;
		classroomLinks: string[];
		whatsappLinks: string[];
		infoLinks: string[];
		isActive: boolean;
		createdAt: string;
		updatedAt: string;
		cursoId: string;
		curso: {
			id: string;
			nombre: string;
			codigo: string;
			modalidad: string | null;
			descripcion: string | null;
		};
	};
}

export interface ResponsePayload {
	preguntaId: string;
	textValue?: string;
	opciones?: { opcionId: string }[];
}
