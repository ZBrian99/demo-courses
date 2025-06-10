import React, { useState, useEffect } from 'react';
import { Box, Button, CircularProgress, Divider, Paper, Typography } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { useAppDispatch } from '../../../hooks/hooks';
import { useGetStudentsQuery } from '../api/usersApi';
import CreateUserModal from '../components/CreateUserModal';
import { UsersList } from '../components/UsersList';
import { setBreadcrumbs } from '../../appState/slices/appStateSlice';
import { UsersFiltersQuery } from '../types/types';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomPagination from '../../../components/CustomPagination';
import { UsersFilters } from '../components/UsersFilters';
import { cleanFilters } from '../utils/cleanFilters';

const StudentsPage: React.FC = () => {
	const dispatch = useAppDispatch();
	const location = useLocation();
	const navigate = useNavigate();

	const params = new URLSearchParams(location.search);
	const initialPage = parseInt(params.get('page') || '', 10) || 1;
	const initialLimit = parseInt(params.get('limit') || '', 10) || 20;

	const [filters, setFilters] = useState<UsersFiltersQuery>({
		page: initialPage,
		limit: initialLimit,
		search: undefined,
	});

	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	const {
		data: {
			items = [],
			totalItems = 0,
			currentPage = 1,
			totalPages = 1,
			hasNextPage = false,
			hasPreviousPage = false,
		} = {},
		isLoading,
		isFetching,
		isError,
	} = useGetStudentsQuery(cleanFilters<UsersFiltersQuery>(filters));

	const handleFilterChange = (newFilters: UsersFiltersQuery) => {
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
		dispatch(setBreadcrumbs([{ label: 'Alumnos', path: '/students' }]));
	}, []);

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
	return (
		<Paper
			sx={{
				display: 'flex',
				flexDirection: 'column',
				borderRadius: { xs: 0, md: '1rem' },
				maxWidth: '80rem',
				width: '100%',
				mx: 'auto',
				// minHeight: '100%',
				padding: '1.5rem',
				gap: '1rem',
				flexGrow: 1,
				bgcolor: 'common.white',
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<Typography color='gray.900' variant='h4'>
					Alumnos
				</Typography>
				{/* <Button variant='contained' startIcon={<AddCircle />} onClick={() => setIsCreateModalOpen(true)}>
					Crear Alumno
				</Button> */}
			</Box>
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
				<UsersFilters onFilterChange={handleFilterChange} showRoleFilter={false} />
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
						<Typography color='error'>Error al cargar los usuarios.</Typography>
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
						<Typography>No se encontraron usuarios.</Typography>
					</Box>
				) : (
					<>
						<UsersList users={items} />

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
			{/* <CreateUserModal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} /> */}
		</Paper>
	);
};

export default StudentsPage;
