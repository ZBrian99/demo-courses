// src/components/EnrollmentInfo.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Paper, Chip } from '@mui/material';
import { useFindByRefQuery } from '../api/preinscripcionApi';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

interface EnrollmentInfoProps {
	setStep: React.Dispatch<React.SetStateAction<number>>;
	setFormId: React.Dispatch<React.SetStateAction<string>>;
}

const EnrollmentInfo: React.FC<EnrollmentInfoProps> = ({ setStep, setFormId }) => {
	const { id } = useParams<{ id: string }>();

	const { data: reference, isLoading } = useFindByRefQuery({ ref: id as string }, { skip: !id });

	const [data, setData] = useState<{
		title: string;
		description: string | null;
		codigoComision: string;
		fechaInicio: string;
		fechaFin: string;
		modalidad: string;
	} | null>(null);

	useEffect(() => {
		if (reference) {
			if (reference.comision.formularioId) {
				setFormId(reference.comision.formularioId);
			}
			setData({
				title: reference.comision.curso.nombre,
				description: reference.comision.curso.descripcion,
				codigoComision: reference.comision.codigoComision,
				fechaInicio: reference.comision.fechaInicio,
				fechaFin: reference.comision.fechaFin,
				 modalidad: reference.comision.modalidad,
			});
		}
	}, [reference, setFormId]);

	return (
		<Paper
			sx={{
				width: '100%',
				maxWidth: '31.5rem',
				display: 'flex',
				flexDirection: 'column',
				padding: '1.5rem',
				borderRadius: '1rem',
				mt: '5rem',
			}}
		>
			<Chip
				label='Formulario de preinscripción'
				variant='outlined'
				color='primary'
				sx={{
					borderRadius: '.25rem',
					width: 'fit-content',
					mb: '1rem',
					bgcolor: 'primary.light',
				}}
			/>
			<Typography variant='h3' color='gray.700' gutterBottom>
				{data?.title}
			</Typography>
			{data?.description && (
				<Typography 
					color='primary.main'
					fontWeight='500'
					sx={{
						mb: '1.5rem',
					}}
				>
					{data.description}
				</Typography>
			)}
			<Box
				sx={{
					bgcolor: 'primary.light',
					p: '1rem',
					borderRadius: '.5rem',
				}}
      >
        	<Typography
					sx={{
						color: 'gray.700',
						fontWeight: '500',
          }}
					gutterBottom
				>
					Modalidad:
					<Typography component='span'>
            {data && ` ${data.modalidad.toLowerCase() === 'mixto' ? 'presencial + virtual' : data.modalidad.toLowerCase()}`
            
            }
					</Typography>
				</Typography>
				<Typography
					gutterBottom
					sx={{
						color: 'gray.700',
						fontWeight: '500',
					}}
				>
					Inicia:
					<Typography component='span'>
						{data && ` ${dayjs(data?.fechaInicio).format('dddd D [de] MMMM')}`}
					</Typography>
				</Typography>

				<Typography
					gutterBottom
					sx={{
						color: 'gray.700',
						fontWeight: '500',
					}}
				>
					Finaliza:
					<Typography component='span'>
						{data && ` ${dayjs(data?.fechaFin).format('dddd D [de] MMMM')}`}
					</Typography>
				</Typography>
			
			</Box>

			<Button variant='contained' color='primary' fullWidth sx={{ marginTop: '2.5rem' }} onClick={() => setStep(4)}>
				Inscribirme
			</Button>
		</Paper>
	);
};

export default EnrollmentInfo;
