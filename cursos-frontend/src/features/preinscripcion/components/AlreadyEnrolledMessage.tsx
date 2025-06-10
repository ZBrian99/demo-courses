import { Box, Typography, Paper } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const AlreadyEnrolledMessage: React.FC = () => {
	return (
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
					backgroundColor: '#FFF4E5', // Color de fondo amarillo suave
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<InfoIcon sx={{ fontSize: '1.5rem', color: '#FF9800' }} /> {/* Color naranja/amarillo para warning */}
			</Box>
			<Box color={'gray.700'}>
				<Typography variant='h3' component='h2' fontWeight='bold' gutterBottom>
					Ya estás inscrito
				</Typography>
				<Typography variant='body1' color='text.secondary'>
					Ya te encuentras inscrito en esta comisión. Si necesitas realizar algún cambio o tienes dudas, 
					por favor comunícate con el equipo.
				</Typography>
			</Box>
		</Paper>
	);
};

export default AlreadyEnrolledMessage; 