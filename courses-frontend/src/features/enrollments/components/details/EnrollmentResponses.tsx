import React from 'react';
import {
	Box,
	Typography,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Checkbox,
	Radio,
	CircularProgress,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetResponsesByInscriptionIdQuery } from '../../api/enrollmentsApi';
import { Etapa } from '../../types/enrollmentsTypes';
import dayjs from 'dayjs';

export const EnrollmentResponses: React.FC = () => {
	const { enrollmentId } = useParams<{ enrollmentId: string }>();
	const { data, isLoading, isError } = useGetResponsesByInscriptionIdQuery(enrollmentId || '');

	const renderRespuesta = (pregunta: any) => {
		if (!pregunta.respuesta) return 'No respondida';

		switch (pregunta.type) {
			case 'TEXTO_CORTO':
			case 'TEXTO_LARGO':
				return pregunta.respuesta.textValue || 'No respondida';

			case 'FECHA':
				return pregunta.respuesta.textValue 
					? dayjs(pregunta.respuesta.textValue).format('DD/MM/YYYY')
					: 'No respondida';

			case 'SELECCION':
			case 'DESPLEGABLE':
				return (
					<List>
						{pregunta.opciones.map((option: any) => (
							<ListItem key={option.id} disablePadding>
								<ListItemIcon>
									<Radio
										checked={pregunta.respuesta.opcionesSeleccionadas?.some(
											(op: any) => op.id === option.id
										)}
										readOnly
									/>
								</ListItemIcon>
								<ListItemText primary={option.text} />
							</ListItem>
						))}
					</List>
				);

			case 'CHECKBOX':
			case 'DESPLEGABLE_MULTIPLE':
				return (
					<List>
						{pregunta.opciones.map((option: any) => (
							<ListItem key={option.id} disablePadding>
								<ListItemIcon>
									<Checkbox
										checked={pregunta.respuesta.opcionesSeleccionadas?.some(
											(op: any) => op.id === option.id
										)}
										readOnly
									/>
								</ListItemIcon>
								<ListItemText primary={option.text} />
							</ListItem>
						))}
					</List>
				);

			default:
				return 'No respondida';
		}
	};

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
					p: '2rem',
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	if (isError || !data) {
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexGrow: 1,
					bgcolor: 'common.white',
					borderRadius: '.5rem',
					p: '2rem',
				}}
			>
				<Typography color='error'>No hay respuestas disponibles.</Typography>
			</Box>
		);
	}

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: '1.5rem',
			}}
		>
			{data.map((etapa: Etapa) => (
				<Box
					key={etapa.id}
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: '1rem',
						p: '1.5rem',
						border: '1px solid #C2C4CB',
						borderRadius: '.5rem',
						backgroundColor: 'gray.100',
					}}
				>
					<Typography variant='h6' fontWeight={700}>
						{etapa.title}
					</Typography>
					{etapa.preguntas.map((pregunta) => (
						<Box
							key={pregunta.id}
							sx={{
								p: '1rem',
								// p: '.5rem',
								border: '1px solid #C2C4CB',
								borderRadius: '.5rem',
								display: 'flex',
								flexDirection: 'column',
								gap: '1rem',
								backgroundColor: 'common.white',
							}}
						>
							<Typography variant='body1' sx={{ fontWeight: 700 }}>
								{pregunta.text} {pregunta.isRequired && <span>*</span>}
							</Typography>

							{renderRespuesta(pregunta)}
						</Box>
					))}
				</Box>
			))}
		</Box>
	);
};

export default EnrollmentResponses;
