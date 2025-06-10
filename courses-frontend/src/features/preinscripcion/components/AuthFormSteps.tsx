// src/components/AuthFormSteps.tsx
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import BasicInfoForm from './BasicInfoForm';
import UserVerification from './UserVerification';
import { Box } from '@mui/material';
import { User } from '../types/types';

const schema = z.object({
	tipoDni: z.string().min(1, 'Requerido'),
	dni: z.string().min(1, 'Número de documento es requerido'),
	nombre: z.string().min(2, 'Nombre es requerido'),
	apellido: z.string().min(2, 'Apellido es requerido'),
	fechaNacimiento: z
		.string()
		.min(1, 'La fecha de nacimiento es requerida')
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener un formato válido.'),
	telefono: z.string().min(6, 'Teléfono es requerido'),
	email: z.string().email('Correo electrónico no es válido'),
	pais: z.string().min(2, 'País es requerido'),
	provincia: z.string().min(2, 'Provincia es requerida'),
	ciudad: z.string().min(2, 'Ciudad es requerida'),
});

interface AuthFormStepsProps {
	step: number;
	setStep: React.Dispatch<React.SetStateAction<number>>;

	handleUserVerification: (user: User | null) => void;
}

const AuthFormSteps: React.FC<AuthFormStepsProps> = ({ step, setStep, handleUserVerification }) => {
	const methods = useForm({
		resolver: zodResolver(schema),
		mode: 'onBlur',
		defaultValues: {
			tipoDni: '',
			dni: '',
			nombre: '',
			apellido: '',
			fechaNacimiento: '',
			telefono: '',
			email: '',
			pais: '',
			provincia: '',
			ciudad: '',
			rol: 'ALUMNO',
		},
	});

	return (
		<FormProvider {...methods}>
			<Box
				component='form'
				sx={{
					padding: '1rem',
					minHeight: '100vh',
					overflow: 'auto',
					maxHeight: '100vh',
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
					width: '100%',
					bgcolor: 'primary.light',
					color: 'red',
				}}
			>
				{step === 1 ? (
					<UserVerification handleUserVerification={handleUserVerification} />
				) : (
					<BasicInfoForm handleUserVerification={handleUserVerification} setStep={setStep} />
				)}
			</Box>
		</FormProvider>
	);
};

export default AuthFormSteps;
