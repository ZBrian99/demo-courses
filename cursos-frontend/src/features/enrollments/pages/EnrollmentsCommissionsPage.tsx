import { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Divider, Dialog, DialogContent} from '@mui/material';
import CustomPagination from '../../../components/CustomPagination';
import { useLocation, useNavigate } from 'react-router-dom';
import { CommissionsFiltersQuery } from '../types/enrollmentsTypes';
import { useGetCommissionsWithEnrollmentsQuery } from '../api/enrollmentsApi';
import { EnrollmentsCommissionsList } from '../components/EnrollmentsCommissionsList';
import { EnrollmentsCommissionsFilters } from '../components/EnrollmentsCommissionsFilters';
import { cleanFilters } from '../utils/cleanFilters';
import { useAppDispatch } from '../../../hooks/hooks';
import { setBreadcrumbs } from '../../appState/slices/appStateSlice';

const CommissionsPage: React.FC = () => {
	const dispatch = useAppDispatch();
	const location = useLocation();
	const navigate = useNavigate();

	const params = new URLSearchParams(location.search);
	const initialPage = parseInt(params.get('page') || '', 10) || 1;
	const initialLimit = parseInt(params.get('limit') || '', 10) || 20;

	const [filters, setFilters] = useState<CommissionsFiltersQuery>({
		page: initialPage,
		limit: initialLimit,
		search: undefined,
		status: undefined,
		fechaInicio: undefined,
		fechaFin: undefined,
	});

	const [linkDialogOpen, setLinkDialogOpen] = useState(false);
	const [currentLink, setCurrentLink] = useState('');

	const handleCopyLinkError = (link: string) => {
		setCurrentLink(link);
		setLinkDialogOpen(true);
	};

	const {
		data: { items = [], totalItems, currentPage, totalPages, hasNextPage, hasPreviousPage } = {},
		isLoading,
		isFetching,
		isError,
	} = useGetCommissionsWithEnrollmentsQuery(cleanFilters<CommissionsFiltersQuery>(filters));

	const handleFilterChange = (newFilters: CommissionsFiltersQuery) => {
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
		dispatch(setBreadcrumbs([{ label: 'Inscripciones', path: '/enrollments' }]));
	}, []);

	useEffect(() => {
		const params = new URLSearchParams();
		params.set('page', String(filters.page));
		params.set('limit', String(filters.limit));
		navigate(`${location.pathname}?${params.toString()}`, { replace: true });
	}, [filters.page, filters.limit]);

	useEffect(() => {
		window.scrollTo({ top: 0 });
	}, [filters]);

	return (
		<Paper
			sx={{
				display: 'flex',
				flexDirection: 'column',
				borderRadius: { xs: 0, md: '1rem' },
				maxWidth: '80rem',
				width: '100%',
				mx: 'auto',
				padding: '1.5rem',
				gap: '1rem',
				flexGrow: 1,
				bgcolor: 'common.white',
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<Typography color='gray.900' variant='h4'>
					Inscripciones
				</Typography>
			</Box>
			<Divider />

			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: '.5rem',
					width: '100%',
					justifyContent: 'space-between',
					flexWrap: 'wrap',
					borderRadius: '.5rem',
					backgroundColor: 'common.white',
				}}
			>
				<EnrollmentsCommissionsFilters onFilterChange={handleFilterChange} />
			</Box>

			<Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', mt: '1rem', flexGrow: 1 }}>
				{isLoading ? (
					<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, p: '1rem' }}>
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
						<Typography color='error'>Error al cargar las comisiones.</Typography>
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
						<Typography>No se encontraron comisiones.</Typography>
					</Box>
				) : (
					<>
						<EnrollmentsCommissionsList commissions={items} onCopyLinkError={handleCopyLinkError} />
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

			<Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)} maxWidth='sm' fullWidth>
				<DialogContent>
					<Typography
						component='a'
						href={currentLink}
						target='_blank'
						sx={{
							userSelect: 'all',
							wordBreak: 'break-all',
							whiteSpace: 'pre-wrap',
						}}
					>
						{currentLink}
					</Typography>
				</DialogContent>
			</Dialog>
		</Paper>
	);
};

export default CommissionsPage;
