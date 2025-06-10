// EnrollmentFilters.tsx
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { CustomDatePicker, CustomSearchInput, CustomSelect } from '../../../components/inputs';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { EnrollmentsFiltersProps, EnrollmentsFiltersQuery } from '../types/enrollmentsTypes';
import dayjs from 'dayjs';

export const EnrollmentsFilters: React.FC<EnrollmentsFiltersProps> = ({ onFilterChange }) => {
	const methods = useForm<EnrollmentsFiltersQuery>({
		defaultValues: {
			search: undefined,
			status: undefined,
			fechaInicio: undefined,
			fechaFin: undefined,
		},
	});

	const { control, handleSubmit, getValues } = methods;
	const [isInitialLoad, setIsInitialLoad] = useState(true);

	const status = useWatch({ control, name: 'status' });
	const fechaFin = useWatch({ control: methods.control, name: 'fechaFin' });
	const fechaInicio = useWatch({ control: methods.control, name: 'fechaInicio' });

	useEffect(() => {
		if (!isInitialLoad) {
			const adjustedFechaInicio = fechaInicio ? dayjs(fechaInicio).startOf('month').format('YYYY-MM-DD') : undefined;
			const adjustedFechaFin = fechaFin ? dayjs(fechaFin).endOf('month').format('YYYY-MM-DD') : undefined;

			onFilterChange({
				search: getValues('search'),
				status,
				fechaInicio: adjustedFechaInicio,
				fechaFin: adjustedFechaFin,
				page: 1,
			});
		} else {
			setIsInitialLoad(false);
		}
	}, [status, fechaInicio, fechaFin]);

	const onSubmit = (data: EnrollmentsFiltersQuery) => {
		const adjustedData = {
			...data,
			fechaInicio: data.fechaInicio ? dayjs(data.fechaInicio).startOf('month').format('YYYY-MM-DD') : undefined,
			fechaFin: data.fechaFin ? dayjs(data.fechaFin).endOf('month').format('YYYY-MM-DD') : undefined,
		};
		onFilterChange(adjustedData);
	};

	return (
		<FormProvider {...methods}>
			<Box
				component='form'
				onSubmit={handleSubmit(onSubmit)}
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: '.5rem',
					width: '100%',
					// p: '1rem',
					flexWrap: 'wrap',
				}}
			>
				<CustomSearchInput
					placeholder='Buscar por nombre y apellido, dni, mail, curso, comisión'
					sx={{
						flex: 1,
						maxWidth: '30rem',
						minWidth: { xs: '100%', sm: '15rem' },
					}}
					label='Buscar'
					name='search'
					fullWidth
					onClick={handleSubmit(onSubmit)}
				/>
				<CustomSelect
					sx={{
						flex: 1,
						maxWidth: '12rem',
						minWidth: { xs: '100%', sm: '10rem' },
					}}
					label='Estado'
					name='status'
					options={[
						{ label: 'Pendiente', value: 'Pendiente' },
						{ label: 'Parcial', value: 'Parcial' },
						{ label: 'Completo', value: 'Completo' },
						{ label: 'Cancelado', value: 'Cancelado' },
						{ label: 'Inactivo', value: 'Inactivo' },
					]}
					fullWidth
				/>
				<CustomDatePicker
					sx={{
						flex: 1,
						maxWidth: '12rem',
						minWidth: { xs: '100%', sm: '10rem' },
					}}
					label='Fecha de Inicio'
					name='fechaInicio'
					maxDate={fechaFin}
					format='MM/YYYY'
					views={['month', 'year']}
				/>
				<CustomDatePicker
					sx={{
						flex: 1,
						maxWidth: '12rem',
						minWidth: { xs: '100%', sm: '10rem' },
					}}
					label='Fecha de Fin'
					name='fechaFin'
					minDate={fechaInicio}
					format='MM/YYYY'
					views={['month', 'year']}
				/>
			</Box>
		</FormProvider>
	);
};
