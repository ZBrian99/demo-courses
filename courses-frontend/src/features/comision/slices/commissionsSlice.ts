import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
	createCommissionService,
	fetchCommissionByIdService,
	fetchCommissionsService,
	fetchCommissionsByCourseIdService,
	deleteCommissionService,
	updateCommissionService,
	fetchProfesorsService,
	fetchVendedoresService,
} from '../api/commissionsService';
import { CommissionData, CreateCommissionData, CommissionsResponse } from '../types/types';
import { User } from '../../preinscripcion/types/types';

// Estado inicial y tipos del slice
interface CommissionsState {
	commissions: CommissionData[];
	profesores: User[];
	vendedores: User[];
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
	pagination: {
		currentPage: number;
		totalPages: number;
		totalItems: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
}

const initialState: CommissionsState = {
	commissions: [],
	profesores: [],
	vendedores: [],
	status: 'idle',
	error: null,
	pagination: {
		currentPage: 1,
		totalPages: 1,
		totalItems: 0,
		hasNextPage: false,
		hasPreviousPage: false,
	},
};

// Thunk para obtener profesores
export const fetchProfesores = createAsyncThunk<User[]>('commissions/fetchProfesores', async () => {
	return await fetchProfesorsService();
});

// Thunk para obtener vendedores
export const fetchVendedores = createAsyncThunk<User[]>('commissions/fetchVendedores', async () => {
	return await fetchVendedoresService();
});

// Thunk para obtener todas las comisiones
export const fetchCommissions = createAsyncThunk<
	CommissionsResponse,
	{ page: number; itemsPerPage: number }
>('commissions/fetchCommissions', async ({ page, itemsPerPage }) => {
	return await fetchCommissionsService(page, itemsPerPage);
});

// Thunk para obtener una comisión por su ID
export const fetchCommissionById = createAsyncThunk<CommissionData, string>(
	'commissions/fetchCommissionById',
	async (id: string) => {
		return await fetchCommissionByIdService(id);
	}
);

// Thunk para crear una nueva comisión
export const createCommission = createAsyncThunk<CommissionData, CreateCommissionData>(
	'commissions/createCommission',
	async (newCommission, { rejectWithValue }) => {
		try {
			const response = await createCommissionService(newCommission);
			// console.log('response', response);
			return response;
		} catch (error: any) {
			return rejectWithValue(error);
		}
	}
);

// Thunk para obtener comisiones por ID de curso
export const fetchCommissionsByCourseId = createAsyncThunk<
	CommissionsResponse,
	{ courseId: string; page: number; itemsPerPage: number }
>('commissions/fetchCommissionsByCourseId', async ({ courseId, page, itemsPerPage }, { rejectWithValue }) => {
	try {
		return await fetchCommissionsByCourseIdService(courseId, page, itemsPerPage);
	} catch (error: any) {
		return rejectWithValue(error);
	}
});

export const updateCommission = createAsyncThunk<CommissionData, { id: string; data: Partial<CreateCommissionData> }>(
	'commissions/updateCommission',
	async ({ id, data }, { rejectWithValue }) => {
		try {
			const response = await updateCommissionService(id, data);
			// console.log('response', response);
			return response;
		} catch (error: any) {
			return rejectWithValue(error);
		}
	}
);

// Thunk para eliminar una comisión
export const deleteCommission = createAsyncThunk<string, string>(
	'commissions/deleteCommission',
	async (id, { rejectWithValue }) => {
		try {
			await deleteCommissionService(id);
			return id;
		} catch (error: any) {
			return rejectWithValue(error);
		}
	}
);

// Slice de las comisiones
const commissionsSlice = createSlice({
	name: 'commissions',
	initialState,
	reducers: {
		clearState: (state) => {
			state.commissions = [];
			state.status = 'idle';
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// fetchCommissions
			.addCase(fetchCommissions.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchCommissions.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.commissions = action.payload.items;
				state.pagination = {
					currentPage: action.payload.currentPage,
					totalPages: action.payload.totalPages,
					totalItems: action.payload.totalItems,
					hasNextPage: action.payload.hasNextPage,
					hasPreviousPage: action.payload.hasPreviousPage,
				};
			})
			.addCase(fetchCommissions.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message || 'Failed to fetch commissions';
			})

			// fetchCommissionById
			.addCase(fetchCommissionById.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchCommissionById.fulfilled, (state, action: PayloadAction<CommissionData>) => {
				state.status = 'succeeded';
				const existingCommission = state.commissions.find((commission) => commission.id === action.payload.id);

				if (!existingCommission) {
					state.commissions.push(action.payload);
				}
			})
			.addCase(fetchCommissionById.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message || 'Failed to fetch commission by ID';
			})

			// createCommission
			.addCase(createCommission.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(createCommission.fulfilled, (state, action: PayloadAction<CommissionData>) => {
				state.status = 'succeeded';
				state.commissions.push(action.payload);
			})
			.addCase(createCommission.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message || 'Failed to create commission';
			})

			// fetchCommissionsByCourseId
			.addCase(fetchCommissionsByCourseId.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchCommissionsByCourseId.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.commissions = action.payload.items;
				state.pagination = {
					currentPage: action.payload.currentPage,
					totalPages: action.payload.totalPages,
					totalItems: action.payload.totalItems,
					hasNextPage: action.payload.hasNextPage,
					hasPreviousPage: action.payload.hasPreviousPage,
				};
			})
			.addCase(fetchCommissionsByCourseId.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message || 'Failed to fetch commissions by course ID';
			})
			.addCase(updateCommission.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(updateCommission.fulfilled, (state, action: PayloadAction<CommissionData>) => {
				state.status = 'succeeded';
				const index = state.commissions.findIndex((commission) => commission.id === action.payload.id);
				if (index !== -1) {
					state.commissions[index] = action.payload;
				}
			})
			.addCase(updateCommission.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message || 'Failed to update commission';
			})

			// deleteCommission
			.addCase(deleteCommission.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(deleteCommission.fulfilled, (state, action: PayloadAction<string>) => {
				state.status = 'succeeded';
				state.commissions = state.commissions.filter((commission) => commission.id !== action.payload);
			})
			.addCase(deleteCommission.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message || 'Failed to delete commission';
			})

			// fetchProfesores
			.addCase(fetchProfesores.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchProfesores.fulfilled, (state, action: PayloadAction<User[]>) => {
				state.status = 'succeeded';
				state.profesores = action.payload;
			})
			.addCase(fetchProfesores.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message || 'Failed to fetch profesores';
			})

			// fetchVendedores
			.addCase(fetchVendedores.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchVendedores.fulfilled, (state, action: PayloadAction<User[]>) => {
				state.status = 'succeeded';
				state.vendedores = action.payload;
			})
			.addCase(fetchVendedores.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message || 'Failed to fetch vendedores';
			});
	},
});

export const { clearState } = commissionsSlice.actions;

export default commissionsSlice.reducer;
