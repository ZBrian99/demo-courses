import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../app/store';
import { logout } from '../features/auth/slices/authSlice';

const baseQuery = fetchBaseQuery({
	baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).auth.token;
		if (token) {
			headers.set('Authorization', `Bearer ${token}`);
		}
		return headers;
	},
});

const baseQueryWithLogout = async (args: any, api: any, extraOptions: any) => {
	let result = await baseQuery(args, api, extraOptions);
	if (result.error && result.error.status === 401) {
		console.warn('Token expirado. Cerrando sesión...');
		api.dispatch(logout());
		setTimeout(() => {
		api.dispatch(baseApi.util.resetApiState());
		}, 0);
	}
	return result;
};

export const baseApi = createApi({
	baseQuery: baseQueryWithLogout,
	tagTypes: ['Payments', 'Enrollment', 'Enrollments', 'Users', 'User', 'Students', 'Staff', 'Courses', 'Course'],
	endpoints: () => ({}),
	keepUnusedDataFor: 60,
});
