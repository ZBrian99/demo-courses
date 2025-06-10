import React from 'react';
import { Modal, Box, Button, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';

interface UserFormModalProps {
	open: boolean;
	onClose: () => void;
	initialData?: any; // Puede ser el usuario existente para editar
}

const UserFormModal: React.FC<UserFormModalProps> = ({ open, onClose, initialData }) => {
	const { register, handleSubmit, reset } = useForm({
		defaultValues: initialData || {
			nombre: '',
			apellido: '',
			email: '',
			rol: 'USUARIO',
		},
	});

	const onSubmit = (data: any) => {
		// Aquí llamarías al API para crear/editar el usuario
		// console.log(data);
		onClose();
		reset();
	};

	return (
		<Modal open={open} onClose={onClose}>
			<Box sx={{ p: 4, backgroundColor: 'white', borderRadius: 2 }}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<TextField {...register('nombre')} label='Nombre' fullWidth />
					<TextField {...register('apellido')} label='Apellido' fullWidth />
					<TextField {...register('email')} label='Email' fullWidth />
					<TextField {...register('rol')} label='Rol' fullWidth />
					<Button type='submit' variant='contained' color='primary'>
						Guardar
					</Button>
				</form>
			</Box>
		</Modal>
	);
};

export default UserFormModal;
