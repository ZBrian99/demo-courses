import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Box, TextField, Button, Radio, Checkbox, IconButton } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { AddCircle, Delete } from '@mui/icons-material';

interface OpcionProps {
	etapaIndex: number;
	preguntaIndex: number;
	tipo: 'SELECCION' | 'CHECKBOX';
}

const OpcionComponent: React.FC<OpcionProps> = ({ etapaIndex, preguntaIndex, tipo }) => {
	const { control, register } = useFormContext();

	const {
		fields: opcionesFields,
		append: appendOpcion,
		remove: removeOpcion,
	} = useFieldArray({
		control,
		name: `stages.${etapaIndex}.questions.${preguntaIndex}.options`,
	});

	const agregarOpcion = () => {
		appendOpcion({
			id: uuidv4(),
			text: '',
			order: opcionesFields.length,
		});
	};

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: '1rem',
			}}
		>
			{opcionesFields.map((opcion, opcionIndex) => (
				<Box key={opcion.id} sx={{ display: 'flex', alignItems: 'center', gap: '.5rem', width: '100%' }}>
					{tipo === 'SELECCION' ? <Radio disabled /> : <Checkbox disabled />}
					<TextField
						{...register(`stages.${etapaIndex}.questions.${preguntaIndex}.options.${opcionIndex}.text`, {
							required: true,
						})}
						label={`Opción ${opcionIndex + 1}`}
						fullWidth
					/>
					<IconButton onClick={() => removeOpcion(opcionIndex)} disabled={opcionesFields.length <= 1}>
						<Delete />
					</IconButton>
				</Box>
			))}

			<Button variant='outlined' color='primary' onClick={agregarOpcion} startIcon={<AddCircle />}>
				Agregar Opción
			</Button>
		</Box>
	);
};

export default OpcionComponent;
