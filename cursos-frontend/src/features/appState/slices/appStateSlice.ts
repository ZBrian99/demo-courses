// store/slices/appStateSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Breadcrumb {
	label: string;
	path: string;
}

interface AppState {
	snackbar: {
		open: boolean;
		message: string;
		severity: 'success' | 'error' | 'info' | 'warning';
	};
	breadcrumbs: Breadcrumb[];
}

const initialState: AppState = {
	snackbar: {
		open: false,
		message: '',
		severity: 'info',
	},
	breadcrumbs: [{ label: '\u200B', path: '/' }],
};

export const appStateSlice = createSlice({
	name: 'appState',
	initialState,
	reducers: {
		showSnackbar: (
			state,
			action: PayloadAction<{ message: string; severity: 'success' | 'error' | 'info' | 'warning' }>
		) => {
			state.snackbar = { open: true, ...action.payload };
		},
		hideSnackbar: (state) => {
			state.snackbar.open = false;
		},
		setBreadcrumbs: (state, action: PayloadAction<Breadcrumb[]>) => {
			state.breadcrumbs = action.payload; // Reemplaza toda la ruta de breadcrumbs
		},
		addBreadcrumb: (state, action: PayloadAction<Breadcrumb>) => {
			state.breadcrumbs = [...state.breadcrumbs, action.payload]; // Añade un nuevo nivel
		},
	},
});

export const { showSnackbar, hideSnackbar, setBreadcrumbs, addBreadcrumb } = appStateSlice.actions;

export default appStateSlice.reducer;
