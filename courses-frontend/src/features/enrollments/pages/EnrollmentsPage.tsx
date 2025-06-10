import { useEffect, useRef, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Button, Divider } from '@mui/material';
import { useGetEnrollmentsQuery } from '../api/enrollmentsApi';
import { EnrollmentsFiltersQuery } from '../types/enrollmentsTypes';
import { EnrollmentsFilters } from '../components/EnrollmentsFilters';
// import { EnrollmentsList } from '../components/EnrollmentsList';
import { cleanFilters } from '../utils/cleanFilters';
import CustomPagination from '../../../components/CustomPagination';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../../../hooks/hooks';
import { setBreadcrumbs } from '../../appState/slices/appStateSlice';
import EnrollmentsListNew from '../components/EnrollmentsListNew';

const EnrollmentPage: React.FC = () => {
	const dispatch = useAppDispatch();
	const { comisionId } = useParams<{ comisionId: string }>(); // Extraer comisionId de los parámetros de la URL
// nuevo compentario de prueba
	const location = useLocation();
	const navigate = useNavigate();

	const params = new URLSearchParams(location.search);
	const initialPage = parseInt(params.get('page') || '', 10) || 1;
	const initialLimit = parseInt(params.get('limit') || '', 10) || 20;

	const [filters, setFilters] = useState<EnrollmentsFiltersQuery>({
		comisionId,
		page: initialPage,
		limit: initialLimit,
		search: undefined,
		status: undefined,
		fechaInicio: undefined,
		fechaFin: undefined,
	});

	const {
		data: { items = [], totalItems, currentPage, totalPages, hasNextPage, hasPreviousPage } = {},
		isLoading,
		isFetching,
		isError,
	} = useGetEnrollmentsQuery(cleanFilters<EnrollmentsFiltersQuery>(filters));

	// const handleFilterChange = (newFilters: EnrollmentsFiltersQuery) => {
	// 	setFilters((prevFilters) => ({
	// 		...newFilters,
	// 		page: newFilters.page ? newFilters.page : prevFilters.page,
	// 		limit: prevFilters.limit,
	// 	}));
	// };

	const handleFilterChange = (newFilters: EnrollmentsFiltersQuery) => {
		setFilters((prevFilters) => ({
			...prevFilters,
			...newFilters,
		}));
	};

	const handlePageChange = (page: number) => {
		setFilters((prevFilters) => ({ ...prevFilters, page }));
	};

	const handleItemsPerPageChange = (itemsPerPage: number) => {
		setFilters((prevFilters) => ({ ...prevFilters, limit: itemsPerPage, page: 1 }));
	};

	useEffect(() => {
		const params = new URLSearchParams();
		params.set('page', String(filters.page));
		params.set('limit', String(filters.limit));

		navigate(`${location.pathname}?${params.toString()}`, { replace: true });
	}, [filters.page, filters.limit]);

	useEffect(() => {
		window.scrollTo({
			top: 0,
		});
	}, [filters]);

	useEffect(() => {
		dispatch(
			setBreadcrumbs([
				{ label: 'Inscripciones', path: '/enrollments' },
				{ label: 'Comision', path: `/enrollments/${comisionId}` },
			])
		);
	}, []);

	return (
		<Paper
			sx={{
				display: 'flex',
				flexDirection: 'column',
				borderRadius: { xs: 0, md: '1rem' },
				maxWidth: '100rem',
				width: '100%',
				mx: 'auto',
				// minHeight: '100%',
				padding: '1.5rem',
				gap: '1rem',
				flexGrow: 1,
				bgcolor: 'common.white',
			}}
		>
			{/* <Button
				sx={{
					position: 'fixed',
					right: '1rem',
					bottom: '1rem',
					zIndex: 1,
					backgroundColor: 'black',
					color: 'white',
					borderRadius: '1rem',
					padding: '0.5rem',
				}}
				onClick={() => {
					console.log('Scroll to top triggered');
					window.scrollTo({
						top: 0,
						behavior: 'smooth', // Para un desplazamiento suave
					});
				}}
			>
				Ariba
			</Button> */}
			{/* <Paper
			sx={{
				display: 'flex',
				flexDirection: 'column',
				padding: '1rem',
				borderRadius: '1rem',
				maxWidth: '80rem',
				mx: 'auto',
				minHeight: '100%',
			}}
		> */}
			<Typography color='gray.900' variant='h4'>
				Inscriptos
			</Typography>
			<Divider />
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: '.trem',
					width: '100%',
					// p: '.5rem',
					justifyContent: 'space-between',
					flexWrap: 'wrap',
					borderRadius: '.5rem',
					backgroundColor: 'common.white',
				}}
			>
				<EnrollmentsFilters onFilterChange={handleFilterChange} />
			</Box>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: '1rem',
					// overflow: 'hidden',
					borderRadius: '1rem',
					flexGrow: 1,
					backgroundColor: 'common.white',
				}}
			>
				{isLoading ? (
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							flexGrow: 1,
							p: '1rem',
						}}
					>
						<CircularProgress />
					</Box>
				) : isError ? (
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							textAlign: 'center',
							flexGrow: 1,
							p: '1rem',
						}}
					>
						<Typography color='error'>Error al cargar las inscripciones.</Typography>
					</Box>
				) : items.length === 0 ? (
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							textAlign: 'center',
							flexGrow: 1,
							p: '1rem',
						}}
					>
						<Typography>No se encontraron inscripciones.</Typography>
					</Box>
				) : (
					<>
						{/* <EnrollmentsList enrollments={items} /> */}
						<EnrollmentsListNew enrollments={items} />
						<CustomPagination
							currentPage={currentPage}
							totalItems={totalItems}
							itemsPerPage={filters.limit!}
							totalPages={totalPages}
							hasNextPage={hasNextPage}
							hasPreviousPage={hasPreviousPage}
							onPageChange={handlePageChange}
							onItemsPerPageChange={handleItemsPerPageChange}
						/>
					</>
				)}
			</Box>
		</Paper>
	);
};

export default EnrollmentPage;
