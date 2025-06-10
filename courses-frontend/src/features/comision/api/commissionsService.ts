import axios from 'axios';
import { CommissionData, CreateCommissionData, CommissionsResponse } from '../types/types';
import api from '../../../config/apiConfig';
import { User } from '../../preinscripcion/types/types';

// Servicio para crear una comisión
export const createCommissionService = async (commissionData: CreateCommissionData): Promise<CommissionData> => {
	try {
		const response = await api.post(`/commissions`, commissionData, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		});
		return response.data as CommissionData;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			throw error.response.data;
		} else {
			throw new Error('Error al crear la comisión');
		}
	}
};

// Servicio para obtener todas las comisiones
export const fetchCommissionsService = async (page: number = 1, itemsPerPage: number = 20): Promise<CommissionsResponse> => {
	try {
		const response = await api.get(`/commissions?page=${page}&limit=${itemsPerPage}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		});
		return response.data as CommissionsResponse;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			throw error.response.data;
		} else {
			throw new Error('Error al obtener las comisiones');
		}
	}
};

// Servicio para obtener una comisión por su ID
export const fetchCommissionByIdService = async (id: string): Promise<CommissionData> => {
	try {
		const response = await api.get(`/commissions/${id}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		});
		return response.data as CommissionData;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			throw error.response.data;
		} else {
			throw new Error('Error al obtener la comisión');
		}
	}
};

// Servicio para obtener comisiones de un curso específico por su ID
export const fetchCommissionsByCourseIdService = async (
	courseId: string, 
	page: number = 1, 
	itemsPerPage: number = 20
): Promise<CommissionsResponse> => {
	try {
		const response = await api.get(
			`/commissions?courseId=${courseId}&page=${page}&limit=${itemsPerPage}`, 
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			}
		);
		return response.data as CommissionsResponse;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			throw error.response.data;
		} else {
			throw new Error('Error al obtener las comisiones del curso');
		}
	}
};

export const updateCommissionService = async (
	id: string,
	data: Partial<CreateCommissionData>
): Promise<CommissionData> => {
	const response = await api.patch(`/commissions/${id}`, data, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	});
	return response.data;
};

// Servicio para eliminar una comisión
export const deleteCommissionService = async (id: string): Promise<void> => {
	await api.delete(`/commissions/${id}?permanent=true`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	});
};

export const fetchProfesorsService = async (): Promise<User[]> => {
	try {
		const response = await api.get(`/users?role=PROFESOR`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		});
		return response.data as User[];
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			throw error.response.data;
		} else {
			throw new Error('Error al obtener los profesores');
		}
	}
};

export const fetchVendedoresService = async (): Promise<User[]> => {
	try {
		const response = await api.get(`/users?role=VENDEDOR`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		});
		return response.data as User[];
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			throw error.response.data;
		} else {
			throw new Error('Error al obtener los vendedores');
		}
	}
};
