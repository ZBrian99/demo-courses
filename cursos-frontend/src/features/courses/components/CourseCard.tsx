import React, { useState } from 'react';
import {
	Box,
	Card,
	CardContent,
	Typography,
	IconButton,
	Menu,
	MenuItem,
	Chip,
	useTheme,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
} from '@mui/material';
import {
	MoreVert as MoreVertIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
	Book as BookIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Course } from '../types/types';

interface CourseCardProps {
	course: Course;
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onEdit, onDelete }) => {
	const theme = useTheme();
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

	const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		event.stopPropagation();
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = (_: any, reason?: "backdropClick" | "escapeKeyDown") => {
		setAnchorEl(null);
	};

	const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, action: () => void) => {
		event.stopPropagation();
		setAnchorEl(null);
		action();
	};

	const handleDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
		handleMenuItemClick(event, () => setOpenConfirmDialog(true));
	};

	const handleConfirmDelete = () => {
		onDelete(course.id!);
		setOpenConfirmDialog(false);
	};

	const handleEditClick = (event: React.MouseEvent<HTMLElement>) => {
		handleMenuItemClick(event, () => onEdit(course.id!));
	};

	return (
		<>
			<Card
				variant='outlined'
				sx={{
					height: '100%',
					display: 'flex',
					bgcolor: 'background.default',
					flexDirection: 'column',
					position: 'relative',
					cursor: 'pointer',
					borderRadius: '0.75rem',
					borderLeft: `6px solid ${course.isActive ? theme.palette.primary.main : theme.palette.grey[400]}`,
					transition: 'border-color 0.1s ease-in-out',
					'&:hover': {
						borderColor: theme.palette.primary.main,
					},
				}}
				onClick={() => navigate(`/courses/${course.id}`)}
			>
				<CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
						<Chip
							label={course.isActive ? 'Activo' : 'Inactivo'}
							color={course.isActive ? 'success' : 'default'}
							size='small'
							sx={{
								fontWeight: 500,
								borderRadius: '0.5rem',
							}}
						/>
						<IconButton size='small' onClick={handleMenuOpen} sx={{ color: theme.palette.text.secondary }}>
							<MoreVertIcon />
						</IconButton>
					</Box>

					<Typography
						variant='h6'
						sx={{
							fontWeight: 600,
							mb: 1,
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							display: '-webkit-box',
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical',
						}}
					>
						{course.nombre}
					</Typography>

					<Typography
						variant='body2'
						color='text.secondary'
						sx={{
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							display: '-webkit-box',
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical',
							mb: 2,
							flexGrow: 1,
						}}
					>
						{course.descripcion || 'Sin descripción'}
					</Typography>

					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							pt: 1,
							borderTop: `1px solid ${theme.palette.divider}`,
						}}
					>
						<Typography
							variant='caption'
							sx={{
								color: theme.palette.text.secondary,
								fontWeight: 500,
							}}
						>
							Código: {course.codigo}
						</Typography>
						{course.cursosRequeridos && course.cursosRequeridos.length > 0 && (
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
								<BookIcon sx={{ fontSize: '1rem', color: theme.palette.text.secondary }} />
								<Typography variant='caption' color='text.secondary'>
									{course.cursosRequeridos?.length} prereq.
								</Typography>
							</Box>
						)}
					</Box>
				</CardContent>

				<Menu
					anchorEl={anchorEl}
					open={Boolean(anchorEl)}
					onClose={handleMenuClose}
					onClick={(e) => e.stopPropagation()}
				>
					<MenuItem onClick={handleEditClick} sx={{ color: theme.palette.text.secondary }}>
						<EditIcon
							fontSize='small'
							sx={{
								mr: 1,
								color: theme.palette.text.secondary,
							}}
						/>
						Editar
					</MenuItem>
					<MenuItem onClick={handleDeleteClick} sx={{ color: theme.palette.text.secondary }}>
						<DeleteIcon
							fontSize='small'
							sx={{
								mr: 1,
								color: 'inherit',
							}}
						/>
						Eliminar
					</MenuItem>
				</Menu>
			</Card>

			<Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)} onClick={(e) => e.stopPropagation()}>
				<DialogTitle>Confirmar eliminación</DialogTitle>
				<DialogContent>¿Estás seguro de que deseas eliminar el curso "{course.nombre}"?</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenConfirmDialog(false)}>Cancelar</Button>
					<Button onClick={handleConfirmDelete} color='error' variant='contained'>
						Eliminar
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
