import { Box, Button, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { DatePicker } from '@mui/x-date-pickers';
import { FiltersProps } from '../types/types';

export const Filters: React.FC<FiltersProps> = ({ filters, handleFilterChange, clearFilters, applyFilters }) => {
	return (
		<Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} gap='1rem' mb='2rem'>
			<Box display='flex' flexWrap='wrap' gap='1rem' alignItems='center' flex={1}>
				{/* Filtro por Curso */}
				<FormControl sx={{ minWidth: 200 }}>
					<TextField
						size='small'
						label='Curso'
						value={filters.curso}
						onChange={(e) => handleFilterChange('curso', e.target.value)}
					/>
				</FormControl>
				{/* Filtro por Estado */}

				<FormControl sx={{ minWidth: 200 }} size='small'>
					<InputLabel id='estado-label'>Estado</InputLabel>
					<Select
						labelId='estado-label'
						label='Estado'
						value={filters.estado}
						onChange={(e) => handleFilterChange('estado', e.target.value)}
					>
						<MenuItem value=''>Todos</MenuItem>
						<MenuItem value='Próximo'>Próximo</MenuItem>
						<MenuItem value='En curso'>En curso</MenuItem>
						<MenuItem value='Finalizado'>Finalizado</MenuItem>
					</Select>
				</FormControl>
				{/* Filtro por Modalidad */}
				<FormControl sx={{ minWidth: 200 }} size='small'>
					<InputLabel id='modalidad-label'>Modalidad</InputLabel>
					<Select
						labelId='modalidad-label'
						label='Modalidad'
						value={filters.modalidad}
						onChange={(e) => handleFilterChange('modalidad', e.target.value)}
					>
						<MenuItem value=''>Todas</MenuItem>
						<MenuItem value='Presencial'>Presencial</MenuItem>
						<MenuItem value='Virtual'>Virtual</MenuItem>
						<MenuItem value='Mixto'>Pres + Virtual</MenuItem>
						<MenuItem value='Retiro'>Retiro</MenuItem>
					</Select>
				</FormControl>
				{/* Filtro por Profesor */}
				<FormControl sx={{ minWidth: 200 }}>
					<TextField
						size='small'
						label='Profesor'
						value={filters.profesor}
						onChange={(e) => handleFilterChange('profesor', e.target.value)}
					/>
				</FormControl>
				<DatePicker
					label='Fecha inicio'
					value={filters.fechaInicio}
					onChange={(newValue) => handleFilterChange('fechaInicio', newValue)}
					format='DD/MM/YYYY'
					slotProps={{
						textField: {
							size: 'small',
						},
					}}
				/>

				<DatePicker
					label='Fecha fin'
					value={filters.fechaFin}
					onChange={(newValue) => handleFilterChange('fechaFin', newValue)}
					format='DD/MM/YYYY'
					slotProps={{
						textField: {
							size: 'small',
						},
					}}
				/>
			</Box>

			{/* Botón de aplicar filtros */}
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: '1rem',
					maxWidth: '200px',
				}}
			>
				<Button variant='contained' startIcon={<FilterListIcon />} onClick={applyFilters}>
					Aplicar filtros
				</Button>

				{/* Botón de borrar filtros */}
				<Button variant='outlined' startIcon={<DeleteIcon />} onClick={clearFilters}>
					Borrar filtros
				</Button>
			</Box>
		</Box>
	);
};
