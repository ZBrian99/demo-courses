import React from 'react';
import { Box, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { CustomTextInput, CustomTextarea, CustomSelect } from '../../../components/inputs';
import { Role } from '../types/types';
import { UserFormData } from '../schemas/userStepsSchema';

const StepProfessionalInfo: React.FC = () => {
	const { formState: { errors } } = useFormContext<UserFormData>();

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
			<Box>
				<Typography variant="subtitle1" sx={{ mb: '1rem', color: 'text.secondary', fontWeight: 500 }}>
					Información profesional
				</Typography>
				
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
					<CustomTextInput
						label="Profesión"
						name="profesion"
						placeholder="Ingrese su profesión"
					/>

					<CustomTextarea
						label="Resumen"
						name="resume"
						rows={4}
						required
					/>
				</Box>
			</Box>

			<Box>
				<Typography variant="subtitle1" sx={{ mb: '1rem', color: 'text.secondary', fontWeight: 500 }}>
					Rol en el sistema
				</Typography>
				
				<CustomSelect
					label="Rol"
					name="rol"
					options={[
						{ label: 'PROFESOR', value: Role.PROFESOR },
						{ label: 'VENDEDOR', value: Role.VENDEDOR },
						{ label: 'FINANZAS', value: Role.FINANZAS },
						// { label: 'ADMIN', value: Role.ADMIN }
					]}
					required
					fullWidth
				/>
			</Box>
		</Box>
	);
};

export default StepProfessionalInfo;
