import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import {
	TextField,
	Button,
	Box,
	Paper,
	Divider,
	useTheme,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import EtapaComponent from '../components/EtapaComponent';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { createForm, fetchFormById, updateForm } from '../slices/formsSlice';
import { Form, Option, Question, Stage } from '../types/types';
import { useMatch, useNavigate, useParams } from 'react-router-dom';
import CustomAutocomplete from '../../../components/CustomAutocomplete';
import { Course } from '../../courses/types/types';
import { fetchCommissions } from '../../comision/slices/commissionsSlice';
import { CommissionData } from '../../comision/types/types';
import { CustomTextarea } from '../../../components/inputs';
import { setBreadcrumbs, showSnackbar } from '../../appState/slices/appStateSlice';
import { useGetCoursesQuery } from '../../courses/api/coursesApi';

export const CreateForm: React.FC = () => {
	const navigate = useNavigate();

	const dispatch = useAppDispatch();
	const { forms, status, error } = useAppSelector((state) => state.forms);

	const { id } = useParams<{ id: string }>();

	const isEditMode = useMatch('/forms/edit/:id');
	const isDuplicateMode = useMatch('/forms/duplicate/:id');
	const isCreateMode = useMatch('/forms/create');

	const { data: coursesData = { items: [] } } = useGetCoursesQuery({
		page: 1,
		limit: 1000,
	});

	const { commissions, status: commissionsStatus } = useAppSelector((state) => state.commissions);

	const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
	const [selectedCommission, setSelectedCommission] = useState<CommissionData | null>(null);
	const [filteredCommissions, setFilteredCommissions] = useState<CommissionData[]>([]);
	const [deleteDialog, setDeleteDialog] = useState<{
		open: boolean;
		type: 'etapa' | 'pregunta';
		etapaIndex?: number;
		preguntaIndex?: number;
		onConfirm: () => void;
	}>({
		open: false,
		type: 'etapa',
		onConfirm: () => {},
	});

	const methods = useForm<Form>({
		defaultValues: {
			title: '',
			nombre: '',
			descripcion: '',
			stages: [
				{
					id: uuidv4(),
					title: '',
					questions: [],
				},
			],
		},
	});

	const { control, handleSubmit, reset } = methods;
	const {
		fields: etapaFields,
		append: appendEtapa,
		remove: removeEtapa,
		replace: replaceEtapas,
	} = useFieldArray({
		control,
		name: 'stages',
	});

	const agregarEtapa = () => {
		appendEtapa({
			id: uuidv4(),
			title: '',
			order: etapaFields.length,
			questions: [],
		});
	};

	const cleanFormData = (data: any) => {
		// console.log('cleanFormData');
		let cleanedData = { ...data };

		// Función para asignar orders y limpiar IDs basándose en el modo
		const assignOrdersAndCleanIds = (stages: Stage[], shouldDeleteIds: boolean): Stage[] =>
			stages.map((stage: Stage, stageIndex: number) => {
				const cleanStage: Stage = {
					...(shouldDeleteIds ? {} : { id: stage.id }),
					title: stage.title || '', // Asegura que title sea string
					order: stageIndex,
					questions: stage.questions.map((question: Question, questionIndex: number): Question => {
						const cleanQuestion: Question = {
							...(shouldDeleteIds ? {} : { id: question.id }),
							text: question.text || '', // Asegura que text sea string
							type: question.type,
							isRequired: question.isRequired ?? false, // Asegura un booleano
							order: questionIndex,
							options:
								question.options?.map((option: Option, optionIndex: number): Option => {
									return {
										...(shouldDeleteIds ? {} : { id: option.id }),
										text: option.text || '', // Asegura que text sea string
										value: option.value || '', // Asegura que value sea string
										order: optionIndex,
									};
								}) || [], // Asegura un array vacío si options es undefined
						};
						return cleanQuestion;
					}),
				};
				return cleanStage;
			});

		if (isCreateMode) {
			delete cleanedData.id;
			delete cleanedData.comisionId;
			delete cleanedData.comision;

			cleanedData.stages = assignOrdersAndCleanIds(data.stages, true);
			// console.log('create', cleanedData);
			return cleanedData;
		} else if (isDuplicateMode) {
			delete cleanedData.id;
			delete cleanedData.comisionId;
			delete cleanedData.commissionId;
			delete cleanedData.isActive;
			delete cleanedData.createdAt;
			delete cleanedData.updatedAt;
			delete cleanedData.comisionId;
			delete cleanedData.comision;

			cleanedData.stages = assignOrdersAndCleanIds(data.stages, true);
			// console.log('duplicate', cleanedData);
			return cleanedData;
		} else if (isEditMode) {
			delete cleanedData.id;
			delete cleanedData.comisionId;
			delete cleanedData.commissionId;
			delete cleanedData.isActive;
			delete cleanedData.createdAt;
			delete cleanedData.updatedAt;
			delete cleanedData.comisionId;
			delete cleanedData.comision;

			cleanedData.stages = assignOrdersAndCleanIds(data.stages, false);
			// console.log('edit', cleanedData);
			return cleanedData;
		}

		return data;
	};

	const onSubmit = async (data: Form) => {
		const cleanedData = cleanFormData(data);

		if (!selectedCourse || !selectedCommission) {
			dispatch(
				showSnackbar({
					message: 'Debes seleccionar un curso y una comisión',
					severity: 'error',
				})
			);
			return;
		}

		const dataToSend = {
			...cleanedData,
			commissionId: selectedCommission.id,
		};

		try {
			if (isEditMode && id) {
				await dispatch(updateForm({ id, data: dataToSend })).unwrap();
				dispatch(
					showSnackbar({
						message: 'Formulario actualizado correctamente',
						severity: 'success',
					})
				);
			} else {
				await dispatch(createForm(dataToSend)).unwrap();
				dispatch(
					showSnackbar({
						message: 'Formulario creado correctamente',
						severity: 'success',
					})
				);
			}
			navigate('/forms');
		} catch (error: any) {
			console.error('Error al enviar el formulario:', error);
			dispatch(
				showSnackbar({
					message: error?.message || 'Ha ocurrido un error al procesar el formulario',
					severity: 'error',
				})
			);
		}
	};

	// Cargar datos al abrir el `Autocomplete` de cursos
	const handleFetchCourses = () => {
		// Ya no es necesario hacer dispatch ya que RTK Query maneja el fetching
	};

	// Cargar datos al abrir el `Autocomplete` de comisiones
	const handleFetchCommissions = () => {
		if (commissions.length === 0 && commissionsStatus !== 'loading') {
			try {
				dispatch(fetchCommissions({ page: 1, itemsPerPage: 1000 }));
			} catch (error) {
				console.error('Error al cargar las comisiones:', error);
			}
		}
	};

	const handleSelectCourse = (course: Course) => {
		setSelectedCourse(course);
		setSelectedCommission(null);
	};
	// Cargar cursos en modo duplicación o edición
	useEffect(() => {
		if (isEditMode || isDuplicateMode) {
			// Ya no necesitamos hacer nada aquí porque RTK Query maneja la carga
		}
	}, [isEditMode, isDuplicateMode]);

	useEffect(() => {
		if (selectedCourse) {
			const filtered = commissions.filter((commission: CommissionData) => commission.curso.id === selectedCourse.id);
			setFilteredCommissions(filtered);
		} else {
			setFilteredCommissions([]); // Si no hay curso seleccionado, no mostrar comisiones
		}
	}, [selectedCourse, commissions]);

	useEffect(() => {
		if (isEditMode || isDuplicateMode) {
			const formToLoad = forms.find((form: any) => form.id === id);

			if (!formToLoad && id) {
				try {
					dispatch(fetchFormById(id));
				} catch (error) {
					console.error('Error al cargar el formulario:', error);
				}
			} else if (formToLoad) {
				// if (courses.length === 0) dispatch(fetchCourses());
				// if (commissions.length === 0) dispatch(fetchCommissions());

				const commissionId = formToLoad?.comision?.id;
				if (commissionId) {
					const loadedCommission = commissions.find((commission: CommissionData) => commission.id === commissionId);

					// console.log('commissions', commissions, 'id', commissionId, 'loadedCommission', loadedCommission);
					if (loadedCommission) {
						// console.log('____________loadedCommission', loadedCommission);
						const course = coursesData.items.find((course: any) =>
							course.comisiones?.find((comision: any) => comision.id === commissionId)
						);

						if (course) {
							// console.log('_____________course', course);
							setSelectedCourse(course);
							setSelectedCommission(loadedCommission);
						} else {
							// dispatch(fetchCourses());
						}
					} else {
						try {
							dispatch(fetchCommissions({ page: 1, itemsPerPage: 1000 }));
						} catch (error) {
							console.error('Error al cargar las comisiones:', error);
						}
					}

					// } else if (formToLoad) {
					// 	console.log(formToLoad);
					// 	// Si los cursos o comisiones no están cargados completamente, los obtenemos
					// 	// if (courses.length < 3) {
					// 	// 	console.log('fetchCourses');

					// 	// 	dispatch(fetchCourses());
					// 	// }
					// 	// if (commissions.length < 3) {
					// 	// 	console.log('fetchCommissions');

					// 	// 	dispatch(fetchCommissions());
					// 	// }

					// 	// Luego de que los cursos y comisiones estén cargados, buscamos la comisión y el curso
					// 	// if (courses.length >= 3 && commissions.length >= 3) {
					// 	// console.log('asignar curso y comision', formToLoad.commissionId);
					// 	// Buscar la comisión asignada al formulario
					// 	const commissionId = formToLoad.commissionId;
					// 	const selectedCommission = commissions.find((commission) => commission.id === commissionId);
					// 	if (!selectedCommission) dispatch(fetchCommissions());

					// 	if (selectedCommission && commissionId) {
					// 		// console.log('selectedCommission', commissionId, selectedCommission);
					// 		// Si hay una comisión, buscar el curso al que está asignada
					// 		const selectedCourse = courses.find((course) =>
					// 			course.comisiones?.some((comision: any) => comision.id === commissionId)
					// 		);
					// 		if (!selectedCourse) dispatch(fetchCourses());
					// 		// Asignar automáticamente el curso y la comisión
					// 		setSelectedCourse(selectedCourse || null);
					// 		setSelectedCommission(selectedCommission);
					// 		console.log('selectedCourse', selectedCourse);
					// 		console.log('selectedCommission', selectedCommission);
					// 	}
					// Procesar datos del formulario y actualizar valores para duplicar o editar
				}
				const stagesData = formToLoad.stages?.map((stage: any) => ({
					...stage,
					id: isDuplicateMode ? uuidv4() : stage.id,
					questions: stage.questions?.map((question: any) => ({
						...question,
						id: isDuplicateMode ? uuidv4() : question.id,
						options: question.options?.map((option: any) => ({
							...option,
							id: isDuplicateMode ? uuidv4() : option.id,
						})),
					})),
				}));

				reset({
					...formToLoad,
					title: formToLoad.title,
					nombre: formToLoad.nombre,
					descripcion: formToLoad.descripcion,
					stages: stagesData,
				});
				replaceEtapas(stagesData);
				// }
			}
		}
	}, [id, isEditMode, isDuplicateMode, forms, reset, replaceEtapas, coursesData.items, commissions]);

	useEffect(() => {
		dispatch(
			setBreadcrumbs([
				{ label: 'Formularios', path: '/forms' },
				{
					label: `${isEditMode ? 'Editar' : isDuplicateMode ? 'Duplicar' : 'Crear'} `,
					path: `/forms/${isEditMode ? `edit/${id}` : isDuplicateMode ? `duplicate/${id}` : 'create'}`,
				},
			])
		);
	}, []);

	const handleOpenDeleteDialog = (
		type: 'etapa' | 'pregunta',
		onConfirm: () => void,
		etapaIndex?: number,
		preguntaIndex?: number
	) => {
		setDeleteDialog({
			open: true,
			type,
			etapaIndex,
			preguntaIndex,
			onConfirm,
		});
	};

	const handleCloseDeleteDialog = () => {
		setDeleteDialog({
			open: false,
			type: 'etapa',
			onConfirm: () => {},
		});
	};

	const handleConfirmDelete = () => {
		deleteDialog.onConfirm();
		handleCloseDeleteDialog();
	};

	return (
		<Box
			sx={{
				maxWidth: '60rem',
				mx: 'auto',
				display: 'flex',
				flexDirection: 'column',
				gap: '1rem',
				width: '100%',
			}}
		>
			<FormProvider {...methods}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Paper
						sx={{
							p: { xs: '1rem', sm: '1.5rem', md: '2rem' },
							mb: '1rem',
							display: 'flex',
							flexDirection: 'column',
							gap: '1rem',
							borderRadius: { xs: 0, md: '1rem' },
							boxShadow: 'none',
							border: '1px solid',
							borderColor: 'divider',
							bgcolor: 'common.white',
							transition: 'all 0.2s ease',
							'&:hover': {
								boxShadow: (theme) => theme.shadows[2],
								borderColor: 'transparent',
							},
						}}
					>
						<Typography variant='h5' sx={{ color: 'text.primary', fontWeight: 500 }}>
							Información General
						</Typography>

						<Box sx={{ display: 'flex', gap: '1rem', flexDirection: { xs: 'column', md: 'row' } }}>
							<CustomAutocomplete
								items={coursesData.items}
								multiple={false}
								label='Selecciona un curso'
								placeholder='Escribe para buscar cursos'
								loading={false}
								value={selectedCourse}
								getOptionLabel={(course) => course.nombre}
								onChange={(newValue) => handleSelectCourse(newValue as Course)}
								fetchData={handleFetchCourses}
								sx={{ flex: 1 }}
							/>

							<CustomAutocomplete
								items={filteredCommissions}
								multiple={false}
								label='Selecciona una comisión'
								placeholder='Escribe para buscar una comisión'
								loading={commissionsStatus === 'loading'}
								value={selectedCommission}
								getOptionLabel={(commission) => commission.codigoComision || `No Code ID: ${commission.id}`}
								onChange={(newValue) => setSelectedCommission(newValue as CommissionData)}
								fetchData={handleFetchCommissions}
								disabled={!selectedCourse}
								sx={{ flex: 1 }}
							/>
						</Box>

						<Box sx={{ display: 'flex', gap: '1rem', flexDirection: { xs: 'column', md: 'row' } }}>
							<TextField
								{...methods.register('title', { required: true })}
								label='Título del Formulario'
								fullWidth
								size='small'
								sx={{ flex: 2 }}
							/>
							<TextField
								{...methods.register('nombre', { required: true })}
								label='Código del Formulario'
								fullWidth
								size='small'
								sx={{ flex: 1 }}
							/>
						</Box>

						<CustomTextarea
							label='Descripción del Formulario'
							name='descripcion'
							rows={4}
							required
							fullWidth
							sx={{
								'& .MuiOutlinedInput-root': {
									borderRadius: '0.5rem',
								},
							}}
						/>
					</Paper>

					<Box
						sx={{
							display: 'flex',
							gap: '1rem',
							flexDirection: 'column',
						}}
					>
						{etapaFields.map((etapa, etapaIndex) => (
							<EtapaComponent
								key={etapa.id}
								etapaIndex={etapaIndex}
								removeEtapa={() => removeEtapa(etapaIndex)}
								onDeleteClick={handleOpenDeleteDialog}
							/>
						))}
					</Box>

					<Paper
						sx={{
							// position: 'fixed',
							// bottom: 0,
							// left: 0,
							// right: 0,
							mt: '1rem',
							py: '1rem',
							px: '1rem',
							borderRadius: { xs: 0, md: '1rem' },
							display: 'flex',
							justifyContent: 'flex-end',
							gap: '1rem',
							flexWrap: 'wrap',
						}}
					>
						<Button
							variant='outlined'
							color='primary'
							onClick={agregarEtapa}
							startIcon={<AddCircle />}
							sx={{
								borderRadius: '2rem',
								px: '1.5rem',
								py: '0.5rem',
								textTransform: 'none',
								fontWeight: 500,
								whiteSpace: 'nowrap',
								width: { xs: '100%', md: 'auto' },
							}}
						>
							Agregar Etapa
						</Button>
						<Button
							type='submit'
							variant='contained'
							color='primary'
							sx={{
								borderRadius: '2rem',
								px: '2rem',
								py: '0.5rem',
								textTransform: 'none',
								fontWeight: 500,
								whiteSpace: 'nowrap',
								width: { xs: '100%', md: 'auto' },
							}}
						>
							{isEditMode ? 'Actualizar Formulario' : 'Guardar Formulario'}
						</Button>
					</Paper>
				</form>
			</FormProvider>

			<Dialog
				open={deleteDialog.open}
				onClose={handleCloseDeleteDialog}
				maxWidth='xs'
				fullWidth
				PaperProps={{
					sx: {
						borderRadius: '1rem',
						p: '0.5rem',
					},
				}}
			>
				<DialogTitle sx={{ pb: 1 }}>Confirmar eliminación</DialogTitle>
				<DialogContent sx={{ pb: 2 }}>
					<Typography>
						{deleteDialog.type === 'etapa'
							? `¿Estás seguro de que deseas eliminar esta etapa${
									deleteDialog.etapaIndex !== undefined ? ` ${deleteDialog.etapaIndex + 1}` : ''
							  }?`
							: `¿Estás seguro de que deseas eliminar esta pregunta${
									deleteDialog.preguntaIndex !== undefined ? ` ${deleteDialog.preguntaIndex + 1}` : ''
							  }?`}{' '}
						Esta acción no se puede deshacer.
					</Typography>
				</DialogContent>
				<DialogActions sx={{ px: 2, pb: 2 }}>
					<Button
						onClick={handleCloseDeleteDialog}
						sx={{
							borderRadius: '2rem',
							px: '1.5rem',
							textTransform: 'none',
						}}
					>
						Cancelar
					</Button>
					<Button
						onClick={handleConfirmDelete}
						color='error'
						variant='contained'
						sx={{
							borderRadius: '2rem',
							px: '1.5rem',
							textTransform: 'none',
						}}
					>
						Eliminar
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default CreateForm;
