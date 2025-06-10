import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Paper, Avatar, Chip, Divider } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomPagination from '../../../components/CustomPagination';
import { useGetStaffQuery } from '../../users/api/usersApi';
import { Role, User } from '../../users/types/types';
import { CustomSearchInput } from '../../../components/inputs/CustomSearchInput';

const StepFormVendedores: React.FC = () => {
	const { setValue, control } = useFormContext();
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(5);
	const [activeSearch, setActiveSearch] = useState('');
	const searchTerm = useWatch({ control, name: 'searchVendedores' }) || '';

	const { data: staffData } = useGetStaffQuery({
		page: currentPage,
		limit: itemsPerPage,
		search: activeSearch,
		rol: Role.VENDEDOR
	});

	const selectedVendedores = useWatch({
		control,
		name: 'vendedores',
	}) || [];

	const handleSearch = () => {
		setCurrentPage(1);
		setActiveSearch(searchTerm);
	};

	const handleClearSearch = () => {
		setCurrentPage(1);
		setActiveSearch('');
	};

	const handleAddVendedor = (vendedor: User) => {
		const isAlreadyAdded = selectedVendedores.some((v: User) => v.id === vendedor.id);
		if (!isAlreadyAdded) {
			setValue('vendedores', [...selectedVendedores, vendedor]);
		}
	};

	const handleRemoveVendedor = (id: string) => {
		const updatedVendedores = selectedVendedores.filter((v: User) => v.id !== id);
		setValue('vendedores', updatedVendedores);
	};

	return (
		<Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
			<CustomSearchInput
				name="searchVendedores"
				label="Buscar vendedores"
				fullWidth
				onClick={handleSearch}
				onClear={handleClearSearch}
			/>

			<Table size='small'>
				<TableHead>
					<TableRow>
						<TableCell>Nombre</TableCell>
						<TableCell>Apellido</TableCell>
						<TableCell>DNI</TableCell>
						<TableCell align="center">Agregar</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{staffData?.items.map((vendedor: User) => (
						<TableRow key={vendedor.id}>
							<TableCell>{vendedor.nombre}</TableCell>
							<TableCell>{vendedor.apellido}</TableCell>
							<TableCell>{vendedor.dni}</TableCell>
							<TableCell align="center">
								<IconButton onClick={() => handleAddVendedor(vendedor)} color="primary" size="small">
									<AddCircleIcon />
								</IconButton>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<CustomPagination
				small
				currentPage={currentPage}
				itemsPerPage={itemsPerPage}
				totalItems={staffData?.totalItems || 0}
				totalPages={staffData?.totalPages || 1}
				hasNextPage={staffData?.hasNextPage || false}
				hasPreviousPage={staffData?.hasPreviousPage || false}
				onPageChange={setCurrentPage}
				onItemsPerPageChange={setItemsPerPage}
			/>

			<Box sx={{ mt: 2 }}>
				<Typography variant='subtitle1' fontWeight='bold' gutterBottom>
					Vendedores agregados
				</Typography>
				<Divider sx={{ mb: 2 }} />
				
				{selectedVendedores.length > 0 ? (
					<Box sx={{ 
						display: 'flex', 
						flexDirection: 'column',
						gap: '0.25rem'
					}}>
						{selectedVendedores.map((vendedor: User) => (
							<Paper
								key={vendedor.id}
								elevation={0}
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									p: '0.5rem 0.75rem',
									backgroundColor: 'background.default',
									borderRadius: '0.5rem',
									transition: 'all 0.2s',
									'&:hover': {
										backgroundColor: 'action.hover',
									}
								}}
							>
								<Box sx={{ 
									display: 'flex', 
									alignItems: 'center', 
									gap: '0.5rem',
									color: 'text.secondary',
									typography: 'body2'
								}}>
									<span>{vendedor.nombre} {vendedor.apellido}</span>
									<span>·</span>
									<span>DNI: {vendedor.dni}</span>
								</Box>
								<IconButton 
									onClick={() => handleRemoveVendedor(vendedor.id)}
									sx={{ 
										color: 'text.secondary',
										p: '0.25rem',
										'&:hover': {
											color: 'error.main'
										}
									}}
									size="small"
								>
									<DeleteIcon fontSize="small" />
								</IconButton>
							</Paper>
						))}
					</Box>
				) : (
					<Typography color='text.secondary' align='center'>
						No hay vendedores agregados
					</Typography>
				)}
			</Box>
		</Box>
	);
};

export default StepFormVendedores;
