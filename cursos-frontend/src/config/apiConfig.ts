// src/config/setupAxiosInterceptors.ts
import axios from 'axios';
import type { AxiosError } from 'axios';
import { logout } from '../features/auth/slices/authSlice';
import { AppDispatch } from '../app/store';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const setupAxiosInterceptors = (dispatch: AppDispatch) => {
	api.interceptors.response.use(
		(response) => response,
		(error: AxiosError) => {
			if (error.response && error.response.status === 401) {
				dispatch(logout());
			}
			return Promise.reject(error);
		}
	);
};

export default api;
