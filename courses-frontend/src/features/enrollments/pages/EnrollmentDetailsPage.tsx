// EnrollmentDetailsPage.tsx
import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetEnrollmentByIdQuery } from '../api/enrollmentsApi';
import { EnrollmentDetailsTabs } from '../components/EnrollmentDetailsTabs';
import { useAppDispatch } from '../../../hooks/hooks';
import { setBreadcrumbs } from '../../appState/slices/appStateSlice';

const EnrollmentDetailsPage: React.FC = () => {
	const dispatch = useAppDispatch();
	const { enrollmentId = '' } = useParams<{ enrollmentId: string }>();

	const { data: enrollment, isLoading, isError } = useGetEnrollmentByIdQuery(enrollmentId);

	useEffect(() => {
		if (enrollment) {
			dispatch(
				setBreadcrumbs([
					{ label: 'Inscripciones', path: '/enrollments' },
					{ label: 'Comision', path: `/enrollments` },
					{
						label: `${enrollment.alumno.usuario.nombre} ${enrollment.alumno.usuario.apellido}`,
						path: `/enrollments/${enrollment.comisionId}/${enrollment.comision?.codigoComision}`,
					},
				])
			);
		}
	}, [enrollment]);

	if (isLoading) {
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexGrow: 1,
					bgcolor: 'common.white',
					borderRadius: '.5rem',
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	if (isError || !enrollment) {
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexGrow: 1,
					bgcolor: 'common.white',
					borderRadius: '.5rem',
				}}
			>
				<Typography color='error'>Error al cargar los detalles de la inscripción.</Typography>
			</Box>
		);
	}

	return <EnrollmentDetailsTabs enrollment={enrollment} />;
};

export default EnrollmentDetailsPage;
