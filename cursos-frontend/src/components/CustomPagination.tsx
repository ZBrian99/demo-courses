import React from 'react';
import { Box, Button, Typography, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { NavigateBefore, NavigateNext, FirstPage, LastPage } from '@mui/icons-material';

interface CustomPaginationProps {
	currentPage?: number;
	totalItems?: number;
	itemsPerPage?: number;
	totalPages?: number;
	hasNextPage?: boolean;
	hasPreviousPage?: boolean;
	onPageChange: (page: number) => void;
	onItemsPerPageChange: (itemsPerPage: number) => void;
	small?: boolean;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
	currentPage = 1,
	totalItems = 0,
	itemsPerPage = 20,
	totalPages = 1,
	hasNextPage = false,
	hasPreviousPage = false,
	onPageChange,
	onItemsPerPageChange,
	small = false,
}) => {
	const handleItemsPerPageChange = (event: SelectChangeEvent<number>) => {
		onItemsPerPageChange(Number(event.target.value));
	};

	const itemsPerPageOptions = small ? [5, 10, 20] : [20, 50, 100];

	return (
		<Box
			display='flex'
			flexDirection={{ xs: 'column', sm: 'row' }}
			justifyContent='space-between'
			
			alignItems='center'
			sx={{ 
				mt: small ? 1 : 'auto', 
				gap: small ? 1 : 2, 
				pt: small ? 1 : 2,
				'& .MuiButton-root': small ? {
					padding: '0.25rem',
					minWidth: '1.5rem'
				} : {},
				'& .MuiTypography-root': small ? {
					fontSize: '0.75rem'
				} : {}
			}}
		>
			{/* Selector de cantidad de elementos por página */}
			<Box display='flex' justifyContent='center' alignItems='center' flexWrap='wrap' sx={{ gap: 1 }}>
				<Typography variant='body2'>Resultados por página:</Typography>
				<Select value={itemsPerPage} onChange={handleItemsPerPageChange} size='small' sx={{ minWidth: 70 }}>
					{itemsPerPageOptions.map((option) => (
						<MenuItem key={option} value={option}>
							{option}
						</MenuItem>
					))}
				</Select>
			</Box>

			{/* Controles de paginación */}
			<Box display='flex' alignItems='center' flexWrap='wrap' sx={{ gap: 1 }}>
				<Typography variant='body2' sx={{ display: { xs: 'none', sm: 'block' } }}>
					{currentPage} de {totalPages}
				</Typography>
				<Button onClick={() => onPageChange(1)} disabled={!hasPreviousPage} sx={{ minWidth: '2rem' }}>
					<FirstPage />
				</Button>
				<Button onClick={() => onPageChange(currentPage - 1)} disabled={!hasPreviousPage} sx={{ minWidth: '2rem' }}>
					<NavigateBefore />
				</Button>

				<Typography variant='body2' sx={{ mx: 2 }}>
					{currentPage}
				</Typography>

				<Button onClick={() => onPageChange(currentPage + 1)} disabled={!hasNextPage} sx={{ minWidth: '2rem' }}>
					<NavigateNext />
				</Button>
				<Button onClick={() => onPageChange(totalPages)} disabled={!hasNextPage} sx={{ minWidth: '2rem' }}>
					<LastPage />
				</Button>
			</Box>
		</Box>
	);
};

export default CustomPagination;
