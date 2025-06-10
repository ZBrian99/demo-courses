import React from 'react';
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
	Card,
	Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch } from '../../../hooks/hooks';
import { deleteCommission } from '../../comision/slices/commissionsSlice';
import { ContentCopy, People } from '@mui/icons-material';
import { CommissionData } from '../../comision/types/types';
import { useNavigate } from 'react-router-dom';

interface CommissionsListProps {
	commissions: CommissionData[];
	courseId: string;
	onEditCommission: (commissionId: string) => void;
	isCardView: boolean;
	handleDuplicateCommission: (commissionId: string) => void;
}

export const CourseCommissionsList: React.FC<CommissionsListProps> = ({
	commissions,
	courseId,
	onEditCommission,
	isCardView,
	handleDuplicateCommission,
}) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const handleDeleteCommission = (commissionId: string) => {
		dispatch(deleteCommission(commissionId));
	};

	const handleNavigateToEnrollments = (commissionId: string) => {
		navigate(`/enrollments/${commissionId}`);
	};

	return (
		<Box>
			{isCardView ? (
				<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
					{commissions.length > 0 ? (
						commissions.map((commission) => (
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
									{/* <IconButton
										sx={{ aspectRatio: 1, minWidth: '20px' }}
										size='small'
										onClick={() => handleDuplicateCommission(commission.id)}
									>
										<ContentCopy />
									</IconButton> */}
									<IconButton
										sx={{ aspectRatio: 1, minWidth: '20px' }}
										size='small'
										onClick={() => onEditCommission(commission.id)}
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
						<Typography variant='body1' sx={{ textAlign: 'center', padding: '1rem', width: '100%' }}>
							Aún no has creado ninguna comisión
						</Typography>
					)}
				</Box>
			) : (
				<TableContainer>
					<Table size='small' aria-label='Comisiones Table'>
						<TableHead>
							<TableRow>
								<TableCell>Código</TableCell>
								<TableCell>Modalidad</TableCell>
								<TableCell>Activa</TableCell>
								<TableCell>Inicio</TableCell>
								<TableCell>Fin</TableCell>
								<TableCell>Acciones</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{commissions.length > 0 ? (
								commissions.map((commission) => (
									<TableRow key={commission.id}>
										<TableCell>{commission.codigoComision ?? 'N/A'}</TableCell>
										<TableCell>{commission.modalidad}</TableCell>
										<TableCell>{commission.isActive ? 'Sí' : 'No'}</TableCell>
										<TableCell>{commission.fechaInicio ?? 'No disponible'}</TableCell>
										<TableCell>{commission.fechaFin ?? 'No disponible'}</TableCell>
										<TableCell>
											<Tooltip title="Ver inscriptos">
												<IconButton
													sx={{ aspectRatio: 1, minWidth: '20px' }}
													size='small'
													onClick={() => handleNavigateToEnrollments(commission.id)}
												>
													<People />
												</IconButton>
											</Tooltip>
											{/* <IconButton
												sx={{ aspectRatio: 1, minWidth: '20px' }}
												size='small'
												onClick={() => handleDuplicateCommission(commission.id)}
											>
												<ContentCopy />
											</IconButton> */}
											<IconButton
												size='small'
												sx={{ aspectRatio: 1, minWidth: '20px' }}
												onClick={() => onEditCommission(commission.id)}
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
									<TableCell colSpan={6} style={{ textAlign: 'center', padding: '1rem' }}>
										Aún no has creado ninguna comisión
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</Box>
	);
};
