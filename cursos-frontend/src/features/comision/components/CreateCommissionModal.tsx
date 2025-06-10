import React, { useEffect, useState } from 'react';
import { Box, Button, Modal, Paper, Typography, useTheme } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import StepForm1 from './StepForm1';
import StepForm2 from './StepForm2';
import StepForm3 from './StepForm3';
import StepForm4 from './StepForm4';
import CustomStepper from '../../../components/CustomStepper';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import {
	createCommission,
	fetchCommissionById,
	fetchCommissionsByCourseId,
	updateCommission,
	fetchCommissions,
} from '../slices/commissionsSlice';
import { Course } from '../../courses/types/types';
import { CommissionData } from '../types/types';
import { User } from '../../preinscripcion/types/types';
import StepFormVendedores from './StepFormVendedores';
import CustomAutocomplete from '../../../components/CustomAutocomplete';
import { CustomSelect } from '../../../components/inputs';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Horario } from '../types/types';
import dayjs from 'dayjs';
import { commissionSchema, step1Fields, step2Fields, step3Fields, step4Fields, allFields } from '../schemas/commissionSchema';
import { useGetCoursesQuery } from '../../courses/api/coursesApi';

interface CreateCommissionModalProps {
	open: boolean;
	onClose: () => void;
	commission?: CommissionData;
	course?: Course;
	isDuplicate?: boolean;
}

const steps = [
	'Configura los datos de cursada',
	'Selecciona los vendedores',
	'Establece los links',
	'Corrobora los datos',
];

type FormValues = z.infer<typeof commissionSchema>;

type FieldName = keyof FormValues;

const CreateCommissionModal: React.FC<CreateCommissionModalProps> = ({
	open,
	onClose,
	commission,
	course,
	isDuplicate = false
}) => {
	const dispatch = useAppDispatch();
	const theme = useTheme();
	const [activeStep, setActiveStep] = useState(0);
	const { data: coursesData = { items: [] } } = useGetCoursesQuery({
		page: 1,
		limit: 1000,
	});

	const methods = useForm<FormValues>({
		resolver: zodResolver(commissionSchema),
		mode: 'onBlur',
		defaultValues: {
			codigoComision: '',
			fechaInicio: '',
			fechaFin: '',
			cargaHoraria: '',
			modalidad: '',
			pais: '',
			provincia: '',
			ubicacion: '',
			cupo: '',
			cursoId: course?.id || '',
			profesores: [],
			vendedores: [],
			horarios: [],
			links: [],
		},
	});
	const totalSteps = steps.length;

	const handleNext = async () => {
		let fieldsToValidate: (keyof FormValues)[] = [];
		
		switch (activeStep) {
			case 0:
				fieldsToValidate = [...step1Fields];
				break;
			case 1:
				fieldsToValidate = [...step3Fields];
				break;
			case 2:
				fieldsToValidate = [...step4Fields];
				break;
			default:
				fieldsToValidate = [...allFields];
		}

		const isValid = await methods.trigger(fieldsToValidate);
		if (!isValid) {
			return;
		}
		setActiveStep((prev) => prev + 1);
	};

	const handleBack = () => {
		if (activeStep <= 0) {
			onClose();
		}
		setActiveStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
	};

	const handleSelectCourse = (course: Course | null) => {
		if (course) {
			methods.setValue('cursoId', course.id);
		}
	};

	useEffect(() => {
		if (open) {
			if (commission) {
				// En modo edición, mantener el código original
				methods.reset({
					codigoComision: isDuplicate ? '' : commission.codigoComision,
					cursoId: commission.curso.id,
					fechaInicio: commission.fechaInicio,
					fechaFin: commission.fechaFin,
					cargaHoraria: commission.cargaHoraria || '',
					modalidad: commission.modalidad,
					pais: commission.pais,
					provincia: commission.provincia,
					ubicacion: commission.ubicacion,
					cupo: commission.cupo,
					profesores: commission.profesores,
					vendedores: commission.vendedores,
					links: commission.links || [],
					horarios: commission.horarios,
				});
			} else if (course) {
				// Nueva comisión desde CourseDetailsPage
				methods.reset({
					codigoComision: '',
					cursoId: course.id,
					fechaInicio: '',
					fechaFin: '',
					cargaHoraria: '',
					modalidad: '',
					pais: '',
					provincia: '',
					ubicacion: '',
					cupo: '',
					profesores: [],
					vendedores: [],
					links: [],
					horarios: [],
				});
			} else {
				// Nueva comisión desde CommissionsPage
				methods.reset({
					codigoComision: '',
					cursoId: '',
					fechaInicio: '',
					fechaFin: '',
					cargaHoraria: '',
					modalidad: '',
					pais: '',
					provincia: '',
					ubicacion: '',
					cupo: '',
					profesores: [],
					vendedores: [],
					links: [],
					horarios: [],
				});
			}
		}
	}, [open]);

	const handleSubmit = (data: any) => {
		// Transformar el array de profesores seleccionados a un array de IDs antes de enviar los datos al backend
		const formattedData = {
			...data,
			profesores: data.profesores.map((profesor: User) => profesor.id),
			vendedores: data.vendedores.map((vendedor: User) => vendedor.id),
		};

		const refreshList = () => {
			if (course) {
				// Si estamos en la página de detalles de un curso, solo actualizamos las comisiones de ese curso
				dispatch(fetchCommissionsByCourseId({ 
					courseId: course.id,
					page: 1,
					itemsPerPage: 20
				}));
			} else {
				// Si estamos en la página general de comisiones, actualizamos todas
				dispatch(fetchCommissions({ page: 1, itemsPerPage: 20 }));
			}
		};

		if (commission) {
			// Modo edición
			dispatch(updateCommission({ id: commission.id, data: formattedData }))
				.unwrap()
				.then(() => {
					console.log('Comisión actualizada exitosamente');
					refreshList();
					handleClose();
				})
				.catch((error) => {
					console.error('Error al actualizar la comisión:', error);
				});
		} else {
			// Modo creación
			dispatch(createCommission(formattedData))
				.unwrap()
				.then(() => {
					console.log('Comisión creada exitosamente');
					refreshList();
					handleClose();
				})
				.catch((error) => {
					console.error('Error al crear la comisión:', error);
				});
		}
	};

	const handleStepContent = (step: number) => {
		switch (step) {
			case 0:
				return <StepForm1 isFromCourse={!!course} />;
			case 1:
				return <StepFormVendedores />;
			case 2:
				return <StepForm3 />;
			case 3:
				return <StepForm4 />;
			default:
				return null;
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
					maxWidth: '60rem',
					height: '100%',
					maxHeight: '50rem',
					backgroundColor: theme.palette.background.paper,
					color: theme.palette.text.primary,
					position: 'relative',
					borderRadius: '1rem',
				}}
			>
				<CustomStepper
					title={commission ? `Editar Comisión ${commission.curso?.nombre}` : 'Crear Comisión'}
					steps={steps}
					activeStep={activeStep}
				/>

				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: '.5rem',
						overflowY: 'auto',
						p: '2rem',
					}}
				>
					<FormProvider {...methods}>
						<Box
							component='form'
							onSubmit={methods.handleSubmit(handleSubmit)}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: '2rem',
								flexGrow: '1',
								width: '100%',
							}}
						>
							{handleStepContent(activeStep)}
						</Box>
					</FormProvider>
				</Box>
				<Box
					sx={{
						borderTop: `1px solid ${theme.palette.divider}`,
						display: 'flex',
						justifyContent: 'space-between',
						px: '2rem',
						mt: 'auto',
						py: '1rem',
					}}
				>
					<Button onClick={handleBack} variant='outlined'>
						Atrás
					</Button>
					{activeStep === totalSteps - 1 ? (
						<Button type='button' variant='contained' onClick={methods.handleSubmit(handleSubmit)}>
							Finalizar
						</Button>
					) : (
						<Button variant='contained' onClick={handleNext}>
							Siguiente
						</Button>
					)}
				</Box>
			</Box>
		</Modal>
	);
};

export default CreateCommissionModal;
