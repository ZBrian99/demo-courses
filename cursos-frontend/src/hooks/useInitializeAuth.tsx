// src/hooks/useInitializeAuth.ts

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { logout, setLoading } from '../features/auth/slices/authSlice';
import { useRenewTokenMutation } from '../features/auth/api/authApi';

export const useInitializeAuth = () => {
	const dispatch = useAppDispatch();
	const { token, user } = useAppSelector((state) => state.auth);
	const [renewToken] = useRenewTokenMutation();

	useEffect(() => {
		const initializeAuth = async () => {
			dispatch(setLoading(true));

			if (token && user) {
				try {
					await renewToken().unwrap();
				} catch (error) {
					console.error('Error al renovar el token:', error);
					dispatch(logout());
				}
			} else {
				dispatch(logout());
			}

			dispatch(setLoading(false));
		};

		initializeAuth();
	}, []);
	// }, [dispatch, token, user, renewToken]);
};
