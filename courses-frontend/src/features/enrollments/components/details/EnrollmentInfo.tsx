// EnrollmentInfo.tsx
import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { Enrollment } from '../../types/enrollmentsTypes';
import { NavigateNextRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { statusOptions, getColorKey } from '../../utils/statusConfig';
import { useAppSelector } from '../../../../hooks/hooks';
import { Role } from '../../../users/types/types';

interface EnrollmentInfoProps {
	enrollment: Enrollment;
}

export const EnrollmentInfo: React.FC<EnrollmentInfoProps> = ({ enrollment }) => {
	const { alumno, vendedor, estado, comision } = enrollment;
	const navigate = useNavigate();
	const statusConfig = statusOptions[estado as keyof typeof statusOptions];
	const colorKey = getColorKey(estado);

	const { user } = useAppSelector((state) => state.auth);
	const isVendedor = user?.rol === Role.VENDEDOR || user?.rol === Role.PROFESORVENDEDOR;

	return (
		<>
			{/* Información general */}
			<Box
				sx={{
					border: '1px solid #C2C4CB',
					borderRadius: '.25rem',
					p: '1rem',
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'space-between',
					gap: '.5rem',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: '.5rem',
					}}
				>
					<Typography variant='body1'>
						<strong>Curso:</strong> {comision?.curso?.nombre || 'N/A'}
					</Typography>
					<Typography variant='body1'>
						<strong>Código de curso:</strong> #{comision?.curso?.codigo || 'N/A'}
					</Typography>
				</Box>
				<Typography variant='body1'>
					<strong>Código de comisión:</strong> #{comision?.codigoComision || 'N/A'}
				</Typography>
			</Box>

			{/* Información del alumno */}
			<Box
				sx={{
					border: '1px solid #C2C4CB',
					borderRadius: '.25rem',
					p: '1rem',
					display: 'flex',
					flexDirection: 'column',
					gap: '0.5rem',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexWrap: 'wrap',
						justifyContent: 'space-between',
						gap: '0.5rem',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							gap: '0.5rem',
						}}
					>
						<Typography variant='body1'>
							<strong>Alumno:</strong> {alumno?.usuario?.nombre} {alumno?.usuario?.apellido}
						</Typography>

						<Typography variant='body1'>
							<strong>Identificación:</strong> {alumno?.usuario?.dni || 'N/A'}
						</Typography>
						<Typography variant='body1'>
							<strong>Mail:</strong> {alumno?.usuario?.email || 'N/A'}
						</Typography>
						<Button
							variant='text'
							sx={{
								alignSelf: 'start',
								display: 'flex',
								alignItems: 'center',
								gap: '0.5rem',
							}}
							onClick={() => navigate(`/students/view/${alumno?.usuario?.id}`)}
						>
							Ver toda la info
							<NavigateNextRounded fontSize='small' />
						</Button>
					</Box>
					<Chip
						icon={<statusConfig.icon  />}
						label={statusConfig.label}
						sx={(theme) => ({
							backgroundColor: colorKey === 'default' 
								? theme.palette.background.default
								: theme.palette.state[colorKey].lighter,
							color: colorKey === 'default'
								? theme.palette.text.secondary
								: theme.palette.state[colorKey].main,
							'& .MuiChip-icon': {
								color: colorKey === 'default'
									? theme.palette.text.secondary
									: theme.palette.state[colorKey].main,
							},
						})}
					/>
				</Box>
			</Box>

			{/* Información del vendedor - Solo se muestra si no es vendedor */}
			{!isVendedor && (
				<Box
					sx={{
						border: '1px solid #C2C4CB',
						borderRadius: '.25rem',
						p: '1rem',
						display: 'flex',
						flexDirection: 'column',
						gap: '0.5rem',
					}}
				>
					<Typography variant='body1'>
						<strong>Vendedor:</strong> {vendedor?.usuario?.nombre} {vendedor?.usuario?.apellido}
					</Typography>
					<Typography variant='body1'>
						<strong>Identificación:</strong> {vendedor?.usuario?.dni || 'N/A'}
					</Typography>
					<Typography variant='body1'>
						<strong>Mail:</strong> {vendedor?.usuario?.email || 'N/A'}
					</Typography>
					<Button
						variant='text'
						sx={{
							alignSelf: 'start',
							display: 'flex',
							alignItems: 'center',
							gap: '0.5rem',
						}}
						onClick={() => navigate(`/staff/view/${vendedor?.usuario?.id}`)}
					>
						Ver toda la info
						<NavigateNextRounded fontSize='small' />
					</Button>
				</Box>
			)}
		</>
	);
};
