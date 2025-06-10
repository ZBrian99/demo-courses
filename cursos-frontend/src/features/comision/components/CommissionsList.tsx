import React, { useEffect, useState } from 'react';
import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	IconButton,
	Typography,
	Paper,
	Tooltip,
	Card,
	CardContent,
	CardActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { People } from '@mui/icons-material';
import CustomPagination from '../../../components/CustomPagination';
import { useAppDispatch } from '../../../hooks/hooks';
import { deleteCommission } from '../slices/commissionsSlice';
import { CommissionData, Filters } from '../types/types';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useNavigate } from 'react-router-dom';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface CommissionsListProps {
	commissions: CommissionData[];
	filters: Filters;
	handleEditCommission: (commissionId: string) => void;
	isCardView: boolean;
}

export const CommissionsList: React.FC<CommissionsListProps> = ({
	commissions,
	filters,
	handleEditCommission,
	isCardView,
}) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 1000;
	const [filteredCommissions, setFilteredCommissions] = useState<CommissionData[]>([]);

	// Paginación de las comisiones
	// const paginatedCommissions = commissions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	// Manejar la eliminación de una comisión

	useEffect(() => {
		// Aplicar filtros si existen, de lo contrario usar todas las comisiones
		let filtered = [...commissions];

		if (filters) {
			if (filters.curso) {
				filtered = filtered.filter(
					(commission) =>
						commission.curso.nombre?.toLowerCase().includes(filters.curso.toLowerCase()) ||
						commission.curso.codigo?.toLowerCase().includes(filters.curso.toLowerCase()) ||
						commission.codigoComision?.toLowerCase().includes(filters.curso.toLowerCase())
				);
			}
			if (filters.estado) {
				filtered = filtered.filter((commission) =>
					commission.estado?.toLowerCase().includes(filters.estado.toLowerCase())
				);
			}
			if (filters.modalidad) {
				filtered = filtered.filter((commission) =>
					commission.modalidad?.toLowerCase().includes(filters.modalidad.toLowerCase())
				);
			}
			if (filters.profesor) {
				const profesorFilter = filters.profesor.toLowerCase();
				filtered = filtered.filter((commission) =>
					(commission.profesores ?? []).some((profesor) => {
						const { nombre, apellido, dni } = profesor;
						return (
							(nombre && nombre.toLowerCase().includes(profesorFilter)) ||
							(apellido && apellido.toLowerCase().includes(profesorFilter)) ||
							(dni && dni.includes(profesorFilter))
						);
					})
				);
			}
			if (filters.fechaInicio) {
				filtered = filtered.filter((commission) =>
					commission.fechaInicio ? dayjs(commission.fechaInicio).isSameOrAfter(filters.fechaInicio, 'day') : false
				);
			}
			if (filters.fechaFin) {
				filtered = filtered.filter((commission) =>
					commission.fechaFin ? dayjs(commission.fechaFin).isSameOrBefore(filters.fechaFin, 'day') : false
				);
			}
		}

		setFilteredCommissions(filtered);
		setCurrentPage(1);
	}, [commissions, filters]);

	// Paginación de las comisiones
	const paginatedCommissions = filteredCommissions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	const handleDeleteCommission = (commissionId: string) => {
		dispatch(deleteCommission(commissionId));
	};

	const handleNavigateToEnrollments = (commissionId: string) => {
		navigate(`/enrollments/${commissionId}`);
	};

	return (
		<Box>
			{/* Tabla de comisiones */}
			{isCardView ? (
				// Vista en tarjeta
				<Box
					sx={{
						display: 'flex',
						flexWrap: 'wrap',
						gap: '1rem',
					}}
				>
					{paginatedCommissions.length > 0 ? (
						paginatedCommissions.map((commission) => (
							<Card
								key={commission.id}
								sx={{
									width: '100%',
									maxWidth: '300px',
									display: 'flex',
									flexDirection: 'column',
									p: '1rem',
								}}
							>
								<Typography>COMISIÓN: {commission.codigoComision ?? 'N/A'}</Typography>
								<Typography>Modalidad: {commission.modalidad}</Typography>
								<Typography>Activa: {commission.isActive ? 'Sí' : 'No'}</Typography>
								<Typography>Fecha Inicio: {commission.fechaInicio ?? 'No disponible'}</Typography>
								<Typography>Fecha Fin: {commission.fechaFin ?? 'No disponible'}</Typography>
								<Typography>Profesores: {commission.profesores?.[0]?.nombre ?? 'No asignados'}</Typography>

								<Box ml='auto' mt={2} display='flex' gap='.5rem'>
									<Tooltip title="Ver inscriptos">
										<IconButton
											sx={{ aspectRatio: 1, minWidth: '20px' }}
											size='small'
											onClick={() => handleNavigateToEnrollments(commission.id)}
										>
											<People />
										</IconButton>
									</Tooltip>
									<IconButton
										sx={{ aspectRatio: 1, minWidth: '20px' }}
										size='small'
										onClick={() => handleEditCommission(commission.id)}
									>
										<EditIcon />
									</IconButton>
									<IconButton
										sx={{ aspectRatio: 1, minWidth: '20px' }}
										size='small'
										onClick={() => handleDeleteCommission(commission.id)}
									>
										<DeleteIcon />
									</IconButton>
								</Box>
							</Card>
						))
					) : (
						<Typography variant='body1' sx={{ textAlign: 'center', padding: '1rem' }}>
							Aún no has creado ninguna comisión
						</Typography>
					)}
				</Box>
			) : (
				// Vista en lista (tabla)
				<TableContainer>
					<Table size='small' aria-label='Comisiones Table'>
						<TableHead>
							<TableRow>
								<TableCell>Código</TableCell>
								<TableCell>Curso</TableCell>
								<TableCell>Estado</TableCell>
								<TableCell>Fecha Inicio</TableCell>
								<TableCell>Fecha Fin</TableCell>
								<TableCell>Modalidad</TableCell>
								<TableCell>Acciones</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedCommissions.length > 0 ? (
								paginatedCommissions.map((commission) => (
									<TableRow key={commission.id}>
										<TableCell>{commission.codigoComision ?? 'N/A'}</TableCell>
										<TableCell>
											<Tooltip title={commission.curso.nombre} arrow placement='top'>
												<span>{commission.curso.codigo}</span>
											</Tooltip>
										</TableCell>
										<TableCell>{commission.estado}</TableCell>
										<TableCell>{commission.fechaInicio ?? 'No disponible'}</TableCell>
										<TableCell>{commission.fechaFin ?? 'No disponible'}</TableCell>
										<TableCell>{commission.modalidad}</TableCell>
										<TableCell>
											<Tooltip title="Ver inscriptos">
												<IconButton
													size='small'
													sx={{ aspectRatio: 1, minWidth: '20px' }}
													onClick={() => handleNavigateToEnrollments(commission.id)}
												>
													<People />
												</IconButton>
											</Tooltip>
											<IconButton
												size='small'
												sx={{ aspectRatio: 1, minWidth: '20px' }}
												onClick={() => handleEditCommission(commission.id)}
											>
												<EditIcon />
											</IconButton>
											<IconButton
												size='small'
												sx={{ aspectRatio: 1, minWidth: '20px' }}
												onClick={() => handleDeleteCommission(commission.id)}
											>
												<DeleteIcon />
											</IconButton>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={8} style={{ textAlign: 'center', padding: '1rem' }}>
										Aún no has creado ninguna comisión
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
			)}

			{/* <CustomPagination
				currentPage={currentPage}
				itemsPerPage={itemsPerPage}
				totalItems={commissions.length}
				onPageChange={setCurrentPage}
			/> */}
		</Box>
	);
};
