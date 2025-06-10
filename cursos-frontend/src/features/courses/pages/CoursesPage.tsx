import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Divider, Paper, Typography } from '@mui/material';
// import { ActiveCourses } from '../components/ActiveCourses';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Filters as iFilters } from '../types/types';
import { CreateCourseModal } from '../components/CreateCourseModal';
import { useAppDispatch } from '../../../hooks/hooks';
// import { CommissionsList } from '../../comision/components/CommissionsList';
// import CreateCommissionModal from '../../comision/components/CreateCommissionModal';
// import { Filters } from '../../comision/components/Filters';
// import { fetchCommissions } from '../../comision/slices/commissionsSlice';
import { AddCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { CoursesList2 } from '../components/CoursesList2';
import { setBreadcrumbs } from '../../appState/slices/appStateSlice';
import { useGetCoursesQuery } from '../api/coursesApi';
import CustomPagination from '../../../components/CustomPagination';

export const CoursesPage: React.FC = () => {
	const [filters, setFilters] = useState<iFilters>({
		curso: '',
		estado: '',
		modalidad: '',
		profesor: '',
		fechaInicio: null,
		fechaFin: null,
	});

	const [appliedFilters, setAppliedFilters] = useState(filters);
	const [page, setPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(20);
	const [openCreateCourse, setOpenCreateCourse] = useState(false);
	const [openCreateCommission, setOpenCreateCommission] = useState(false);
	const dispatch = useAppDispatch();
	const [courseId, setCourseId] = useState('');
	const [commissionId, setCommissionId] = useState('');
	const [isCardView, setIsCardView] = useState(false); // Estado para controlar la vista
	const navigate = useNavigate();
	const handleFilterChange = (field: string, value: any) => {
		setFilters({ ...filters, [field]: value });
	};

	const clearFilters = () => {
		const initialFilters = {
			curso: '',
			estado: '',
			modalidad: '',
			profesor: '',
			fechaInicio: null,
			fechaFin: null,
		};

		setFilters(initialFilters);
		setAppliedFilters(initialFilters);
		setPage(1);
	};

	const applyFilters = () => {
		setAppliedFilters(filters);
		setPage(1);
		// console.log('Filtros aplicados:', filters);
	};

	const handleCloseCommissionModal = () => {
		setOpenCreateCommission(false);
		setCourseId('');
	};

	const handleOpenEditModal = (id: string) => {
		setCourseId(id); // Establece el ID del curso a editar
		setOpenCreateCourse(true); // Abre el modal
	};

	const handleCloseCourseModal = () => {
		setOpenCreateCourse(false);
		setCourseId(''); // Limpia el ID del curso
	};

	useEffect(() => {
		dispatch(setBreadcrumbs([{ label: 'Cursos', path: '/courses' }]));
	}, []);

	const {
		data: {
			items: courses = [],
			totalItems = 0,
			currentPage = 1,
			totalPages = 1,
			hasNextPage = false,
			hasPreviousPage = false,
			itemsPerPage: limit = 20,
		} = {},
		isLoading,
		isError,
	} = useGetCoursesQuery({
		page,
		limit: itemsPerPage,
		search: filters.curso || undefined,
	});

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	const handleItemsPerPageChange = (newItemsPerPage: number) => {
		setItemsPerPage(newItemsPerPage);
		setPage(1);
	};

	return (
		<>
			<Paper
				sx={{
					display: 'flex',
					flexDirection: 'column',
					padding: '1.5rem',
					borderRadius: { xs: 0, md: '1rem' },
					maxWidth: '80rem',
					mx: 'auto',
					minHeight: '100%',
					flexGrow: 1,
					width: '100%',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: '1rem',
						width: '100%',
						pb: '1rem',
						justifyContent: 'space-between',
						flexWrap: 'wrap',
					}}
				>
					<Typography variant='h4'>Cursos</Typography>
				
						<Button onClick={() => setOpenCreateCourse(true)} variant='contained' startIcon={<AddCircle />}>
							Crear Curso
						</Button>
						{/* <Button onClick={() => navigate('/forms/create')} variant='outlined' startIcon={<AddCircle />}>
							Crear Formulario
						</Button> */}
				</Box>

				<Divider sx={{ mb: '2rem' }} />
				{/* <Filters
					filters={filters}
					handleFilterChange={handleFilterChange}
					clearFilters={clearFilters}
					applyFilters={applyFilters}
				/> */}
				{isLoading ? (
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							padding: '2rem',
							borderRadius: '1rem',
							maxWidth: '80rem',
							mx: 'auto',
							minHeight: '20rem',
						}}
					>
						<CircularProgress />
						<Typography variant='h6' sx={{ mt: 2 }}>
							Cargando cursos y comisiones...
						</Typography>
					</Box>
				) : courses.length === 0 ? (
					<Typography
						sx={{
							textAlign: 'center',
						}}
						variant='h6'
					>
						No hay cursos creados.
					</Typography>
				) : (
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem',flexGrow: 1 }}>
						<CoursesList2
							courses={courses}
							filters={filters}
							openModal={handleOpenEditModal}
							setCourseId={setCourseId}
						/>

						<CustomPagination
							currentPage={currentPage}
							totalItems={totalItems}
							itemsPerPage={itemsPerPage}
							totalPages={totalPages}
							hasNextPage={hasNextPage}
							hasPreviousPage={hasPreviousPage}
							onPageChange={handlePageChange}
							onItemsPerPageChange={handleItemsPerPageChange}
						/>
					</Box>
				)}

				<CreateCourseModal open={openCreateCourse} onClose={handleCloseCourseModal} courseId={courseId} />
			</Paper>

			{/* <Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					padding: '2rem',
					gap: '1rem',
				}}
			>
				<CreateCourseModal open={openCreateCourse} onClose={handleCloseCourseModal} />
				<CreateCommissionModal
					open={openCreateCommission}
					onClose={handleCloseCommissionModal}
					commission={commissionId ? commissions.find((c) => c.id === commissionId) : undefined}
				/>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						gap: '1rem',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							flexDirection: { xs: 'column', md: 'row' },
							gap: '1rem',
						}}
					>
						<Button variant='contained' startIcon={<AddCircleIcon />} onClick={() => setOpenCreateCourse(true)}>
							Crear curso
						</Button>
						<Button variant='outlined' startIcon={<AddCircleIcon />} onClick={() => navigate('/forms/create')}>
							Crear formulario
						</Button>
					</Box>
				</Box>
				<Box>
					{/* <CommissionsList
						commissions={commissions}
						filters={appliedFilters}
						handleEditCommission={handleEditCommission}
						isCardView={isCardView}
					/> */}
			{/* </Box> */}
			{/* </Box> */}
		</>
	);
};

export default CoursesPage;
