// src/features/auth/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../types/authTypes';

const token = localStorage.getItem('token') || null;
const userRawData = localStorage.getItem('user');
const user = userRawData && userRawData !== 'undefined' ? JSON.parse(userRawData) : null;

const initialState: AuthState = {
	token,
	user,
	isAuthenticated: !!token,
	isLoading: false,
};

interface SetCredentialsPayload {
	token: string;
	user: User;
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setCredentials(state, action: PayloadAction<SetCredentialsPayload>) {
			const { token, user } = action.payload;
			state.token = token;
			state.user = user;
			state.isAuthenticated = true;
			state.isLoading = false;
			localStorage.setItem('token', token);
			localStorage.setItem('user', JSON.stringify(user));
		},
		logout(state) {
			state.token = null;
			state.user = null;
			state.isAuthenticated = false;
			state.isLoading = false;
			localStorage.removeItem('token');
			localStorage.removeItem('user');
		},
		setLoading(state, action: PayloadAction<boolean>) {
			state.isLoading = action.payload;
		},
	},
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
