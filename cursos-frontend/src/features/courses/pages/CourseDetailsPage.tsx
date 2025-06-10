import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
	Box, 
	Button, 
	Typography, 
	TextField, 
	InputAdornment, 
	Paper, 
	IconButton, 
	Chip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	useTheme,
	useMediaQuery,
	Divider,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomPagination from '../../../components/CustomPagination';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { fetchCommissionsByCourseId } from '../../comision/slices/commissionsSlice';
import { CourseCommissionsList } from '../components/CourseCommissionsList';
import { CreateCourseModal } from '../components/CreateCourseModal';
import { setBreadcrumbs, showSnackbar } from '../../appState/slices/appStateSlice';
import CreateCommissionModal from '../../comision/components/CreateCommissionModal';
import { useGetCourseByIdQuery, useDeleteCourseMutation } from '../api/coursesApi';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorMessage from '../../../components/ErrorMessage';

const CourseDetailsPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const dispatch = useAppDispatch();
	const commissions = useAppSelector((state) => state.commissions.commissions);
	const pagination = useAppSelector((state) => state.commissions.pagination);
	const { data: course, isLoading: isLoadingCourse } = useGetCourseByIdQuery(id || '');
	const [deleteCourse] = useDeleteCourseMutation();
	const [openCreateCourse, setOpenCreateCourse] = useState(false);
	const [openCreateCommission, setOpenCreateCommission] = useState(false);
	const [selectedCommissionId, setSelectedCommissionId] = useState<string | null>(null);
	const [isDuplicated, setIsDuplicated] = useState(false);
	const navigate = useNavigate();

	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(20);

	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const isTablet = useMediaQuery(theme.breakpoints.down('md'));

	useEffect(() => {
		if (id) {
			dispatch(fetchCommissionsByCourseId({ courseId: id, page: currentPage, itemsPerPage }));
		}
	}, [id, currentPage, itemsPerPage]);

	useEffect(() => {
		if (course) {
			dispatch(
				setBreadcrumbs([
					{ label: 'Cursos', path: '/courses' },
					{ label: course?.nombre, path: `/courses/${id}` },
				])
			);
		}
	}, [course]);

	if (isLoadingCourse) {
		return <LoadingSpinner />;
	}

	if (!course) {
		return <ErrorMessage message='Curso no encontrado' />;
	}

	const filteredCommissions = commissions.filter(
		(commission) =>
			commission.codigoComision?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			commission.modalidad?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	};

	const handleItemsPerPageChange = (newItemsPerPage: number) => {
		setItemsPerPage(newItemsPerPage);
		setCurrentPage(1);
	};

	const handleEditCommission = (commissionId: string) => {
		setSelectedCommissionId(commissionId);
		setOpenCreateCommission(true);
	};

	const handleDuplicateCommission = (commissionId: string) => {
		setSelectedCommissionId(commissionId);
		setIsDuplicated(true);
		setOpenCreateCommission(true);
	};

	const handleCreateCommission = () => {
		setSelectedCommissionId(null);
		setIsDuplicated(false);
		setOpenCreateCommission(true);
	};

	const handleDeleteCourse = async () => {
		if (!id) return;
		try {
			await deleteCourse(id).unwrap();
			navigate('/courses');
			dispatch(
				showSnackbar({
					message: 'Curso eliminado correctamente',
					severity: 'success',
				})
			);
		} catch (error) {
			dispatch(
				showSnackbar({
					message: 'Error al eliminar el curso',
					severity: 'error',
				})
			);
		}
	};

	const handleCloseCreateCommission = () => {
		setSelectedCommissionId(null);
		setOpenCreateCommission(false);
		setIsDuplicated(false);
	};

	const handleDeleteClick = () => {
		setOpenDeleteDialog(true);
	};

	const handleDeleteConfirm = async () => {
		await handleDeleteCourse();
		setOpenDeleteDialog(false);
	};

	const handleDeleteCancel = () => {
		setOpenDeleteDialog(false);
	};

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: '1rem',
				maxWidth: '80rem',
				mx: 'auto',
				width: '100%',
				flexGrow: 1,
			}}
		>
			<Paper
				sx={{
					p: { xs: '1rem', sm: '1.5rem', md: '2rem' },
            borderRadius: { xs: 0, md: '1rem' },
					backgroundColor: 'background.default',
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				<Box 
					display='flex' 
					justifyContent='space-between' 
					flexWrap='wrap' 
					gap='2rem'
					
				>
					<Box 
						flex='1' 
						minWidth={{ xs: '100%', md: '300px' }}
						display='flex'
            flexDirection='column'
				
					>
						<Box 
							display='flex' 
							alignItems='center' 
							gap='1rem' 
							mb='1rem'
							flexWrap='wrap'
						>
							<Chip 
								label={course.codigo} 
								color='primary' 
								variant='outlined' 
								size='small' 
							/>
							<Typography
								variant='h4'
								sx={{
									fontWeight: 'bold',
									color: 'text.primary',
									fontSize: { xs: '1.5rem', sm: '2rem' },
								}}
							>
								{course.nombre}
							</Typography>
						</Box>
						
						<Typography
							variant='body1'
							color='text.secondary'
							sx={{
								mb: '2rem',
								lineHeight: 1.6,
							}}
						>
							{course.descripcion}
						</Typography>

						<Box 
							display='flex' 
							gap='1rem'
              flexWrap='wrap'
              mt='auto'
						>
							<Button
								variant='outlined'
								startIcon={<EditIcon />}
								onClick={() => setOpenCreateCourse(true)}
								size='small'
							>
								Editar Curso
							</Button>
							<Button
								variant='outlined'
								color='error'
								startIcon={<DeleteIcon />}
								onClick={handleDeleteClick}
								size='small'
							>
								Eliminar Curso
							</Button>
						</Box>
					</Box>

					<Paper
						sx={{
							p: '1.5rem',
							borderRadius: '0.75rem',
              // backgroundColor: 'background.paper',
              width: { xs: '100%', md: '300px' },
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
              backgroundColor: 'background.paper',
              color: 'text.primary',
              
						}}
					>
						<Typography
							variant='h6'
							sx={{
								mb: '1rem',
								color: 'text.primary',
								fontSize: '1.1rem',
							}}
						>
							Requisitos del curso
						</Typography>
						{(course.cursosRequeridos ?? []).length > 0 ? (
							<Box
								sx={{
									display: 'flex',
									flexWrap: 'wrap',
                  gap: '0.5rem',
                  
								}}
							>
								{course.cursosRequeridos?.map((req) => (
									<Link 
										key={req.id} 
										to={`/courses/${req.id}`} 
										style={{ 
											textDecoration: 'none',
											flex: '1',
											minWidth: '200px',
										}}
									>
										<Paper
											elevation={0}
											sx={{
												p: '0.5rem 0.75rem',
												borderRadius: '0.5rem',
												transition: 'all 0.2s',
												display: 'flex',
												alignItems: 'center',
												gap: '0.5rem',
                        border: '1px solid',
                        borderColor: 'divider',
												'&:hover': {
													backgroundColor: 'action.hover',
												},
											}}
										>
											<Typography 
												variant='subtitle2' 
												color='primary'
												sx={{
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
												}}
											>
												{req.nombre}
											</Typography>
											<Typography 
												variant='caption' 
												color='text.secondary'
												sx={{
													whiteSpace: 'nowrap',
												}}
											>
												({req.codigo})
											</Typography>
										</Paper>
									</Link>
								))}
							</Box>
						) : (
							<Typography color='text.secondary'>
								Este curso no tiene requisitos previos
							</Typography>
						)}
					</Paper>
				</Box>
			</Paper>

			<Paper
				sx={{
					p: { xs: '1rem', sm: '1.5rem', md: '2rem' },
					borderRadius: { xs: 0, md: '1rem' },
					backgroundColor: 'background.default',
				}}
			>
				<Box 
					display='flex' 
					justifyContent='space-between' 
					alignItems='center' 
					mb='.5rem' 
					flexWrap='wrap' 
					gap='1rem'
				>
					<Typography 
						variant='h5' 
						sx={{ 
							fontWeight: 'medium',
							fontSize: { xs: '1.25rem', sm: '1.5rem' },
						}}
					>
						Comisiones del curso
					</Typography>
					<Box 
						display='flex' 
						gap='1rem' 
						alignItems='center'
						flexWrap='wrap'
						width={{ xs: '100%', sm: 'auto' }}
					>
						<TextField
							variant='outlined'
							size='small'
							placeholder='Buscar comisión...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							InputProps={{
								startAdornment: (
									<InputAdornment position='start'>
										<SearchIcon color='action' />
									</InputAdornment>
								),
							}}
							sx={{
								flex: { xs: 1, sm: 'initial' },
								minWidth: { sm: '250px' },
								'& .MuiOutlinedInput-root': {
									borderRadius: '0.5rem',
								},
							}}
						/>
						<Button
							variant='contained'
							startIcon={<AddCircleIcon />}
							onClick={handleCreateCommission}
							sx={{ 
								whiteSpace: 'nowrap',
								width: { xs: '100%', sm: 'auto' },
							}}
						>
							Nueva comisión
						</Button>
					</Box>
				</Box>

				<Divider sx={{ mb: '2rem' }} />

				<CourseCommissionsList
					commissions={filteredCommissions}
					courseId={id!}
					handleDuplicateCommission={handleDuplicateCommission}
          onEditCommission={handleEditCommission}
          isCardView={false}
				/>

				<Box mt='2rem'>
					<CustomPagination
						currentPage={pagination.currentPage}
						totalItems={pagination.totalItems}
						itemsPerPage={itemsPerPage}
						totalPages={pagination.totalPages}
						hasNextPage={pagination.hasNextPage}
						hasPreviousPage={pagination.hasPreviousPage}
						onPageChange={handlePageChange}
						onItemsPerPageChange={handleItemsPerPageChange}
					/>
				</Box>
			</Paper>

			<Dialog
				open={openDeleteDialog}
				onClose={handleDeleteCancel}
				maxWidth="xs"
				fullWidth
			>
				<DialogTitle>Confirmar eliminación</DialogTitle>
				<DialogContent>
					<Typography>
						¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDeleteCancel}>
						Cancelar
					</Button>
					<Button onClick={handleDeleteConfirm} color="error" variant="contained">
						Eliminar
					</Button>
				</DialogActions>
			</Dialog>

			<CreateCourseModal 
				open={openCreateCourse} 
				onClose={() => setOpenCreateCourse(false)} 
				courseId={id} 
			/>

			<CreateCommissionModal
				open={openCreateCommission}
				onClose={handleCloseCreateCommission}
				course={course}
				commission={selectedCommissionId ? commissions.find((c) => c.id === selectedCommissionId) : undefined}
				isDuplicate={isDuplicated}
			/>
		</Box>
	);
};

export default CourseDetailsPage;
