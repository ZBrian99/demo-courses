// src/features/user/api/userApi.ts
import { baseApi } from '../../../services/baseApi';
import { Form } from '../../forms/types/types';
import { Reference, ResponsePayload, User, UserRegistration } from '../types/types';

export const userApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// Cambiamos a mutation para el trigger manual
		findUserByDni: builder.mutation<User | null, { tipoDni: string; dni: string }>({
			query: ({ tipoDni, dni }) => ({
				url: '/users/search/dni',
				method: 'GET',
				params: { tipoDni, dni },
			}),
		}),

		// Endpoint para registrar usuario
		registerUser: builder.mutation<User, Partial<UserRegistration>>({
			query: (data) => ({
				url: '/users/register',
				method: 'POST',
				body: data,
			}),
		}),

		// Endpoint para buscar por referencia
		findByRef: builder.query<Reference, { ref: string }>({
			query: ({ ref }) => ({
				url: `/commissions/ref/${ref}`,
				method: 'GET',
			}),
		}),

		// Endpoint para buscar formulario por id
		findFormById: builder.query<Form, { id: string }>({
			query: ({ id }) => ({
				url: `/forms/${id}`,
				method: 'GET',
			}),
		}),
		submitFormResponses: builder.mutation<void, { ref: string; alumnoId: string; respuestas: ResponsePayload[] }>({
			query: ({ ref, alumnoId, respuestas }) => ({
				url: `/forms/submit/${ref}`,
				method: 'POST',
				body: { alumnoId, respuestas },
			}),
		}),
	}),

	overrideExisting: false,
});

export const {
	useFindUserByDniMutation,
	useRegisterUserMutation,
	useFindByRefQuery,
	useFindFormByIdQuery,
	useSubmitFormResponsesMutation,
} = userApi;
