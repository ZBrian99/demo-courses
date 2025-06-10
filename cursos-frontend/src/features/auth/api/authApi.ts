// src/features/auth/api/authApi.ts

import { baseApi } from '../../../services/baseApi';
import { setCredentials, logout } from '../slices/authSlice';
import { LoginCredentials, LoginResponse } from '../types/authTypes';
import { RootState } from '../../../app/store';

export const authApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation<LoginResponse, LoginCredentials>({
			query: (credentials) => ({
				url: '/auth/login',
				method: 'POST',
				body: credentials,
			}),
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setCredentials(data)); // Guarda credenciales en el estado
				} catch {
					dispatch(logout());
				}
			},
		}),
		renewToken: builder.mutation<{ token: string }, void>({
			query: () => ({
				url: '/auth/renew-token',
				method: 'POST',
			}),
			extraOptions: { skipAuth: true }, // Omitimos la reautenticación aquí también
			async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
				try {
					const { data } = await queryFulfilled;
					const user = (getState() as RootState).auth.user;

					if (user) {
						dispatch(setCredentials({ token: data.token, user }));
					} else {
						dispatch(logout());
					}
				} catch {
					dispatch(logout());
				}
			},
		}),
		// Otros endpoints...
	}),
	overrideExisting: false,
});

export const { useLoginMutation, useRenewTokenMutation } = authApi;
