import { Box, Select, MenuItem, FormControl, InputLabel, Button, TextField, InputAdornment } from '@mui/material';
import { Controller, UseFormRegister } from 'react-hook-form';
import { Delete, Search } from '@mui/icons-material';

interface FormFields {
	nombre: string;
	estado: string;
	modalidad: string;
}

interface FiltersProps {
	control: any;
	register: UseFormRegister<FormFields>;
	clearFilters: () => void;
	setDebouncedValue: (field: keyof FormFields, value: string) => void;
}

export const Filters: React.FC<FiltersProps> = ({ control, register, clearFilters, setDebouncedValue }) => {
	return (
		<Box
			sx={{
				display: 'flex',
				gap: '1rem',
				mb: '2rem',
				width: '100%',
				flexDirection: { xs: 'column', sm: 'row' },
				alignItems: { xs: 'flex-start', sm: 'normal' },
			}}
		>
			{/* <Box
				sx={{
					display: 'flex',
					flexWrap: 'wrap',
					gap: '1rem',
					flex: 1,
				}}
			> */}
			{/* Filtro por nombre del formulario */}
			<TextField
				sx={{
					minWidth: 200,
				}}
				{...register('nombre')}
				variant='outlined'
				size='small'
				placeholder='Buscar formulario'
				onChange={(e) => setDebouncedValue('nombre', e.target.value)}
				slotProps={{
					input: {
						startAdornment: (
							<InputAdornment position='start'>
								<Search />
							</InputAdornment>
						),
					},
				}}
			/>

			{/* Filtro por nombre del curso */}
			{/* <TextField
					{...register('nombreCurso')}
					variant='outlined'
					size='small'
					placeholder='Buscar curso'
					onChange={(e) => setDebouncedValue('nombreCurso', e.target.value)}
					slotProps={{
						input: {
							startAdornment: (
								<InputAdornment position='start'>
									<Search />
								</InputAdornment>
							),
						},
					}}
				/> */}

			{/* Filtro por nombre de la comisión */}
			{/* <TextField
          {...register('nombreComision')}
					variant='outlined'
					size='small'
					placeholder='Buscar comisión'
					onChange={(e) => setDebouncedValue('nombreComision', e.target.value)}
					slotProps={{
						input: {
							startAdornment: (
								<InputAdornment position='start'>
									<Search />
								</InputAdornment>
							),
						},
					}}
				/> */}
			{/* <Box
				sx={{
					display: 'flex',
					gap: '1rem',
					// flex: 1,
					// flexDirection: { xs: 'column', sm: 'row' },
					// width: '100%',
				}}
			> */}
			{/* Filtro por Estado */}

			<FormControl size='small' sx={{ maxWidth: 150 }} fullWidth>
				<InputLabel id='estado-label'>Estado</InputLabel>
				<Controller
					control={control}
					name='estado'
					render={({ field }) => (
						<Select labelId='estado-label' label='Estado' {...field} value={field.value || ''}>
							<MenuItem value='Todos'>Todos</MenuItem>
							<MenuItem value='Activos'>Activos</MenuItem>
							<MenuItem value='Inactivos'>Inactivos</MenuItem>
						</Select>
					)}
				/>
			</FormControl>

			{/* Filtro por Modalidad */}
			<FormControl size='small' sx={{ maxWidth: 150 }} fullWidth>
				<InputLabel id='modalidad-label'>Modalidad</InputLabel>
				<Controller
					control={control}
					name='modalidad'
					render={({ field }) => (
						<Select labelId='modalidad-label' label='Modalidad' {...field} value={field.value || ''}>
							<MenuItem value='Todas'>Todas</MenuItem>
							<MenuItem value='Presencial'>Presencial</MenuItem>
							<MenuItem value='Virtual'>Virtual</MenuItem>
							<MenuItem value='Mixto'>Pres + Virtual</MenuItem>
						</Select>
					)}
				/>
			</FormControl>
			{/* </Box> */}
			{/* </Box> */}

			{/* Botón de acción para borrar filtros */}
			<Button
				sx={{
					ml: { xs: 0, sm: 'auto' },
					flexShrink: 0,
				}}
				variant='outlined'
				startIcon={<Delete />}
				onClick={clearFilters}
			>
				Borrar Filtros
			</Button>
		</Box>
	);
};
