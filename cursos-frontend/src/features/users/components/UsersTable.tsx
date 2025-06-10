import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

interface UsersTableProps {
	onEditUser: (user: any) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ onEditUser }) => {
	const users: any[] = []; // Aquí vendrían los usuarios del estado global (Redux)

	return (
		<Table>
			<TableHead>
				<TableRow>
					<TableCell>Nombre</TableCell>
					<TableCell>Apellido</TableCell>
					<TableCell>Email</TableCell>
					<TableCell>Rol</TableCell>
					<TableCell>Acciones</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{users.map((user) => (
					<TableRow key={user.id}>
						<TableCell>{user.nombre}</TableCell>
						<TableCell>{user.apellido}</TableCell>
						<TableCell>{user.email}</TableCell>
						<TableCell>{user.rol}</TableCell>
						<TableCell>
							<IconButton onClick={() => onEditUser(user)}>
								<Edit />
							</IconButton>
							<IconButton>
								<Delete />
							</IconButton>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default UsersTable;
