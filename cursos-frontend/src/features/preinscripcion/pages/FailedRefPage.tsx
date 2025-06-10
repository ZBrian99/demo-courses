import { Box, Typography, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const FailedRefPage: React.FC = () => {
	return (
		<Box
			sx={{
				padding: '1rem',
				minHeight: '100vh',
				overflow: 'auto',
				maxHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column',
				width: '100%',
				bgcolor: 'primary.light',
			}}
		>
			<Paper
				sx={{
					width: '100%',
					maxWidth: '25rem',
					textAlign: 'center',
					display: 'flex',
					flexDirection: 'column',
					gap: '1rem',
					padding: '1.5rem',
					borderRadius: '1rem',
					alignItems: 'center',
					mt: '5rem',
					bgcolor: '#FCFCFC',
				}}
			>
				<Box
					sx={{
						padding: '1rem',
						borderRadius: '50%',
						backgroundColor: '#FDECEA',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<ErrorOutlineIcon sx={{ fontSize: '1.5rem', color: '#D32F2F' }} />
				</Box>
				<Box color={'gray.700'}>
					<Typography variant='h3' component='h2' fontWeight='bold' gutterBottom>
						Link no válido
					</Typography>
					<Typography variant='body1' color='primary'>
						El enlace de referido es incorrecto o no está habilitado. Por favor, comunícate con el equipo o persona que
						te proporcionó el enlace para más detalles.
					</Typography>
				</Box>
			</Paper>
		</Box>
	);
};

export default FailedRefPage;
