import React, { useState, useEffect } from 'react';
import {
	Modal,
	Box,
	Button,
	TextField,
	Typography,
	IconButton,
	useTheme,
	InputAdornment,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch } from '../../../hooks/hooks';
import { Course, RequiredCourse } from '../types/types';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { useGetCourseByIdQuery, useGetCoursesQuery, useCreateCourseMutation, useUpdateCourseMutation } from '../api/coursesApi';
import { showSnackbar } from '../../appState/slices/appStateSlice';

interface CreateCourseModalProps {
	open: boolean;
	onClose: () => void;
	courseId?: string;
}

export const CreateCourseModal: React.FC<CreateCourseModalProps> = ({ open, onClose, courseId }) => {
	const theme = useTheme();
	const dispatch = useAppDispatch();

	const { data: courseData } = useGetCourseByIdQuery(courseId || '', {
		skip: !courseId,
	});

	const { data: coursesData = { items: [] } } = useGetCoursesQuery({
		page: 1,
		limit: 1000,
	});

	const [createCourse] = useCreateCourseMutation();
	const [updateCourse] = useUpdateCourseMutation();

	const {
		control,
		handleSubmit,
		reset,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<Course>({
		defaultValues: {
			codigo: '',
			nombre: '',
			descripcion: '',
			cursosRequeridos: [],
		},
		mode: 'onBlur',
	});

	const [tempCursosRequeridos, setTempCursosRequeridos] = useState<RequiredCourse[]>([]);
	const [view, setView] = useState<'create' | 'requiredCourses'>('create');
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

	const filteredCourses = coursesData.items.filter(
		(course) =>
			(course.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || course.codigo.includes(searchTerm)) &&
			course.id !== courseId
	);

	const paginatedCourses = filteredCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	const cursosRequeridos = useWatch({
		control,
		name: 'cursosRequeridos',
	});

	useEffect(() => {
		if (courseId && courseData) {
			const { codigo, nombre, descripcion, cursosRequeridos } = courseData;
			setValue('codigo', codigo || '');
			setValue('nombre', nombre || '');
			setValue('descripcion', descripcion || '');

			if (cursosRequeridos && cursosRequeridos.length > 0) {
				const requiredCoursesDetailed = cursosRequeridos.map((requiredCourse: RequiredCourse) => {
					const courseDetail = coursesData.items.find((c) => c.id === requiredCourse.id);
					return {
						id: courseDetail?.id || '',
						codigo: courseDetail?.codigo || '',
						nombre: courseDetail?.nombre || '',
					};
				});
				setValue('cursosRequeridos', requiredCoursesDetailed);
			}
		}
	}, [courseId, courseData, coursesData.items, setValue]);

	const handleAddCourseTemp = (course: Course) => {
		if (!tempCursosRequeridos.find((c) => c.id === course.id)) {
			setTempCursosRequeridos((prev) => [...prev, { id: course.id!, codigo: course.codigo, nombre: course.nombre! }]);
		}
	};

	const handleRemoveCourseTemp = (course: RequiredCourse) => {
		setTempCursosRequeridos((prev) => prev.filter((c) => c.id !== course.id));
	};

	const handleSaveRequiredCourses = () => {
		setValue('cursosRequeridos', tempCursosRequeridos);
		setView('create');
	};

	const handleViewChange = (newView: 'create' | 'requiredCourses') => {
		if (newView === 'requiredCourses') {
			setTempCursosRequeridos(getValues('cursosRequeridos') || []);
		}
		setView(newView);
	};

	const handleRemoveCourse = (course: RequiredCourse) => {
		const updatedCourses = getValues('cursosRequeridos')?.filter((c) => c.id !== course.id) || [];
		setValue('cursosRequeridos', updatedCourses, { shouldDirty: true, shouldValidate: true });
	};

	const onSubmit = async (data: Course) => {
		try {
			const transformedData = {
				...data,
				cursosRequeridos: data.cursosRequeridos?.map(course => course.id) || []
			};

			if (courseId) {
				await updateCourse({ 
					id: courseId, 
					data: transformedData 
				}).unwrap();
				dispatch(showSnackbar({ message: 'Curso actualizado correctamente', severity: 'success' }));
			} else {
				await createCourse(transformedData).unwrap();
				dispatch(showSnackbar({ message: 'Curso creado correctamente', severity: 'success' }));
			}
			onClose();
		} catch (error) {
			dispatch(showSnackbar({ message: 'Error al guardar el curso', severity: 'error' }));
		}
	};

	const handleClose = () => {
		reset();
		setTempCursosRequeridos([]);
		setView('create');
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
				zIndex: 9999,
			}}
		>
			<Box
				sx={{
					borderRadius: '1rem',
					overflow: 'hidden',
					width: '100%',
					maxWidth: '40rem',
				}}
			>
				<Box
					sx={{
						p: 4,
						maxHeight: '100vh',
						overflowY: 'auto',
						backgroundColor: theme.palette.background.paper,
						color: theme.palette.text.primary,
					}}
				>
					{view === 'create' ? (
						<form onSubmit={handleSubmit(onSubmit)}>
							<Typography variant='h6'>{courseId ? 'Editar curso' : 'Crear curso'}</Typography>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									gap: '1rem',
								}}
							>
								<Controller
									name="codigo"
									control={control}
									rules={{
										required: 'El código es obligatorio',
									}}
									render={({ field }) => (
										<TextField
											{...field}
											label='Código del curso'
											size="small"
											margin='normal'
											error={!!errors.codigo}
                      helperText={errors.codigo?.message}
                      sx={{
                      flex: .5,
                      }}
										/>
									)}
								/>

								<Controller
									name="nombre"
									control={control}
									rules={{
										required: 'El nombre es obligatorio',
										minLength: {
											value: 3,
											message: 'El nombre debe tener al menos 3 caracteres',
										},
										maxLength: {
											value: 50,
											message: 'El nombre no puede tener más de 50 caracteres',
										},
									}}
									render={({ field }) => (
										<TextField
											{...field}
											label='Nombre del curso'
											fullWidth
											size="small"
											margin='normal'
											error={!!errors.nombre}
                      helperText={errors.nombre?.message}
                      sx={{
                      flex: 1,
                      }}
										/>
									)}
								/>
							</Box>

							<Controller
								name="descripcion"
								control={control}
								rules={{
									required: 'La descripción es obligatoria',
									minLength: {
										value: 10,
										message: 'La descripción debe tener al menos 10 caracteres',
									},
									maxLength: {
										value: 300,
										message: 'La descripción no puede tener más de 300 caracteres',
									},
								}}
								render={({ field }) => (
									<TextField
										{...field}
										label='Descripción'
										fullWidth
										size="small"
										multiline
										rows={4}
										margin='normal'
										error={!!errors.descripcion}
										helperText={errors.descripcion?.message}
									/>
								)}
							/>

							{cursosRequeridos && (
								<>
									<Typography variant='h6' my={2}>
										Cursos requeridos
									</Typography>
									<Table size='small'>
										<TableHead>
											<TableRow>
												<TableCell>Código</TableCell>
												<TableCell>Nombre</TableCell>
												<TableCell>Agregar</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{cursosRequeridos.map((course) => (
												<TableRow key={course.id}>
													<TableCell>{course.codigo}</TableCell>
													<TableCell>{course.nombre}</TableCell>
													<TableCell>
														<IconButton onClick={() => handleRemoveCourse(course)}>
															<DeleteIcon />
														</IconButton>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</>
							)}

							<Button
								sx={{ mt: 2 }}
								variant='outlined'
								fullWidth
								startIcon={<AddCircleIcon />}
								onClick={() => handleViewChange('requiredCourses')}
							>
								Seleccionar cursos requeridos
							</Button>

							<Box display='flex' justifyContent='space-between' mt={3}>
								<Button variant='outlined' onClick={handleClose}>
									Cancelar
								</Button>
								<Button variant='contained' type='submit'>
									{courseId ? 'Actualizar curso' : 'Crear curso'}{' '}
								</Button>
							</Box>
						</form>
					) : (
						<>
							<Typography variant='h6'>Seleccionar cursos requeridos</Typography>
							<TextField
								label='Buscar curso'
								fullWidth
								size="small"
								margin='normal'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
							/>
							<Table size='small'>
								<TableHead>
									<TableRow>
										<TableCell>Código</TableCell>
										<TableCell>Nombre</TableCell>
										<TableCell>Agregar</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{paginatedCourses.map((course) => (
										<TableRow key={course.id}>
											<TableCell>{course.codigo}</TableCell>
											<TableCell>{course.nombre}</TableCell>
											<TableCell>
												<IconButton onClick={() => handleAddCourseTemp(course)}>
													<AddCircleIcon />
												</IconButton>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>

							{tempCursosRequeridos && (
								<>
									<Typography variant='h6' my={2}>
										Cursos requeridos
									</Typography>
									<Table size='small'>
										<TableHead>
											<TableRow>
												<TableCell>Código</TableCell>
												<TableCell>Nombre</TableCell>
												<TableCell>Agregar</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{tempCursosRequeridos.map((course) => (
												<TableRow key={course.id}>
													<TableCell>{course.codigo}</TableCell>
													<TableCell>{course.nombre}</TableCell>
													<TableCell>
														<IconButton onClick={() => handleRemoveCourseTemp(course)}>
															<DeleteIcon />
														</IconButton>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</>
							)}

							<Box display='flex' justifyContent='space-between' mt={3}>
								<Button variant='outlined' onClick={() => handleViewChange('create')}>
									Atrás
								</Button>
								<Button variant='contained' onClick={handleSaveRequiredCourses}>
									Guardar cursos requeridos
								</Button>
							</Box>
						</>
					)}
				</Box>
			</Box>
		</Modal>
	);
};
