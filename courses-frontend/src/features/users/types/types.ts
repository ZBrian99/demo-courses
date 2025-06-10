// types.ts

// Tipo para los datos personales del usuario
export interface PersonalInfo {
	nombre: string;
	apellido: string;
	fechaNacimiento: string; // Formato ISO (YYYY-MM-DD)
	dni: string;
	tipoDni: string;
	profileImage?: string; // Puede ser una URL
}

// Tipo para los datos de contacto del usuario
export interface ContactInfo {
	email: string;
	telefono?: string;
	pais?: string;
	provincia?: string;
	ciudad?: string;
}

// Tipo para los datos profesionales del usuario
export interface ProfessionalInfo {
	profesion?: string;
	resume?: string; // URL al CV o resumen profesional
}

export interface User extends PersonalInfo, ContactInfo, ProfessionalInfo {
	id: string;
	rol: Role; // Basado en el enum Role
	isActive: boolean;
	createdAt: string; // Formato ISO (YYYY-MM-DDTHH:mm:ss.sssZ)
	updatedAt: string;
}

export interface CreateUserData extends Omit<User, 'id' | 'isActive' | 'createdAt' | 'updatedAt'> {
	password: string; // Contraseña que se envía en el momento de creación
}

// Definición del tipo User (que se corresponde con el modelo del backend)
// export interface User {
// 	id: string;
// 	nombre: string;
// 	apellido?: string;
// 	email: string;
// 	telefono?: string;
// 	pais?: string;
// 	provincia?: string;
// 	ciudad?: string;
// 	dni?: string;
// 	rol: Role;
// 	isActive: boolean;
// 	createdAt: string; // Considerando que se recibe en formato ISO desde el backend
// 	updatedAt: string;
// 	alumno?: Alumno;
// 	profesor?: Profesor;
// 	vendedor?: Vendedor;
// 	finanzas?: Finanzas;
// 	admin?: Admin;
// }

// Roles posibles para el usuario
export enum Role {
	USUARIO = 'USUARIO',
	ALUMNO = 'ALUMNO',
	PROFESOR = 'PROFESOR',
	PROFESORVENDEDOR = 'PROFESORVENDEDOR',
	VENDEDOR = 'VENDEDOR',
	FINANZAS = 'FINANZAS',
	ADMIN = 'ADMIN',
}

// Datos mínimos para crear un usuario (DTO de creación)
// export interface CreateUserData {
// 	nombre: string;
// 	apellido?: string;
// 	email: string;
// 	password: string;
// 	telefono?: string;
// 	pais?: string;
// 	provincia?: string;
// 	ciudad?: string;
// 	dni?: string;
// 	rol: Role;
// }

// Datos para actualizar un usuario (DTO de actualización)
// export interface UpdateUserData {
// 	nombre?: string;
// 	apellido?: string;
// 	email?: string;
// 	password?: string; // La contraseña puede cambiar
// 	telefono?: string;
// 	pais?: string;
// 	provincia?: string;
// 	ciudad?: string;
// 	dni?: string;
// 	rol?: Role;
// 	isActive?: boolean; // Para desactivar o reactivar el usuario
// }

export interface UpdateUserData {
	nombre?: string;
	apellido?: string;
	email?: string;
	telefono?: string;
	pais?: string;
	provincia?: string;
	ciudad?: string;
	dni?: string;
	tipoDni?: string;
	profesion?: string;
	resume?: string;
	rol?: Role;
	isActive?: boolean;
	fechaNacimiento?: string;
}

// Tipos relacionados a las relaciones con otras entidades

export interface Alumno {
	id: string;
	fechaNacimiento?: string;
	profesion?: string;
	primerInscripcion?: string;
	instagram?: string;
	foto_url?: string;
	practicasSupervisadas?: string;
}

export interface Profesor {
	id: string;
	// Puedes agregar otras propiedades específicas del profesor aquí
}

export interface Vendedor {
	id: string;
	// Puedes agregar otras propiedades específicas del vendedor aquí
}

export interface Finanzas {
	id: string;
	// Puedes agregar otras propiedades específicas de finanzas aquí
}

export interface Admin {
	id: string;
	// Puedes agregar otras propiedades específicas del admin aquí
}

export interface PaginatedUsersResponse {
	items: User[];
	totalItems: number;
	currentPage: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

export interface UsersFiltersQuery {
	page?: number;
	limit?: number;
	search?: string;
	rol?: Role;
}
