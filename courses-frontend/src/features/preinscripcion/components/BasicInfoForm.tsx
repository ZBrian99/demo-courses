// src/components/BasicInfoForm.tsx
import React from 'react';
import { Box, Button, Typography, Paper, Chip, Alert, CircularProgress } from '@mui/material';
import { useRegisterUserMutation } from '../api/preinscripcionApi';
import { useFormContext } from 'react-hook-form';
import { CustomDatePicker, CustomSelect, CustomTextInput } from '../../../components/inputs';
import { User, UserRegistration } from '../types/types';

interface BasicInfoFormProps {
	handleUserVerification: (user: User | null) => void;
	setStep: React.Dispatch<React.SetStateAction<number>>;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ handleUserVerification, setStep }) => {
	const { handleSubmit, getValues } = useFormContext();
	const [registerUser, { isLoading, error, isError }] = useRegisterUserMutation();

	const onSubmit = async () => {
		const formData: Partial<UserRegistration> = getValues();

		try {
			const user = await registerUser(formData).unwrap();
			handleUserVerification(user);
		} catch (error) {
			console.error('Error al registrar usuario', error);
		}
	};

	return (
		<Paper
			sx={{
				display: 'flex',
				flexDirection: 'column',
				padding: '1.5rem',
				borderRadius: '1rem',
				width: '100%',
				maxWidth: '50rem',
				color: 'gray.800',
				flexGrow: 1,
			}}
		>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: '1rem',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						gap: '1rem',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<Box>
						<Typography variant='h5' color='gray.800' component='h1' gutterBottom>
							Bienvenido/a a la demo de Cursos
						</Typography>
						<Typography variant='body2' color='gray.700' gutterBottom>
							Completa tus datos personales por única vez para registrarte
						</Typography>
					</Box>

					<Chip
						label='Formulario de registro'
						variant='outlined'
						color='primary'
						sx={{
							px: '1rem',
							borderRadius: '.25rem',
							backgroundColor: 'primary.light',
							fontWeight: '500',
						}}
					/>
				</Box>
			</Box>
			<Typography sx={{ marginTop: '1.5rem', marginBottom: '1rem', fontWeight: 500 }}>Datos personales</Typography>
			{/* Información Personal */}
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
					gap: '1rem',
				}}
			>
				<CustomTextInput label='Nombre' name='nombre' fullWidth shrink={false} />
				<CustomTextInput label='Apellido' name='apellido' fullWidth shrink={false} />
			</Box>
			{/* Segunda Fila - Información adicional */}
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', sm: 'repeat(6, 1fr)' },
					gap: '1rem',
					marginTop: '1.5rem',
				}}
			>
				<CustomDatePicker
					label='Fecha de nacimiento'
					name='fechaNacimiento'
					fullWidth
					required
					sx={{ gridColumn: { sm: 'span 3' } }}
					shrink={false}
				/>

				<CustomSelect
					label='Tipo'
					name='tipoDni'
					fullWidth
					options={[
						{ label: 'DNI', value: 'DNI' },
						{ label: 'Pasaporte', value: 'Pasaporte' },
						{ label: 'LC', value: 'LC' },
						{ label: 'CI', value: 'CI' },
						{ label: 'RUT', value: 'RUT' },
						{ label: 'NIE', value: 'NIE' },
						{ label: 'Cédula', value: 'Cédula' },
						{ label: 'CURP', value: 'CURP' },
						{ label: 'RFC', value: 'RFC' },
						{ label: 'INE', value: 'INE' },
					]}
					required
					sx={{ gridColumn: { sm: 'span 1' } }}
					shrink={false}
				/>

				<CustomTextInput label='Número' name='dni' required sx={{ gridColumn: { sm: 'span 2' } }} shrink={false} />
			</Box>
			<Typography variant='subtitle1' sx={{ marginTop: '2rem', marginBottom: '1rem', fontWeight: 500 }}>
				Datos de contacto
			</Typography>
			{/* Información de Contacto */}
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
					gap: '1rem',
				}}
			>
				<CustomTextInput label='Correo Electrónico' name='email' fullWidth shrink={false} />
				<CustomTextInput label='Teléfono' name='telefono' fullWidth shrink={false} />
			</Box>
			<Typography variant='subtitle1' sx={{ marginTop: '2rem', marginBottom: '1rem', fontWeight: 500 }}>
				¿De dónde eres?
			</Typography>
			{/* Información de Localización */}
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
					gap: '1rem',
				}}
			>
				<CustomTextInput label='País' name='pais' fullWidth shrink={false} />
				<CustomTextInput label='Provincia/Estado' name='provincia' fullWidth shrink={false} />
				<CustomTextInput label='Ciudad' name='ciudad' fullWidth shrink={false} />
			</Box>
			{/* Botones de navegación */}
			<Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1.5rem' }}>
				<Button variant='text' color='primary' onClick={() => setStep(1)}>
					Atrás
				</Button>
				<Button variant='contained' color='primary' onClick={handleSubmit(onSubmit)} disabled={isLoading}>
					{isLoading ? (
						<>
							Registrando
							<CircularProgress size={20} sx={{ marginLeft: '0.5rem', color: 'inherit' }} />
						</>
					) : isError ? (
						'Reintentar'
					) : (
						'Registrarme'
					)}
				</Button>
			</Box>
			{error && (
				<Alert severity='error' sx={{ mt: 2 }}>
					Error al registrar usuario. Por favor, inténtalo nuevamente.
				</Alert>
			)}
		</Paper>
	);
};

export default BasicInfoForm;
