// src/components/UserVerification.tsx
import React, { useEffect } from 'react';
import { Box, Button, Typography, Paper, Chip } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useFindUserByDniMutation } from '../api/preinscripcionApi';
import { CustomSelect, CustomTextInput } from '../../../components/inputs';
import { User } from '../types/types';

interface UserVerificationProps {
	handleUserVerification: (user: User | null) => void;
}

// Constantes para las keys del localStorage
const DNI_STORAGE_KEY = 'userDniData';

interface StoredDniData {
	tipoDni: string;
	dni: string;
}

const UserVerification: React.FC<UserVerificationProps> = ({ handleUserVerification }) => {
	const formContext = useFormContext();
	const [findUserByDni, { isLoading }] = useFindUserByDniMutation();

	// Cargar datos guardados solo una vez al montar el componente
	useEffect(() => {
		const storedData = localStorage.getItem(DNI_STORAGE_KEY);
		if (storedData) {
			const parsedData: StoredDniData = JSON.parse(storedData);
			formContext.setValue('tipoDni', parsedData.tipoDni);
			formContext.setValue('dni', parsedData.dni);
		}
	}, []); // Array de dependencias vacío para que solo se ejecute al montar

	const handleVerification = async () => {
		const isValid = await formContext.trigger(['tipoDni', 'dni']);
		if (!isValid) return;

		const { tipoDni, dni } = formContext.getValues();

		// Guardar datos en localStorage
		const dniData: StoredDniData = { tipoDni, dni };
		localStorage.setItem(DNI_STORAGE_KEY, JSON.stringify(dniData));

		try {
			const user = await findUserByDni({ tipoDni, dni }).unwrap();
			handleUserVerification(user);
		} catch (error) {
			handleUserVerification(null);
		}
	};

	return (
		<Paper
			sx={{
				width: '100%',
				maxWidth: '30rem',
				textAlign: 'center',
				display: 'flex',
				flexDirection: 'column',
				gap: '1.5rem',
				padding: '1.5rem',
				borderRadius: '1rem',
				alignItems: 'center',
				mt: '5rem',
			}}
		>
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
			<Box color={'gray.700'}>
				<Typography variant='h3' component='h1' gutterBottom>
					Bienvenido/a a la demo de Cursos
				</Typography>
				<Typography variant='body1' gutterBottom>
					Ingresa tu tipo y número de DNI (sin puntos ni espacios)
				</Typography>
			</Box>
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: '2fr 3fr',
					gap: '1rem',
					width: '100%',
				}}
			>
				<CustomSelect
					label='Tipo'
					name='tipoDni'
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
				/>
				<CustomTextInput label='Número' name='dni' required />
			</Box>

			<Button
				variant='contained'
				color='primary'
				fullWidth
				sx={{
					marginTop: '.5rem',
				}}
				onClick={handleVerification}
				disabled={isLoading}
			>
				{isLoading ? 'Verificando...' : 'Continuar'}
			</Button>
		</Paper>
	);
};

export default UserVerification;
