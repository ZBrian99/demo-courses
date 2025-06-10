// usersService.ts
import api from '../../../config/apiConfig'; // Configuración de axios
import { User, CreateUserData, UpdateUserData } from '../types/types';

// Servicio para obtener todos los usuarios
export const fetchUsersService = async (): Promise<User[]> => {
	const response = await api.get(`/users`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	});
	return response.data;
};

// Servicio para obtener un usuario por su ID
export const fetchUserByIdService = async (id: string): Promise<User> => {
	const response = await api.get(`/users/${id}`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	});
	return response.data;
};

// Servicio para crear un usuario
export const createUserService = async (newUser: CreateUserData): Promise<User> => {
	const response = await api.post(`/users`, newUser, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	});
	return response.data;
};

// Servicio para actualizar un usuario existente
export const updateUserService = async (id: string, data: UpdateUserData): Promise<User> => {
	const response = await api.patch(`/users/${id}`, data, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	});
	return response.data;
};

// Servicio para eliminar un usuario
export const deleteUserService = async (id: string): Promise<void> => {
	await api.delete(`/users/${id}?permanent=true`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	});
};
