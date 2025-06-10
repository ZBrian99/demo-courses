import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slices/authSlice';
import commissionsReducer from '../features/comision/slices/commissionsSlice';
import appStateReducer from '../features/appState/slices/appStateSlice';
import formsReducer from '../features/forms/slices/formsSlice';
import usersReducer from '../features/users/slices/usersSlice';
import { baseApi } from '../services/baseApi';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		appState: appStateReducer,
		commissions: commissionsReducer,
		forms: formsReducer,
		users: usersReducer,

		[baseApi.reducerPath]: baseApi.reducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
