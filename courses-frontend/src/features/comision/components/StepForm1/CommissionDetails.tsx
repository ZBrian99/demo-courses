import React from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { CustomSelect, CustomTextInput } from '../../../../components/inputs';
import { Course } from '../../../courses/types/types';

interface CommissionDetailsProps {
  courses: Course[];
  isFromCourse?: boolean;
  modalidad?: string;
}

const CommissionDetails = React.memo(({ courses, isFromCourse, modalidad }: CommissionDetailsProps) => {
  const { control } = useFormContext();

  return (
    <Box>
      <Typography variant='h6' gutterBottom mb={2}>
        Detalles de la Comisión
      </Typography>
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'minmax(15rem, 2fr) minmax(10rem, 1fr) minmax(5rem, 0.5fr)'
        },
        gap: '1rem'
      }}>
        <CustomSelect
          name='cursoId'
          label='Curso'
          options={courses.map((course) => ({
            label: course.nombre,
            value: course.id,
          }))}
          disabled={isFromCourse}
          required
        />
        <Controller
          name='codigoComision'
          control={control}
          defaultValue=''
          rules={{ required: 'The commission code is required' }}
          render={({ field: { value, onChange, ...rest }, fieldState: { error } }) => (
            <TextField
              value={value || ''}
              onChange={onChange}
              {...rest}
              label='Código de Comisión'
              required
              size='small'
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
        <CustomTextInput
          name='cupo'
          label='Cupo'
          type='text'
          disabled={modalidad === 'Virtual'}
        />
      </Box>
    </Box>
  );
});

CommissionDetails.displayName = 'CommissionDetails';

export default CommissionDetails; 