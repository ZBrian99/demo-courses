import api from '../../../config/apiConfig';
import { Form, FormsResponse } from '../types/types';

// Servicio para crear un formulario
export const createFormService = async (newForm: Form) => {
	const response = await api.post(`/forms`, newForm, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	});
	return response.data;
};

// Servicio para obtener todos los formularios
export const fetchFormsService = async (page: number = 1, itemsPerPage: number = 20): Promise<FormsResponse> => {
	const response = await api.get(`/forms?page=${page}&limit=${itemsPerPage}`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	});
	return response.data;
};

// Servicio para obtener un formulario por su ID
export const fetchFormByIdService = async (id: string) => {
	const response = await api.get(`/forms/${id}`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	});
	// console.log('fetchFormByIdService', response.data);

	return response.data;
};

// Servicio para actualizar un formulario
export const updateFormService = async (id: string, updatedForm: Form) => {
	const response = await api.patch(`/forms/${id}`, updatedForm, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	});
	// console.log('updateFormService', response.data);
	return response.data;
};

// Servicio para eliminar un formulario
export const deleteFormService = async (id: string) => {
	await api.delete(`/forms/${id}?permanent=true`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	});
};

export const generateReferalLinkService = async (comisionId: string, customLink?: string) => {
	const response = await api.post(
		`/forms/referal-link`,
		{ comisionId, customLink },
		{
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		}
	);
	return response.data;
};
