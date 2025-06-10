import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
	createFormService,
	fetchFormsService,
	fetchFormByIdService,
	updateFormService,
	deleteFormService,
	generateReferalLinkService,
} from '../api/formService';
import { Form, GetLinkRef, Vendedor, FormsResponse } from '../types/types';

interface FormState {
	forms: Form[];
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
	pagination: {
		currentPage: number;
		totalPages: number;
		totalItems: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
		itemsPerPage: number;
	};
}

const initialState: FormState = {
	forms: [],
	status: 'idle',
	error: null,
	pagination: {
		currentPage: 1,
		totalPages: 1,
		totalItems: 0,
		hasNextPage: false,
		hasPreviousPage: false,
		itemsPerPage: 20
	}
};

// Thunk para generar el link de referido
export const generateReferalLink = createAsyncThunk(
	'forms/generateReferalLink',
	async ({ comisionId, customLink }: { comisionId: string; customLink?: string }, { rejectWithValue }) => {
		try {
			return await generateReferalLinkService(comisionId, customLink);
		} catch (error: any) {
			return rejectWithValue(error.response?.data || 'Error al generar el link de inscripción');
		}
	}
);

// Thunk para crear un nuevo formulario
export const createForm = createAsyncThunk<Form, Form>('forms/createForm', async (newForm, { rejectWithValue }) => {
	try {
		return await createFormService(newForm);
	} catch (error: any) {
		return rejectWithValue(error.response?.data || 'Error al crear el formulario');
	}
});

// Thunk para obtener todos los formularios
export const fetchForms = createAsyncThunk<
	FormsResponse,
	{ page: number; itemsPerPage: number }
>('forms/fetchForms', async ({ page, itemsPerPage }) => {
	return await fetchFormsService(page, itemsPerPage);
});

// Thunk para obtener un formulario por ID
export const fetchFormById = createAsyncThunk<Form, string>('forms/fetchFormById', async (id, { rejectWithValue }) => {
	try {
		return await fetchFormByIdService(id);
	} catch (error: any) {
		return rejectWithValue(error.response?.data || `Error al obtener el formulario con ID ${id}`);
	}
});

// Thunk para actualizar un formulario existente
export const updateForm = createAsyncThunk<Form, { id: string; data: Form }>(
	'forms/updateForm',
	async ({ id, data }, { rejectWithValue }) => {
		try {
			return await updateFormService(id, data);
		} catch (error: any) {
			return rejectWithValue(error.response?.data || `Error al actualizar el formulario con ID ${id}`);
		}
	}
);

// Thunk para eliminar un formulario
export const deleteForm = createAsyncThunk<string, string>('forms/deleteForm', async (id, { rejectWithValue }) => {
	try {
		await deleteFormService(id);
		return id; // Retornamos el ID para eliminarlo del estado
	} catch (error: any) {
		return rejectWithValue(error.response?.data || `Error al eliminar el formulario con ID ${id}`);
	}
});

const formsSlice = createSlice({
	name: 'forms',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Create Form
			.addCase(createForm.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(createForm.fulfilled, (state, action: PayloadAction<Form>) => {
				state.status = 'succeeded';
				state.forms.push(action.payload);
			})
			.addCase(createForm.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			})

			// Fetch Forms
			.addCase(fetchForms.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchForms.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.forms = action.payload.items;
				state.pagination = {
					currentPage: action.payload.currentPage,
					totalPages: action.payload.totalPages,
					totalItems: action.payload.totalItems,
					hasNextPage: action.payload.hasNextPage,
					hasPreviousPage: action.payload.hasPreviousPage,
					itemsPerPage: action.payload.itemsPerPage
				};
			})
			.addCase(fetchForms.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			})

			// Fetch Form by ID
			.addCase(fetchFormById.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchFormById.fulfilled, (state, action: PayloadAction<Form>) => {
				state.status = 'succeeded';
				const existingForm = state.forms.find((form) => form.id === action.payload.id);
				if (!existingForm) {
					state.forms.push(action.payload);
				}
			})
			.addCase(fetchFormById.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			})

			// Update Form
			.addCase(updateForm.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(updateForm.fulfilled, (state, action: PayloadAction<Form>) => {
				state.status = 'succeeded';
				const index = state.forms.findIndex((form) => form.id === action.payload.id);
				if (index !== -1) {
					state.forms[index] = action.payload;
				}
			})
			.addCase(updateForm.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			})

			// Delete Form
			.addCase(deleteForm.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(deleteForm.fulfilled, (state, action: PayloadAction<string>) => {
				state.status = 'succeeded';
				state.forms = state.forms.filter((form) => form.id !== action.payload);
			})
			.addCase(deleteForm.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			})

			.addCase(generateReferalLink.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(generateReferalLink.fulfilled, (state, action: PayloadAction<GetLinkRef>) => {
				state.status = 'succeeded';
				const form = state.forms.find((form) => form.comision?.id === action.payload.comisionId);

				if (form) {
					// Actualiza o asigna el `linkReferido` en `vendedores`
					form.comision!.vendedores = [{ linkReferido: action.payload.linkReferido }];
				}
			})
			.addCase(generateReferalLink.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload as string;
			});
	},
});

export default formsSlice.reducer;
