import { Box, Button, Typography } from '@mui/material';
import { MoreHoriz, NavigateBefore, NavigateNext } from '@mui/icons-material';

interface CustomPaginationProps {
	currentPage: number;
	totalItems: number;
	itemsPerPage: number;
	onPageChange: (page: number) => void;
}

const CustomPaginationOld: React.FC<CustomPaginationProps> = ({
	currentPage,
	totalItems,
	itemsPerPage,
	onPageChange,
}) => {
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	const pagesToShow = 3; // Número de páginas que siempre se mostrarán centradas.

	// Estilos reutilizables para botones de navegación
	const buttonStyles = {
		p: 0.5,
		fontSize: '0.85rem',
		minWidth: '2rem',
		mx: 0.3,
	};

	// Lógica de cambio de página
	const handlePageChange = (newPage: number) => {
		if (newPage > 0 && newPage <= totalPages) {
			onPageChange(newPage);
		}
	};

	// Calcular las páginas a mostrar
	const getDisplayedPages = () => {
		if (totalPages <= pagesToShow) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		const half = Math.floor(pagesToShow / 2);

		// Mostrar las primeras páginas
		if (currentPage <= half + 1) {
			return [1, 2, 3];
		}

		// Mostrar las últimas páginas
		if (currentPage >= totalPages - half) {
			return [totalPages - 2, totalPages - 1, totalPages];
		}

		// Mostrar las páginas centradas
		return [currentPage - 1, currentPage, currentPage + 1];
	};

	const renderPageNumbers = () => {
		const pages = getDisplayedPages();

		return pages.map((page, index) => (
			<Button
				key={index}
				onClick={() => handlePageChange(page)}
				sx={{
					...buttonStyles,
					...(currentPage === page && {
						backgroundColor: 'primary.main',
						color: 'white',
					}),
				}}
			>
				{page}
			</Button>
		));
	};

	return (
		<Box
			display='flex'
			alignItems='center'
			justifyContent='center'
			sx={{
				position: 'relative',
				fontSize: '0.75rem',
				width: '100%',
			}}
		>
			{/* Contenedor central de páginas */}
			<Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
				{/* Botón para ir a la primera página y ... */}
				{totalPages > 1 && (
					<Box
						sx={{
							position: 'absolute',
							left: '0rem',
							transform: 'translateX(-100%)',
							display: 'flex',
							fontSize: '0.75rem',
						}}
					>
						<Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} sx={buttonStyles}>
							<NavigateBefore />
						</Button>
						{currentPage > 2 && totalPages > 3 && (
							<>
								<Button onClick={() => handlePageChange(1)} sx={buttonStyles}>
									1
								</Button>
								<Typography
									variant='body2'
									sx={{
										display: 'flex',
										alignItems: 'center',
										mx: 0.5,
										color: 'gray',
									}}
								>
									<MoreHoriz sx={{ fontSize: 'inherit' }} />
								</Typography>
							</>
						)}
					</Box>
				)}

				{/* Renderizar números de página */}
				{renderPageNumbers()}

				{/* Botón para ir a la última página y ... */}
				{totalPages > 1 && (
					<Box
						sx={{
							position: 'absolute',
							right: '0rem',
							transform: 'translateX(100%)',
							display: 'flex',
							fontSize: '0.75rem',
						}}
					>
						{currentPage < totalPages - 1 && totalPages > 3 && (
							<>
								<Typography
									variant='body2'
									sx={{
										display: 'flex',
										alignItems: 'center',
										mx: 0.5,
										color: 'gray',
									}}
								>
									<MoreHoriz sx={{ fontSize: 'inherit' }} />
								</Typography>
								<Button onClick={() => handlePageChange(totalPages)} sx={buttonStyles}>
									{totalPages}
								</Button>
							</>
						)}
						<Button
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
							sx={buttonStyles}
						>
							<NavigateNext />
						</Button>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default CustomPaginationOld;
