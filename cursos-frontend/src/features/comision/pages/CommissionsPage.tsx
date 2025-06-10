import React, { useEffect, useState } from 'react';
import { Box, Button, Divider, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Filters as iFilters } from '../types/types';
import CreateCommissionModal from '../components/CreateCommissionModal';
import { CommissionsList } from '../components/CommissionsList';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { fetchCommissions } from '../slices/commissionsSlice';
import { Filters } from '../components/Filters';
import { GridView, Search, ViewList } from '@mui/icons-material';
import { setBreadcrumbs } from '../../appState/slices/appStateSlice';
import CustomPagination from '../../../components/CustomPagination';

const CommissionsPage: React.FC = () => {
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
	const [openCreateCommission, setOpenCreateCommission] = useState(false);
	const dispatch = useAppDispatch();
	const [commissionId, setCommissionId] = useState('');
	const commissions = useAppSelector((state) => state.commissions.commissions);
	const pagination = useAppSelector((state) => state.commissions.pagination);
	const [isCardView, setIsCardView] = useState(false); // Estado para controlar la vista

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
	};

	const handleCloseModal = () => {
		setOpenCreateCommission(false);
		setCommissionId('');
	};
	const handleCloseCreateCommission = () => {
		setCommissionId('');
		setOpenCreateCommission(false);
	};

	const handleEditCommission = (commissionId: string) => {
		setCommissionId(commissionId);
		setOpenCreateCommission(true);
	};
	useEffect(() => {
		dispatch(setBreadcrumbs([{ label: 'Comisiones', path: '/commissions' }]));
		dispatch(fetchCommissions({ page, itemsPerPage }));
	}, [page, itemsPerPage]);

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	const handleItemsPerPageChange = (newItemsPerPage: number) => {
		setItemsPerPage(newItemsPerPage);
		setPage(1); // Reset a la primera página cuando cambia el número de items
	};

	return (
		<Paper
			sx={{
				display: 'flex',
				flexDirection: 'column',
				padding: '1.5rem',
				borderRadius: { xs: 0, md: '1rem' },
				width: '100%',
				maxWidth: '80rem',
				mx: 'auto',
				minHeight: '100%',
				flexGrow: 1,
			}}
		>
			{/* <CreateCommissionModal2 open={openCreateCommission} onClose={handleCloseModal} commissionId={commissionId} /> */}
			<CreateCommissionModal
				open={openCreateCommission}
				onClose={handleCloseCreateCommission}
				commission={commissionId ? commissions.find((c) => c.id === commissionId) : undefined}
			/>

			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					gap: '1rem',
					mb: '1rem',
					flexWrap: 'wrap',
				}}
			>
				<Typography variant='h4'>Comisiones</Typography>
				<Button variant='contained' startIcon={<AddCircleIcon />} onClick={() => setOpenCreateCommission(true)}>
					Crear comisión
				</Button>
			</Box>
			<Divider sx={{ mb: '2rem' }} />

			<Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1 }}>
				{/* <Filters
					filters={filters}
					handleFilterChange={handleFilterChange}
					clearFilters={clearFilters}
					applyFilters={applyFilters}
				/> */}
				{/* <Box
					sx={{
						width: '100%',
						mb: '1rem',
						display: 'flex',
						gap: '.5rem',
					}}
				>
					<Button
						onClick={() => setIsCardView(false)}
						variant={!isCardView ? 'contained' : 'outlined'}
						sx={{
							ml: 'auto',
							minWidth: '40px',
							maxWidth: '40px',
							minHeight: '40px',
						}}
					>
						<ViewList />
					</Button>
					<Button
						onClick={() => setIsCardView(true)}
						variant={isCardView ? 'contained' : 'outlined'}
						sx={{
							minWidth: '40px',
							maxWidth: '40px',
							minHeight: '40px',
						}}
					>
						<GridView />
					</Button>
				</Box> */}
				<CommissionsList
					commissions={commissions}
					filters={appliedFilters}
					handleEditCommission={handleEditCommission}
					isCardView={isCardView}
				/>

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
	);
};

export default CommissionsPage;
