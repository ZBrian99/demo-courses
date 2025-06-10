import React, { useEffect } from 'react';
import { TextField, Button, Box, Divider, IconButton, Typography, Paper, useTheme } from '@mui/material';
import { Delete, AddCircle } from '@mui/icons-material';
import { useFormContext, useFieldArray } from 'react-hook-form';
import PreguntaComponent from './PreguntaComponent';
import { v4 as uuidv4 } from 'uuid';

interface EtapaProps {
	etapaIndex: number;
	removeEtapa: () => void;
	onDeleteClick: (
		type: 'etapa' | 'pregunta',
		onConfirm: () => void,
		etapaIndex?: number,
		preguntaIndex?: number
	) => void;
}

const EtapaComponent: React.FC<EtapaProps> = ({ etapaIndex, removeEtapa, onDeleteClick }) => {
	const { register, control } = useFormContext();
	const {
		fields: preguntaFields,
		append: appendPregunta,
		remove: removePregunta,
	} = useFieldArray({
		control,
		name: `stages.${etapaIndex}.questions`,
	});
	const theme = useTheme();

	const agregarPregunta = () => {
		appendPregunta({
			id: uuidv4(),
			text: '',
			type: 'TEXTO_CORTO',
			isRequired: false,
			options: [],
			order: preguntaFields.length,
		});
	};

	useEffect(() => {
		if (preguntaFields.length === 0) {
			agregarPregunta();
		}
	}, []);

	return (
		<Paper
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: '1.5rem',
				p: { xs: '1rem', sm: '1.5rem', md: '2rem' },
				borderRadius: { xs: 0, md: '1rem' },
				border: '1px solid',
				borderColor: 'divider',
				bgcolor: 'common.white',
				transition: 'all 0.2s ease',
				'&:hover': {
					boxShadow: (theme) => theme.shadows[2],
					borderColor: 'transparent',
				},
			}}
			elevation={0}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: '1rem',
				}}
			>
				<Box sx={{ flex: 1 }}>
				
					<TextField
						variant='outlined'
						{...register(`stages.${etapaIndex}.title`, { required: true })}
						label='Título de la Etapa'
						fullWidth
						size="small"
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: '0.5rem',
							}
						}}
					/>
				</Box>
				<IconButton
					size='small'
					aria-label='eliminar'
					onClick={() => onDeleteClick('etapa', removeEtapa, etapaIndex)}
					sx={{
						color: 'text.secondary',
						'&:hover': {
							color: 'error.main',
						},
					}}
				>
					<Delete />
				</IconButton>
			</Box>

			<Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
				{preguntaFields.map((pregunta, preguntaIndex) => (
					<PreguntaComponent
						key={pregunta.id}
						etapaIndex={etapaIndex}
						preguntaIndex={preguntaIndex}
						removePregunta={() => removePregunta(preguntaIndex)}
						onDeleteClick={onDeleteClick}
					/>
				))}
			</Box>

			<Button
				variant='text'
				color='primary'
				onClick={agregarPregunta}
				startIcon={<AddCircle />}
				sx={{
					borderRadius: '2rem',
					px: '1.5rem',
					py: '0.5rem',
				}}
			>
				Agregar nueva pregunta
			</Button>
		</Paper>
	);
};

export default EtapaComponent;
