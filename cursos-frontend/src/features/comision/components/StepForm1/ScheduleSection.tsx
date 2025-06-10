import React from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';
import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
import { AddCircle } from '@mui/icons-material';
import { CustomDatePicker } from '../../../../components/inputs';
import HorarioItem from './HorarioItem';

interface ScheduleSectionProps {
  fechaInicio?: string;
  fechaFin?: string;
}

const ScheduleSection = ({ fechaInicio, fechaFin }: ScheduleSectionProps) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'horarios',
  });

  return (
		<Box>
			<Typography variant='h6' gutterBottom mb={2}>
				Seleccioná la duración
			</Typography>
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: {
						xs: '1fr',
						md: 'minmax(15rem, 0.33fr) 1fr',
					},
					gap: '1rem',
				}}
			>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
					<CustomDatePicker
						name='fechaInicio'
						label='Fecha de inicio'
						required
						maxDate={fechaFin}
						dependentFields={['fechaFin']}
					/>
					<CustomDatePicker
						name='fechaFin'
						label='Fecha de fin'
						required
						minDate={fechaInicio}
						dependentFields={['fechaInicio']}
					/>
					<Controller
						name='cargaHoraria'
						control={control}
						render={({ field, fieldState: { error } }) => (
							<TextField
								{...field}
								label='Carga horaria'
								placeholder='00:00'
								required
								size='small'
								error={!!error}
								helperText={error?.message}
							/>
						)}
					/>
				</Box>

				<Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
					{fields.map((field, index) => (
						<HorarioItem
							key={field.id}
							index={index}
							onRemove={() => remove(index)}
							fechaInicio={fechaInicio}
							fechaFin={fechaFin}
						/>
					))}

					<Button
						startIcon={<AddCircle />}
						onClick={() => append({ day: '', startTime: '', endTime: '' })}
						disabled={!fechaInicio || !fechaFin}
						variant='text'
						sx={{ alignSelf: 'flex-start' }}
					>
						Añadir clase
					</Button>
				</Box>
			</Box>
		</Box>
	);
};

export default ScheduleSection; 