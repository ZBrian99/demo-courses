// usersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
	createUserService,
	deleteUserService,
	fetchUserByIdService,
	fetchUsersService,
	updateUserService,
} from '../api/usersService';
import { User, CreateUserData, UpdateUserData } from '../types/types';

// Estado inicial y tipos del slice
interface UsersState {
	users: User[];
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
}

const initialState: UsersState = {
	users: [],
	status: 'idle',
	error: null,
};

// Thunks para CRUD de usuarios
export const fetchUsers = createAsyncThunk<User[]>('users/fetchUsers', async () => {
	return await fetchUsersService();
});

export const fetchUserById = createAsyncThunk<User, string>('users/fetchUserById', async (id: string) => {
	return await fetchUserByIdService(id);
});

export const createUser = createAsyncThunk<User, CreateUserData>(
	'users/createUser',
	async (newUser, { rejectWithValue }) => {
		try {
			return await createUserService(newUser);
		} catch (error: any) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const updateUser = createAsyncThunk<User, { id: string; data: UpdateUserData }>(
	'users/updateUser',
	async ({ id, data }, { rejectWithValue }) => {
		try {
			return await updateUserService(id, data);
		} catch (error: any) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteUser = createAsyncThunk<string, string>('users/deleteUser', async (id, { rejectWithValue }) => {
	try {
		await deleteUserService(id);
		return id; // Retornamos el ID para eliminarlo del estado
	} catch (error: any) {
		return rejectWithValue(error.response.data);
	}
});

// Slice de usuarios
const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// fetchUsers
			.addCase(fetchUsers.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
				state.status = 'succeeded';
				state.users = action.payload;
			})
			.addCase(fetchUsers.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message || 'Failed to fetch users';
			})

			// fetchUserById
			.addCase(fetchUserById.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchUserById.fulfilled, (state, action: PayloadAction<User>) => {
				state.status = 'succeeded';
				const existingUser = state.users.find((user) => user.id === action.payload.id);
				if (!existingUser) {
					state.users.push(action.payload);
				}
			})
			.addCase(fetchUserById.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message || 'Failed to fetch user by ID';
			})

			// createUser
			.addCase(createUser.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
				state.status = 'succeeded';
				state.users.push(action.payload);
			})
			.addCase(createUser.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message || 'Failed to create user';
			})

			// updateUser
			.addCase(updateUser.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
				state.status = 'succeeded';
				const index = state.users.findIndex((user) => user.id === action.payload.id);
				if (index !== -1) {
					state.users[index] = action.payload;
				}
			})
			.addCase(updateUser.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message || 'Failed to update user';
			})

			// deleteUser
			.addCase(deleteUser.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
				state.status = 'succeeded';
				state.users = state.users.filter((user) => user.id !== action.payload);
			})
			.addCase(deleteUser.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message || 'Failed to delete user';
			});
	},
});

export default usersSlice.reducer;
