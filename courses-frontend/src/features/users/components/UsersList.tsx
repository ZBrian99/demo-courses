import React, { useCallback, memo } from 'react';
import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	IconButton,
	CircularProgress,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Tooltip,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { User } from '../types/types';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../hooks/hooks';
import { useDeleteUserMutation } from '../api/usersApi';
import { showSnackbar } from '../../appState/slices/appStateSlice';

interface UsersListProps {
	users: User[];
}

interface Column {
	id: keyof User | 'actions';
	label: string;
	width?: string;
}

const columns: Column[] = [
	{ id: 'nombre', label: 'Nombre' },
	{ id: 'apellido', label: 'Apellido' },
	{ id: 'dni', label: 'DNI' },
	{ id: 'email', label: 'Email' },
	{ id: 'telefono', label: 'Teléfono' },
	{ id: 'pais', label: 'País' },
	{ id: 'rol', label: 'Rol' },
	{ id: 'actions', label: '' },
];

const TableHeader = memo(() => (
	<TableHead>
		<TableRow>
			{columns.map((column) => (
				<TableCell
					key={column.id}
					sx={{
						fontWeight: 500,
						...(column.id === 'actions' && {
							position: 'sticky',
							right: 0,
							zIndex: 3,
							'&::before': {
								content: '""',
								position: 'absolute',
								left: 0,
								top: 0,
								bottom: 0,
								width: '1px',
								backgroundColor: '#DEDFE3',
								zIndex: 1,
							},
						}),
					}}
				>
					{column.label}
				</TableCell>
			))}
		</TableRow>
	</TableHead>
));

const UserRow = memo(
	({ user, onAction }: { user: User; onAction: (action: 'view' | 'edit' | 'delete', user: User) => void }) => (
		<TableRow>
			<TableCell>{user.nombre}</TableCell>
			<TableCell>{user.apellido}</TableCell>
			<TableCell>{user.dni}</TableCell>
			<TableCell>{user.email}</TableCell>
			<TableCell>{user.telefono}</TableCell>
			<TableCell>{user.pais}</TableCell>
			<TableCell>{user.rol}</TableCell>
			<TableCell
				sx={{
					position: 'sticky',
					right: 0,
					backgroundColor: 'inherit',
					padding: '1px',
					paddingLeft: '2px',
					'&::before': {
						content: '""',
						position: 'absolute',
						left: 0,
						top: 0,
						bottom: 0,
						width: '1px',
						backgroundColor: '#DEDFE3',
						zIndex: 1,
					},
				}}
			>
				<Box
					sx={{
						display: 'flex',
						gap: '2px',
						justifyContent: 'center',
					}}
				>
					<Tooltip title='Ver detalles'>
						<IconButton
							onClick={() => onAction('view', user)}
							size='small'
							sx={{
								color: 'text.secondary',
								padding: '.25rem',
							}}
						>
							<Visibility fontSize='small' />
						</IconButton>
					</Tooltip>
					<Tooltip title='Editar'>
						<IconButton
							onClick={() => onAction('edit', user)}
							size='small'
							sx={{
								color: 'text.secondary',
								padding: '.25rem',
							}}
						>
							<Edit fontSize='small' />
						</IconButton>
					</Tooltip>
					<Tooltip title='Eliminar'>
						<IconButton
							onClick={() => onAction('delete', user)}
							size='small'
							sx={{
								color: 'text.secondary',
								padding: '.25rem',
							}}
						>
							<Delete fontSize='small' />
						</IconButton>
					</Tooltip>
				</Box>
			</TableCell>
		</TableRow>
	)
);

export const UsersList: React.FC<UsersListProps> = ({ users }) => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [deleteUser] = useDeleteUserMutation();

	const [deleteDialog, setDeleteDialog] = React.useState<{
		open: boolean;
		user: User | null;
	}>({
		open: false,
		user: null,
	});

	const handleAction = useCallback(
		(action: 'view' | 'edit' | 'delete', user: User) => {
			const basePath = user.rol === 'ALUMNO' ? '/students' : '/staff';
			
			switch (action) {
				case 'view':
					navigate(`${basePath}/view/${user.id}`);
					break;
				case 'edit':
					navigate(`${basePath}/edit/${user.id}`);
					break;
				case 'delete':
					setDeleteDialog({ open: true, user });
					break;
			}
		},
		[navigate]
	);

	const handleConfirmDelete = async () => {
		if (!deleteDialog.user) return;

		try {
			await deleteUser(deleteDialog.user.id).unwrap();
			dispatch(
				showSnackbar({
					message: 'Usuario eliminado correctamente',
					severity: 'success',
				})
			);
		} catch (error: any) {
			dispatch(
				showSnackbar({
					message: error.data?.message || 'Error al eliminar el usuario',
					severity: 'error',
				})
			);
		} finally {
			setDeleteDialog({ open: false, user: null });
		}
	};

	return (
		<>
			<TableContainer
				sx={{
					position: 'relative',
					'& th:nth-last-child(2)': {
						borderRight: 'none',
					},
					'& td:nth-last-child(2)': {
						borderRight: 'none',
					},
				}}
			>
				<Table size='small'>
					<TableHeader />
					<TableBody>
						{users.map((user) => (
							<UserRow key={user.id} user={user} onAction={handleAction} />
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, user: null })}>
				<DialogTitle>Confirmar eliminación</DialogTitle>
				<DialogContent>
					<Typography>
						¿Está seguro que desea eliminar al usuario{' '}
						<strong>
							{deleteDialog.user?.nombre} {deleteDialog.user?.apellido}
						</strong>
						?
					</Typography>
					<Typography color='error' variant='body2' sx={{ mt: 1 }}>
						Esta acción no se puede deshacer.
					</Typography>
				</DialogContent>
				<DialogActions sx={{ display: 'flex', px: 3, pb: 3, gap: 1 }}>
					<Button onClick={handleConfirmDelete} variant='contained' color='error'>
						Eliminar
					</Button>
					<Button onClick={() => setDeleteDialog({ open: false, user: null })} variant='outlined' color='inherit'>
						Cancelar
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default UsersList;
