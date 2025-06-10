import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { CustomSearchInput, CustomSelect } from '../../../components/inputs';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { Role, UsersFiltersQuery } from '../types/types';

export interface UsersFiltersProps {
	onFilterChange: (filters: UsersFiltersQuery) => void;
	showRoleFilter?: boolean;
}

export const UsersFilters: React.FC<UsersFiltersProps> = ({ onFilterChange, showRoleFilter = true }) => {
	const methods = useForm<UsersFiltersQuery>({
		defaultValues: {
			search: undefined,
				rol: undefined,
		},
	});

	const { control, handleSubmit, getValues } = methods;
	const [isInitialLoad, setIsInitialLoad] = useState(true);

	const rol = useWatch({ control, name: 'rol' });

	useEffect(() => {
		if (!isInitialLoad) {
			onFilterChange({
				search: getValues('search'),
				rol,
				page: 1,
			});
		} else {
			setIsInitialLoad(false);
		}
	}, [rol]);

	const onSubmit = (data: UsersFiltersQuery) => {
		onFilterChange(data);
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
					placeholder='Buscar por nombre, apellido, email, dni...'
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
				{showRoleFilter && (
					<CustomSelect
						sx={{
							flex: 1,
							maxWidth: '12rem',
							minWidth: { xs: '100%', sm: '10rem' },
						}}
						label='Rol'
						name='rol'
						options={[
							{ label: 'VENDEDOR', value: 'VENDEDOR' },
							// { label: 'PROFESORVENDEDOR', value: 'PROFESORVENDEDOR' },
							{ label: 'PROFESOR', value: 'PROFESOR' },
							{ label: 'FINANZAS', value: 'FINANZAS' },
							// { label: 'ADMIN', value: 'ADMIN' },
						]}
						fullWidth
					/>
				)}
			</Box>
		</FormProvider>
	);
}; 