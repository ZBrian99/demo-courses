import React from 'react';
import { Box, Typography, Paper, Chip, Link as MuiLink, Avatar } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { User } from '../../preinscripcion/types/types';
import { Link } from '../types/types';
import { Person, LocationOn, CalendarMonth, Link as LinkIcon } from '@mui/icons-material';

const StepForm4: React.FC = () => {
	const { getValues } = useFormContext();
	const values = getValues();

	const renderUserChips = (users: User[] | undefined, role: string) => {
		if (!users?.length) return <Chip label={`Sin ${role}`} variant="outlined" size="small" />;
		
		return users.map((user) => (
			<Chip
				key={user.id}
				avatar={<Avatar>{(user.nombre[0] + (user.apellido?.[0] || '')).toUpperCase()}</Avatar>}
				label={`${user.nombre} ${user.apellido || ''}`}
				size="small"
				sx={{ m: 0.5 }}
			/>
		));
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<Paper sx={{ p: 2 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
					<CalendarMonth color="primary" fontSize="small" />
					<Typography variant="subtitle1" fontWeight="bold">
						Información General
					</Typography>
				</Box>
				<Box sx={{ 
					display: 'grid', 
					gridTemplateColumns: 'repeat(2, 1fr)',
					gap: 2,
					mb: 1 
				}}>
					<Box>
						<Typography variant="caption" color="text.secondary">Inicio</Typography>
						<Typography variant="body2">{values.fechaInicio || 'No asignada'}</Typography>
					</Box>
					<Box>
						<Typography variant="caption" color="text.secondary">Fin</Typography>
						<Typography variant="body2">{values.fechaFin || 'No asignada'}</Typography>
					</Box>
					<Box>
						<Typography variant="caption" color="text.secondary">Carga Horaria</Typography>
						<Typography variant="body2">
							{values.cargaHoraria || '0:00'} hs
						</Typography>
					</Box>
					<Box>
						<Typography variant="caption" color="text.secondary">Cupo</Typography>
						<Typography variant="body2">{values.cupo || 'No asignado'}</Typography>
					</Box>
				</Box>

				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, mb: 1 }}>
					<LocationOn color="primary" fontSize="small" />
					<Typography variant="subtitle1" fontWeight="bold">
						Ubicación
					</Typography>
				</Box>
				<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
					<Chip label={values.modalidad === 'Mixto' ? 'Pres + Virtual' : (values.modalidad || 'Sin modalidad')} size="small" />
					<Chip label={values.pais || 'Sin país'} size="small" />
					<Chip label={values.provincia || 'Sin provincia'} size="small" />
					<Chip label={values.ubicacion || 'Sin ubicación'} size="small" />
				</Box>
			</Paper>

			<Paper sx={{ p: 2 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
					<Person color="primary" fontSize="small" />
					<Typography variant="subtitle1" fontWeight="bold">
						Personal
					</Typography>
				</Box>
				<Typography variant="caption" color="text.secondary">Vendedores</Typography>
				<Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
					{renderUserChips(values.vendedores, 'vendedores')}
				</Box>
			</Paper>

			<Paper sx={{ p: 2 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
					<LinkIcon color="primary" fontSize="small" />
					<Typography variant="subtitle1" fontWeight="bold">
						Links
					</Typography>
				</Box>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
					{values.links?.map((link: Link, index: number) => (
						<Box 
							key={index}
							sx={{ 
								display: 'flex',
								alignItems: 'center',
								gap: 0.5,
								backgroundColor: 'background.default',
								p: 0.75,
								borderRadius: 1
							}}
						>
							<Typography 
								variant="body2" 
								color="text.secondary" 
								sx={{ minWidth: 'fit-content', mr: 0.5 }}
							>
								{link.titulo}:
							</Typography>
							<MuiLink 
								href={link.url} 
								target="_blank" 
								rel="noopener noreferrer"
								variant="body2"
								sx={{ 
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
									flex: 1
								}}
							>
								{link.url}
							</MuiLink>
						</Box>
					))}
				</Box>
			</Paper>

			{values.horarios?.length > 0 && (
				<Paper sx={{ p: 2 }}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
						<CalendarMonth color="primary" fontSize="small" />
						<Typography variant="subtitle1" fontWeight="bold">
							Horarios
						</Typography>
					</Box>
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
						{values.horarios.map((horario: any, index: number) => (
							<Chip
								key={index}
								label={`${horario.day}: ${horario.startTime} - ${horario.endTime}`}
								size="small"
							/>
						))}
					</Box>
				</Paper>
			)}
		</Box>
	);
};

export default StepForm4;
