import React, { useEffect, useState } from 'react';
import {
	Box,
	Typography,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	IconButton,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormContext, useWatch } from 'react-hook-form';
import CustomPagination from '../../../components/CustomPagination';
import { Role, User } from '../../users/types/types';
import { useGetStaffQuery } from '../../users/api/usersApi';
import { CustomSearchInput } from '../../../components/inputs/CustomSearchInput';

const StepForm2: React.FC = () => {
	const { setValue, control } = useFormContext();
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(5);
	const [activeSearch, setActiveSearch] = useState('');
	const searchTerm = useWatch({ control, name: 'searchProfesores' }) || '';

	const { data: staffData } = useGetStaffQuery({
		page: currentPage,
		limit: itemsPerPage,
		search: activeSearch,
		rol: Role.PROFESOR
	});

	const selectedProfesores = useWatch({
		control,
		name: 'profesores',
	}) || [];

	const handleSearch = () => {
		setCurrentPage(1);
		setActiveSearch(searchTerm);
	};

	const handleClearSearch = () => {
		setCurrentPage(1);
		setActiveSearch('');
	};

	const handleAddProfesor = (profesor: User) => {
		const isAlreadyAdded = selectedProfesores.some((p: User) => p.id === profesor.id);
		if (!isAlreadyAdded) {
			setValue('profesores', [...selectedProfesores, profesor]);
		}
	};

	const handleRemoveProfesor = (id: string) => {
		const updatedProfesores = selectedProfesores.filter((p: User) => p.id !== id);
		setValue('profesores', updatedProfesores);
  };
 

	return (
		<Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
			<CustomSearchInput
				name="searchProfesores"
				label="Buscar profesores"
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
						<TableCell>Agregar</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{staffData?.items.map((profesor: User) => (
						<TableRow key={profesor.id}>
							<TableCell>{profesor.nombre}</TableCell>
							<TableCell>{profesor.apellido}</TableCell>
							<TableCell>{profesor.dni}</TableCell>
							<TableCell>
								<IconButton onClick={() => handleAddProfesor(profesor)}>
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

			<Typography variant='subtitle1' fontWeight='bold' mt={3}>
				Profesores agregados
			</Typography>
			{selectedProfesores.length > 0 ? (
				selectedProfesores.map((profesor: User, index: React.Key | null | undefined) => (
					<Box key={index} display='flex' justifyContent='space-between' mt={2}>
						<Typography>
							{profesor?.nombre || 'N/A'} {profesor?.apellido || 'N/A'} - {profesor?.dni || 'N/A'}
						</Typography>
						<IconButton onClick={() => handleRemoveProfesor(profesor.id)}>
							<DeleteIcon />
						</IconButton>
					</Box>
				))
			) : (
				<Typography>No hay profesores agregados.</Typography>
			)}
		</Box>
	);
};

export default StepForm2;
