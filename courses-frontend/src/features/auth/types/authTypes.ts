// src/features/auth/types/authTypes.ts

export interface User {
	id: string;
	nombre: string;
	email: string;
	rol: string;
}

export interface AuthState {
	token: string | null;
	user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface LoginResponse {
	token: string;
	user: User;
}
