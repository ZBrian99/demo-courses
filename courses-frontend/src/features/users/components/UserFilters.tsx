// UserFilters.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, TextField } from '@mui/material';

interface FilterData {
	nombre: string;
	email: string;
}

const UserFilters: React.FC = () => {
	const { register, handleSubmit, reset } = useForm<FilterData>();

	const onSubmit = (data: FilterData) => {
		// Aquí iría la lógica para filtrar usuarios
		// console.log('Filtrar con:', data);
	};

	return (
		<Box display='flex' alignItems='center' gap={2} mb={2}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField {...register('nombre')} label='Nombre' />
				<TextField {...register('email')} label='Email' />
				<Button type='submit' variant='contained' color='primary'>
					Aplicar Filtros
				</Button>
				<Button type='button' onClick={() => reset()} variant='outlined'>
					Limpiar Filtros
				</Button>
			</form>
		</Box>
	);
};

export default UserFilters;
