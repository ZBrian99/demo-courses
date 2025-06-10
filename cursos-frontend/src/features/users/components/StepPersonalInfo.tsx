import React from 'react';
import { Box, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { CustomTextInput, CustomDatePicker, CustomSelect, CustomPasswordInput } from '../../../components/inputs';
import { UserFormData } from '../schemas/userStepsSchema';

const StepPersonalInfo: React.FC = () => {
	const { formState: { errors } } = useFormContext<UserFormData>();

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
			<Box>
				<Typography variant="subtitle1" sx={{ mb: '1rem', color: 'text.secondary', fontWeight: 500 }}>
					Información personal
				</Typography>
				
				<Box sx={{ 
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
					gap: '1rem'
				}}>
					<CustomTextInput
						label="Nombre"
						name="nombre"
						placeholder="Ingrese el nombre"
						required
					/>

					<CustomTextInput
						label="Apellido"
						name="apellido"
						placeholder="Ingrese el apellido"
						required
					/>
				</Box>

				<Box sx={{ 
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
					gap: '1rem',
					mt: '1rem'
				}}>
					<CustomPasswordInput
						label="Contraseña"
						name="password"
						required
						dependentFields={['confirmPassword']}
					/>

					<CustomPasswordInput
						label="Confirmar Contraseña"
						name="confirmPassword"
						required
						dependentFields={['password']}
					/>
				</Box>

				<Box sx={{ 
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
					gap: '1rem',
					mt: '1rem'
				}}>
					<CustomDatePicker
						label="Fecha de nacimiento"
						name="fechaNacimiento"
						required
					/>

					<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
						<CustomSelect
							label="Tipo"
							name="tipoDni"
							options={[
								  { label: 'DNI', value: 'DNI' },
            { label: 'Pasaporte', value: 'Pasaporte' },
            { label: 'LC', value: 'LC' },
            { label: 'CI', value: 'CI' },
            { label: 'RUT', value: 'RUT' },
            { label: 'NIE', value: 'NIE' },
            { label: 'Cédula', value: 'Cédula' },
            { label: 'CURP', value: 'CURP' },
            { label: 'RFC', value: 'RFC' },
            { label: 'INE', value: 'INE' },
							]}
							required
						/>
						
						<CustomTextInput
							label="Número"
							name="dni"
							placeholder="Ingrese número"
							required
						/>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default StepPersonalInfo;
