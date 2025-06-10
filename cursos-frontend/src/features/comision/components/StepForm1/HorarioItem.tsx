import React from 'react';
import { Box, Button, IconButton } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { RemoveCircle } from '@mui/icons-material';
import dayjs from 'dayjs';
import { TimePicker, DatePicker } from '@mui/x-date-pickers';

interface HorarioItemProps {
  index: number;
  onRemove: () => void;
  fechaInicio?: string;
  fechaFin?: string;
}

const HorarioItem = ({ index, onRemove, fechaInicio, fechaFin }: HorarioItemProps) => {
  const { control, setValue, getValues, trigger } = useFormContext();

  const handleStartTimeBlur = () => {
    const startTime = getValues(`horarios.${index}.startTime`);
    if (!startTime) return;

    // Calculamos hora fin (2 horas después)
    const endTime = dayjs(`2000-01-01 ${startTime}`).add(2, 'hour').format('HH:mm');
    setValue(`horarios.${index}.endTime`, endTime);

    // Actualizamos la carga horaria con la diferencia (2 horas)
    const currentCargaHoraria = dayjs(`2000-01-01 ${getValues('cargaHoraria') || '00:00'}`);
    setValue('cargaHoraria', currentCargaHoraria.add(2, 'hour').format('HH:mm'));

    trigger([`horarios.${index}`, 'cargaHoraria']);
  };

  const handleEndTimeBlur = () => {
    const startTime = getValues(`horarios.${index}.startTime`);
    const endTime = getValues(`horarios.${index}.endTime`);
    if (!startTime || !endTime) return;

    // Calculamos la diferencia en minutos
    const diff = dayjs(`2000-01-01 ${endTime}`).diff(dayjs(`2000-01-01 ${startTime}`), 'minute');
    
    // Actualizamos carga horaria
    const currentCargaHoraria = dayjs(`2000-01-01 ${getValues('cargaHoraria') || '00:00'}`);
    setValue('cargaHoraria', currentCargaHoraria.add(diff, 'minute').format('HH:mm'));
    trigger('cargaHoraria');
  };

  const handleDayBlur = () => {
    trigger(`horarios.${index}.day`);
  };

  return (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        sm: '1fr 1fr',
        md: 'repeat(3, 1fr) auto'
      },
      gap: '1rem',
      alignItems: 'center'
    }}>
      <Controller
        name={`horarios.${index}.day`}
        control={control}
        render={({ field: { ref, ...field }, fieldState: { error } }) => (
          <DatePicker
            {...field}
            label='Día'
            value={field.value ? dayjs(field.value) : null}
            onChange={(newValue) => {
              const dateString = newValue?.format('YYYY-MM-DD') || '';
              field.onChange(dateString);
            }}
            onClose={() => trigger(`horarios.${index}.day`)}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                size: 'small',
                error: !!error,
                helperText: error?.message,
                required: true,
                onBlur: () => trigger(`horarios.${index}.day`)
              },
            }}
            minDate={fechaInicio ? dayjs(fechaInicio) : undefined}
            maxDate={fechaFin ? dayjs(fechaFin) : undefined}
          />
        )}
      />
      <Controller
        name={`horarios.${index}.startTime`}
        control={control}
        render={({ field: { ref, ...field }, fieldState: { error } }) => (
          <TimePicker
            {...field}
            label='Hora inicio'
            value={field.value ? dayjs(`2000-01-01T${field.value}`) : null}
            onChange={(newValue) => {
              const timeString = newValue?.format('HH:mm') || '';
              field.onChange(timeString);
            }}
            onClose={handleStartTimeBlur}
            format='HH:mm'
            slotProps={{
              textField: {
                size: 'small',
                error: !!error,
                helperText: error?.message,
                onBlur: handleStartTimeBlur
              },
            }}
          />
        )}
      />
      <Controller
        name={`horarios.${index}.endTime`}
        control={control}
        render={({ field: { ref, ...field }, fieldState: { error } }) => (
          <TimePicker
            {...field}
            label='Hora fin'
            value={field.value ? dayjs(`2000-01-01T${field.value}`) : null}
            onChange={(newValue) => {
              const timeString = newValue?.format('HH:mm') || '';
              field.onChange(timeString);
            }}
            onClose={handleEndTimeBlur}
            format='HH:mm'
            slotProps={{
              textField: {
                size: 'small',
                error: !!error,
                helperText: error?.message,
                onBlur: handleEndTimeBlur
              },
            }}
          />
        )}
      />
      <IconButton 
        onClick={onRemove}
        sx={{ 
          display: { xs: 'none', md: 'inline-flex' },
          justifySelf: 'center',
          width: 'fit-content',
          padding: '0.5rem'
        }}
      >
        <RemoveCircle />
      </IconButton>
      <Button
        onClick={onRemove}
        startIcon={<RemoveCircle />}
        variant="outlined"
        sx={{ 
          display: { xs: 'flex', md: 'none' },
          gridColumn: '1 / -1',
          width: '100%'
        }}
      >
        Eliminar
      </Button>
    </Box>
  );
};

export default HorarioItem; 