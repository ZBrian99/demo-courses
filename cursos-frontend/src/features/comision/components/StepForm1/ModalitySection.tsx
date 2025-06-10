import React from 'react';
import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Typography, useTheme } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { CustomTextInput } from '../../../../components/inputs';

const ModalitySection = React.memo(({ modalidad }: { modalidad: string }) => {
  const theme = useTheme();
  const { control, setValue } = useFormContext();

  return (
    <Box>
      <Typography variant='h6' gutterBottom mb={2}>
        Seleccioná la modalidad
      </Typography>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        border: `1px solid ${theme.palette.primary.main}`,
        p: { xs: 2, sm: 3 },
        borderRadius: '.5rem',
      }}>
        <Controller
          name='modalidad'
          control={control}
          rules={{ required: 'Debe seleccionar una modalidad' }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <FormControl error={!!error} component='fieldset'>
              <RadioGroup
                row
                value={value}
                onChange={(e) => {
                  onChange(e);
                  setValue('modalidad', e.target.value, { shouldValidate: true });
                }}
                sx={{
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                <FormControlLabel value='Presencial' control={<Radio />} label='Presencial' />
                <FormControlLabel value='Virtual' control={<Radio />} label='Virtual' />
                <FormControlLabel value='Mixto' control={<Radio />} label='Pres + Virtual' />
                <FormControlLabel value='Retiro' control={<Radio />} label='Retiro' />
              </RadioGroup>
              {error && (
                <Typography color='error' variant='caption' sx={{ mt: 1 }}>
                  {error.message}
                </Typography>
              )}
            </FormControl>
          )}
        />
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: '1rem' 
        }}>
          <CustomTextInput name='pais' label='País' required />
          <CustomTextInput name='provincia' label='Provincia' />
          <CustomTextInput name='ubicacion' label='Ubicación' disabled={modalidad === 'Virtual'} />
        </Box>
      </Box>
    </Box>
  );
});

ModalitySection.displayName = 'ModalitySection';

export default ModalitySection; 