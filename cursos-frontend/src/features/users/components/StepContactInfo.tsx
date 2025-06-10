import React from 'react';
import { Box, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { CustomTextInput } from '../../../components/inputs';
import { UserFormData } from '../schemas/userStepsSchema';

const StepContactInfo: React.FC = () => {
	const { formState: { errors } } = useFormContext<UserFormData>();

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
			<Box>
				<Typography variant="subtitle1" sx={{ mb: '1rem', color: 'text.secondary', fontWeight: 500 }}>
					Datos de contacto
				</Typography>
				
				<Box sx={{ 
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
					gap: '1rem'
				}}>
					<CustomTextInput
						label="Email"
						name="email"
						type="email"
						placeholder="Ingrese el correo electrónico"
						required
					/>

					<CustomTextInput
						label="Teléfono"
						name="telefono"
						placeholder="Ingrese el número de teléfono"
						required
					/>
				</Box>
			</Box>

			<Box>
				<Typography variant="subtitle1" sx={{ mb: '1rem', color: 'text.secondary', fontWeight: 500 }}>
					Ubicación
				</Typography>
				
				<Box sx={{ 
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
					gap: '1rem'
				}}>
					<CustomTextInput
						label="País"
						name="pais"
						placeholder="Ingrese el país"
						required
					/>

					<CustomTextInput
						label="Provincia"
						name="provincia"
						placeholder="Ingrese la provincia"
						required
					/>

					<CustomTextInput
						label="Ciudad"
						name="ciudad"
						placeholder="Ingrese la ciudad"
						required
					/>
				</Box>
			</Box>
		</Box>
	);
};

export default StepContactInfo;
