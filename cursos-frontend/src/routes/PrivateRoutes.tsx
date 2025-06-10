// src/routes/PrivateRoutes.tsx

import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../hooks/hooks';
import { Box, CircularProgress } from '@mui/material';

const PrivateRoutes = () => {
	const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

	if (isLoading) {
		// Mostrar un indicador de carga mientras se inicializa el estado de autenticación
		return (
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '100vh',
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to='/login' />;
	}

	return <Outlet />;
};

export default PrivateRoutes;
