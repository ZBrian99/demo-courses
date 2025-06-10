import React, { useState } from 'react';
import { Box, Button, Modal, Typography, useTheme } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomStepper from '../../../components/CustomStepper';
import StepPersonalInfo from './StepPersonalInfo';
import StepContactInfo from './StepContactInfo';
import StepProfessionalInfo from './StepProfessionalInfo';
import { Role } from '../types/types';
import { useCreateUserMutation } from '../api/usersApi';
import { useAppDispatch } from '../../../hooks/hooks';
import { showSnackbar } from '../../appState/slices/appStateSlice';
import { userSchema, UserFormData, step1Fields, step2Fields, step3Fields, allFields, FieldNames } from '../schemas/userStepsSchema';

const steps = ['Configura sus datos personales', 'Datos de contacto', 'Perfil profesional'];

interface CreateUserModalProps {
	open: boolean;
	onClose: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ open, onClose }) => {
	const theme = useTheme();
	const [activeStep, setActiveStep] = useState(0);
	const dispatch = useAppDispatch();
	const [createUser, { isLoading }] = useCreateUserMutation();

	const methods = useForm<UserFormData>({
		resolver: zodResolver(userSchema),
		mode: 'onBlur',
		defaultValues: {
			nombre: '',
			apellido: '',
			fechaNacimiento: '',
			dni: '',
			tipoDni: 'DNI',
			email: '',
			telefono: '',
			pais: '',
			provincia: '',
			ciudad: '',
			profesion: '',
			resume: '',
			rol: Role.USUARIO,
			password: '',
		},
	});

	const handleNext = async () => {
		let fieldsToValidate: FieldNames[] = [];

		switch (activeStep) {
			case 0:
				fieldsToValidate = [...step1Fields];
				break;
			case 1:
				fieldsToValidate = [...step2Fields];
				break;
			case 2:
				fieldsToValidate = [...step3Fields];
				break;
			default:
				fieldsToValidate = [...allFields];
		}

		const isValid = await methods.trigger(fieldsToValidate);
		if (!isValid) {
			return;
		}
		
		if (activeStep < steps.length - 1) {
			setActiveStep((prev) => prev + 1);
		}
	};

	const handleBack = () => {
		if (activeStep <= 0) {
			handleClose();
		}
		setActiveStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
	};

	const handleSubmit = async (data: UserFormData) => {
		try {
			const userData = {
				nombre: data.nombre || '',
				apellido: data.apellido || '',
				fechaNacimiento: data.fechaNacimiento || '',
				tipoDni: data.tipoDni || 'DNI',
				dni: data.dni || '',
				email: data.email || '',
				telefono: data.telefono || '',
				pais: data.pais || '',
				provincia: data.provincia || '',
				ciudad: data.ciudad || '',
				profesion: data.profesion || '',
				resume: data.resume || '',
				rol: data.rol || Role.USUARIO,
				password: data.password || ''
			};

			await createUser(userData).unwrap();
			dispatch(showSnackbar({ 
				message: 'Usuario creado correctamente', 
				severity: 'success' 
			}));
			handleClose();
		} catch (error: any) {
			dispatch(showSnackbar({ 
				message: error.data?.message || 'Error al crear usuario', 
				severity: 'error' 
			}));
		}
	};

	const handleClose = () => {
		methods.reset();
		setActiveStep(0);
		onClose();
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				zIndex: 1099,
				padding: '1rem',
			}}
		>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					width: '100%',
					maxWidth: '50rem',
					height: '100%',
					maxHeight: '50rem',
					backgroundColor: theme.palette.background.paper,
					color: theme.palette.text.primary,
					borderRadius: '1rem',
					padding: '1rem',
				}}
			>
				<CustomStepper title='Crear Usuario' steps={steps} activeStep={activeStep} />

				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: '.5rem',
						overflowY: 'auto',
						p: '2rem',
						position: 'relative',
					}}
				>
					<FormProvider {...methods}>
						<Box
							component='form'
							onSubmit={methods.handleSubmit(handleSubmit)}
							sx={{
								display: 'flex',
								width: '100%',
								flexDirection: 'column',
								gap: '1rem',
							}}
						>
							{activeStep === 0 && <StepPersonalInfo />}
							{activeStep === 1 && <StepContactInfo />}
							{activeStep === 2 && <StepProfessionalInfo />}
						</Box>
					</FormProvider>
				</Box>

				<Box
					sx={{
						borderTop: `1px solid ${theme.palette.divider}`,
						display: 'flex',
						justifyContent: 'space-between',
						px: '2rem',
						py: '1rem',
						mt: 'auto',
					}}
				>
					<Button onClick={handleBack} variant='outlined' disabled={isLoading}>
						{activeStep === 0 ? 'Cancelar' : 'Atrás'}
					</Button>
					{activeStep === steps.length - 1 ? (
						<Button
							type='submit'
							variant='contained'
							onClick={methods.handleSubmit(handleSubmit)}
							disabled={isLoading}
						>
							{isLoading ? 'Creando...' : 'Finalizar'}
						</Button>
					) : (
						<Button variant='contained' onClick={handleNext} disabled={isLoading}>
							Siguiente
						</Button>
					)}
				</Box>
			</Box>
		</Modal>
	);
};

export default CreateUserModal;
