// components/AppSnackbar.tsx
import React from 'react';
import { Snackbar, Alert, IconButton, AlertColor } from '@mui/material';
import { CheckCircle, Error as ErrorIcon, Warning, Info, Close as CloseIcon } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { hideSnackbar } from '../features/appState/slices/appStateSlice';

const snackbarConfig: Record<string, { icon: JSX.Element; color: AlertColor }> = {
	success: { icon: <CheckCircle fontSize='inherit' />, color: 'success' },
	error: { icon: <ErrorIcon fontSize='inherit' />, color: 'error' },
	warning: { icon: <Warning fontSize='inherit' />, color: 'warning' },
	info: { icon: <Info fontSize='inherit' />, color: 'info' },
};

const AppSnackbar: React.FC = () => {
	const dispatch = useAppDispatch();
	const snackbar = useAppSelector((state) => state.appState.snackbar);

	const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason !== 'clickaway') {
			dispatch(hideSnackbar());
		}
	};

	const { severity, message, open } = snackbar;
	const config = snackbarConfig[severity] || snackbarConfig.info;

	return (
		<Snackbar
			open={open}
			autoHideDuration={6000}
			onClose={handleClose}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
		>
			<Alert
				severity={config.color}
				icon={config.icon}
				action={
					<IconButton size='small' color='inherit' onClick={handleClose}>
						<CloseIcon fontSize='small' />
					</IconButton>
				}
				sx={{ width: '100%' }}
			>
				{message}
			</Alert>
		</Snackbar>
	);
};

export default AppSnackbar;
