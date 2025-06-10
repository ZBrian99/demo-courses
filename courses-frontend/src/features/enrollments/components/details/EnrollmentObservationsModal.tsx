import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, Typography } from '@mui/material';
import { CustomTextInput, CustomTextarea } from '../../../../components/inputs';
import { AddObservation } from '../../types/enrollmentsTypes';

// Definir el esquema de validación con Zod
const observationsSchema = z.object({
	totalAcordado: z.string().min(1, 'El total acordado es obligatorio'),
	cantidadCuotas: z.string().optional(),
	observaciones: z.string().optional(),
});

interface ObservationsModalProps {
	onClose: () => void;
	onSubmit: (data: AddObservation) => void; // Cambiar aquí al tipo correcto
	defaultValues: AddObservation; // Asegúrate de que coincidan
}

const ObservationsModal: React.FC<ObservationsModalProps> = ({ onClose, onSubmit, defaultValues }) => {
	const methods = useForm<AddObservation>({
		resolver: zodResolver(observationsSchema),
		mode: 'onBlur',
		defaultValues,
	});

	const { trigger, getValues } = methods;

	const handleSubmit = async () => {
		const isValid = await trigger();
		if (isValid) {
			const formData = getValues();
			onSubmit(formData);
		}
	};

	return (
		<Box
			sx={{
				width: '100%',
				maxWidth: '30rem',
				overflow: 'hidden',
				bgcolor: 'common.white',
				borderRadius: '.5rem',
			}}
		>
			<FormProvider {...methods}>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleSubmit();
					}}
				>
					<Box
						sx={{
							p: 3,
							borderRadius: '.5rem',
							height: '100%',
							maxHeight: 'calc(100vh - 2rem)', // Altura máxima visible
							overflowY: 'auto', // Scroll solo vertical
							width: '100%',
							gap: 4,
							display: 'flex',
							flexDirection: 'column',
						}}
					>
						<Typography variant='h3' mb={1}>
							Observaciones
						</Typography>
						<Box sx={{ display: 'flex', gap: 2 }}>
							<CustomTextInput label='Total Acordado' name='totalAcordado' type='text' fullWidth required />
							<CustomTextInput label='Cantidad de Cuotas' name='cantidadCuotas' type='text' fullWidth />
						</Box>
						<CustomTextarea label='Observaciones' name='observaciones' rows={4} />
						<Box
							sx={{
								display: 'flex',
								gap: 2,
								justifyContent: 'space-between',
							}}
						>
							<Button variant='text' onClick={onClose}>
								Atrás
							</Button>
							<Button variant='contained' color='primary' onClick={handleSubmit}>
								Guardar
							</Button>
						</Box>
					</Box>
				</form>
			</FormProvider>
		</Box>
	);
};

export default ObservationsModal;
