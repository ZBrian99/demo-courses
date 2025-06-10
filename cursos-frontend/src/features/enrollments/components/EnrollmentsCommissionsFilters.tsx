import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { CustomDatePicker, CustomSearchInput, CustomSelect } from '../../../components/inputs';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { CommissionsFiltersQuery } from '../types/enrollmentsTypes';
import dayjs from 'dayjs';

export const EnrollmentsCommissionsFilters: React.FC<{
	onFilterChange: (filters: CommissionsFiltersQuery) => void;
}> = ({ onFilterChange }) => {
	const methods = useForm<CommissionsFiltersQuery>({
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
	const fechaFin = useWatch({ control, name: 'fechaFin' });
	const fechaInicio = useWatch({ control, name: 'fechaInicio' });

	// useEffect(() => {
	// 	if (!isInitialLoad) {
	// 		onFilterChange({
	// 			search: getValues('search'),
	// 			status,
	// 			fechaInicio,
	// 			fechaFin,
	// 			page: 1,
	// 		});
	// 	} else {
	// 		setIsInitialLoad(false);
	// 	}
	// }, [status, fechaInicio, fechaFin]);

	// const onSubmit = (data: CommissionsFiltersQuery) => {
	// 	onFilterChange(data);
	// };
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

	const onSubmit = (data: CommissionsFiltersQuery) => {
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
					flexWrap: 'wrap',
				}}
			>
				<CustomSearchInput
					placeholder='Buscar por código de comisión, nombre de curso, etc.'
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
						{ label: 'Próxima', value: 'Próxima' },
						{ label: 'En curso', value: 'En curso' },
						{ label: 'Finalizada', value: 'Finalizada' },
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
					format='MM/YYYY'
					minDate={fechaInicio}
					views={['month', 'year']}
				/>
			</Box>
		</FormProvider>
	);
};
