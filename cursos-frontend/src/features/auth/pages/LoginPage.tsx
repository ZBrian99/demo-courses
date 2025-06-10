// src/pages/LoginPage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, TextField, Box, Typography, Alert, Paper, Divider, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LoginCredentials } from '../types/authTypes';
import { useAppDispatch } from '../../../hooks/hooks';
import { useLoginMutation } from '../api/authApi';
import { setCredentials } from '../slices/authSlice';

const defaultCredentials = {
	email: 'admin@admin.com',
	password: 'admin123',
};

const LoginPage: React.FC = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginCredentials>();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [login, { isLoading, error: loginError }] = useLoginMutation();
	const [showPassword, setShowPassword] = React.useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleDemoLogin = async () => {
		try {
			const userData = await login(defaultCredentials).unwrap();
			dispatch(setCredentials(userData));
			navigate('/enrollments');
		} catch (err) {
			console.error('Error en demo login:', err);
		}
	};

	// Manejo del submit del formulario
	const onSubmit = async (data: LoginCredentials) => {
		try {
			const userData = await login(data).unwrap();
			dispatch(setCredentials(userData));
			navigate('/enrollments');
		} catch (err) {
			console.error('Error al iniciar sesión:', err);
		}
	};

	// Extraemos el mensaje de error de la respuesta de la mutation
	const errorMessage =
		loginError && 'data' in loginError
			? (loginError.data as any)?.message
			: 'Error al iniciar sesión. Por favor, verifica tus credenciales.';

	return (
		<Box
			sx={{
				height: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				bgcolor: 'primary.light',
				padding: '1rem',
			}}
		>
			<Paper
				elevation={3}
				sx={{
					p: 4,
					width: '100%',
					maxWidth: '25rem',
					borderRadius: '0.75rem',
				}}
			>
				<Typography variant='h5' textAlign='center' mb={3}>
					Demo Cursos - Login
				</Typography>

				<Button 
					fullWidth 
					variant='contained' 
					onClick={handleDemoLogin} 
					disabled={isLoading} 
					sx={{ mb: 3 }}
				>
					Iniciar como Admin Demo
				</Button>

				<Box sx={{ mb: 3 }}>
					<Divider>
						<Typography variant='body2' color='text.secondary'>
							o inicia sesión manualmente
						</Typography>
					</Divider>
				</Box>

				<Box component='form' onSubmit={handleSubmit(onSubmit)}>
					<TextField
						label='Email'
						fullWidth
						{...register('email', { required: 'El email es requerido' })}
						error={!!errors.email}
						helperText={errors.email?.message}
						sx={{ mb: 2 }}
					/>
					<TextField
						label='Contraseña'
						type={showPassword ? 'text' : 'password'}
						fullWidth
						{...register('password', { required: 'La contraseña es requerida' })}
						error={!!errors.password}
						helperText={errors.password?.message}
						InputProps={{
							endAdornment: (
								<InputAdornment position='end'>
									<IconButton 
										aria-label='toggle password visibility' 
										onClick={handleClickShowPassword} 
										edge='end'
									>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
						sx={{ mb: 3 }}
					/>

					<Button 
						type='submit' 
						fullWidth 
						variant='contained' 
						disabled={isLoading}
					>
						{isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
					</Button>

					{loginError && (
						<Alert severity='error' sx={{ mt: 2 }}>
							{errorMessage}
						</Alert>
					)}
				</Box>

				<Typography 
					variant='body2' 
					color='text.secondary' 
					textAlign='center' 
					sx={{ mt: 2}}
				>
					Credenciales demo: {defaultCredentials.email} / {defaultCredentials.password}
				</Typography>
			</Paper>
		</Box>
	);
};

export default LoginPage;
