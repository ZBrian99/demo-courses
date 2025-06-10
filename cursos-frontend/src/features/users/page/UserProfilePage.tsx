import React, { useState, useEffect } from 'react';
import { Box, Button, Tabs, Tab, Typography, CircularProgress, Paper } from '@mui/material';
import { useParams, useNavigate, useMatch, useLocation } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Role, UpdateUserData } from '../types/types';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../api/usersApi';
import { useAppDispatch } from '../../../hooks/hooks';
import { setBreadcrumbs, showSnackbar } from '../../appState/slices/appStateSlice';
import { userEditSchema, UserEditFormData } from '../schemas/userSchema';
import { CustomTextInput, CustomSelect, CustomDatePicker, CustomTextarea } from '../../../components/inputs';
import dayjs from 'dayjs';

const tabs: readonly string[] = ['Datos personales', 'Datos profesionales', 'Rol'] as const;
type TabType = (typeof tabs)[number];

const tipoDocumentoOptions = [
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
];

const UserProfilePage: React.FC = () => {
	const { userId } = useParams<{ userId: string }>();
	const isEditMode = useMatch('/staff/edit/:userId') || useMatch('/students/edit/:userId');

	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const { data: user, isLoading } = useGetUserByIdQuery(userId || '');
	const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

	const [activeTab, setActiveTab] = useState<number>(0);

	const methods = useForm<UserEditFormData>({
		resolver: zodResolver(userEditSchema),
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
		},
	});

	useEffect(() => {
		if (user) {
			methods.reset({
				...user,
				fechaNacimiento: dayjs(user.fechaNacimiento).format('YYYY-MM-DD'),
			});
		}
	}, [user]);

	useEffect(() => {
		if (user) {
			const userType = user.rol === 'ALUMNO' ? 'Alumnos' : 'Personal';
			const basePath = user.rol === 'ALUMNO' ? '/students' : '/staff';
			const mode = isEditMode ? 'edit' : 'view';

			dispatch(
				setBreadcrumbs([
					{ label: userType, path: basePath },
					{ label: `${user.nombre} ${user.apellido}`, path: `${basePath}/${mode}/${userId}` },
				])
			);
		}
	}, [user, userId, isEditMode]);

	const handleSave = async (data: UserEditFormData) => {
		if (!userId || !isEditMode) return;

		try {
			const formattedData: UpdateUserData = {
				...data,
				fechaNacimiento: dayjs(data.fechaNacimiento).toISOString(),
				profesion: data.profesion ?? undefined,
				resume: data.resume ?? undefined,
			};

			await updateUser({ id: userId, data: formattedData }).unwrap();
			dispatch(
				showSnackbar({
					message: 'Usuario actualizado correctamente',
					severity: 'success',
				})
			);
			navigate(getRedirectPath());
		} catch (error) {
			dispatch(
				showSnackbar({
					message: 'Error al actualizar usuario',
					severity: 'error',
				})
			);
		}
	};

	// Determinamos si venimos de students o staff basándonos en la URL y el rol
	const getRedirectPath = () => {
		if (user?.rol === Role.ALUMNO) {
			return '/students';
		} else {
			return '/staff';
		}
	};

	if (isLoading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Paper
			sx={{
				display: 'flex',
				flexDirection: 'column',
				padding: '1.5rem',
				borderRadius: { xs: 0, md: '1rem' },
				mx: 'auto',
				minHeight: '100%',
				width: '100%',
				backgroundColor: 'common.white',
				flexGrow: 1,
			}}
		>
			<FormProvider {...methods}>
				<Box
					component='form'
					onSubmit={methods.handleSubmit(handleSave)}
					sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1 }}
				>
					<Box
						sx={{
							borderBottom: 1,
							borderColor: 'divider',
							position: 'relative',
						}}
					>
						<Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} variant='scrollable'>
							{tabs.map((label: TabType) => (
								<Tab
									key={label}
									label={label}
									sx={{
										textTransform: 'none',
										fontWeight: 500,
										fontSize: '1rem',
									}}
								/>
							))}
						</Tabs>
					</Box>

					{activeTab === 0 && (
						<Box display='flex' flexDirection='column' gap='1rem' maxWidth='50rem' mx='auto' width='100%'>
							<Typography variant='h6' mt={2}>
								Información personal
							</Typography>

							<Box display='flex' flexWrap='wrap' gap='1rem'>
								<CustomTextInput label='Nombre' name='nombre' readOnly={!isEditMode} required fullWidth />
								<CustomTextInput label='Apellido' name='apellido' readOnly={!isEditMode} required fullWidth />
							</Box>

							<Box display='flex' flexDirection={{ xs: 'column', sm: 'row' }} gap='1rem'>
								<CustomDatePicker
									label='Fecha de nacimiento'
									name='fechaNacimiento'
									readOnly={!isEditMode}
									required
									sx={{ flex: 1 }}
								/>
								<Box display='flex' flexWrap={{ xs: 'wrap', sm: 'nowrap' }} gap='1rem' sx={{ flex: 1 }}>
									<CustomSelect
										label='Tipo'
										name='tipoDni'
										options={tipoDocumentoOptions}
										readOnly={!isEditMode}
										required
										sx={{ minWidth: { xs: '100%', sm: '8rem' } }}
									/>
									<CustomTextInput label='DNI' name='dni' readOnly={!isEditMode} required fullWidth />
								</Box>
							</Box>

							<Typography variant='h6' mt={2}>
								Datos de contacto
							</Typography>
							<Box display='flex' flexWrap='wrap' gap='1rem'>
								<CustomTextInput label='Email' name='email' type='email' readOnly={!isEditMode} required fullWidth />
								<CustomTextInput label='Teléfono' name='telefono' readOnly={!isEditMode} fullWidth />
							</Box>

							<Typography variant='h6' mt={2}>
								Ubicación
							</Typography>
							<Box display='flex' flexWrap='wrap' gap='1rem'>
								<CustomTextInput label='País' name='pais' readOnly={!isEditMode} fullWidth />
								<CustomTextInput label='Provincia' name='provincia' readOnly={!isEditMode} fullWidth />
								<CustomTextInput label='Ciudad' name='ciudad' readOnly={!isEditMode} fullWidth />
							</Box>
						</Box>
					)}

					{activeTab === 1 && (
						<Box display='flex' flexDirection='column' gap='1rem' maxWidth='50rem' mx='auto' width='100%'>
							<Typography variant='h6' mt={2}>
								Datos profesionales
							</Typography>
							<CustomTextInput label='Profesión' name='profesion' readOnly={!isEditMode} fullWidth />
							<CustomTextarea label='Resumen profesional' name='resume' rows={4} readOnly={!isEditMode} fullWidth />
						</Box>
					)}

					{activeTab === 2 && (
						<Box display='flex' flexDirection='column' gap='1rem' maxWidth='50rem' mx='auto' width='100%'>
							<Typography variant='h6' mt={2}>
								Rol en el sistema
							</Typography>
							<CustomSelect
								label='Rol'
								name='rol'
								options={[
									{ label: 'ALUMNO', value: Role.ALUMNO },
									{ label: 'PROFESOR', value: Role.PROFESOR },
									{ label: 'VENDEDOR', value: Role.VENDEDOR },
									{ label: 'FINANZAS', value: Role.FINANZAS },
									// { label: 'ADMIN', value: Role.ADMIN },
								]}
								readOnly={!isEditMode || user?.rol === Role.ALUMNO}
								required
								fullWidth
							/>
						</Box>
					)}
					{isEditMode && (
						<Box display='flex' justifyContent='space-between' mt='auto' pt='2rem' borderTop={1} borderColor='divider'>
							<Button variant='outlined' onClick={() => navigate(getRedirectPath())} disabled={isUpdating}>
								Cancelar
							</Button>
							<Button variant='contained' type='submit' disabled={isUpdating}>
								{isUpdating ? 'Guardando...' : 'Guardar'}
							</Button>
						</Box>
					)}
				</Box>
			</FormProvider>
		</Paper>
	);
};

export default UserProfilePage;
