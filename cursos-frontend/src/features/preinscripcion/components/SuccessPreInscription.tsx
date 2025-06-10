import { Box, Typography, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const SuccessPreInscription: React.FC = () => {
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
					backgroundColor: '#E7F8EE',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<CheckCircleIcon sx={{ fontSize: '1.5rem', color: '#299959' }} />
			</Box>
			<Box color={'gray.700'}>
				<Typography variant='h3' component='h2' fontWeight='bold' gutterBottom>
					Pre inscripción exitosa
				</Typography>
				<Typography variant='body1' color='primary'>
					Tus datos fueron recibidos con éxito! Pronto te informaremos los próximos pasos a seguir por WhatsApp.
				</Typography>
			</Box>
		</Paper>
	);
};

export default SuccessPreInscription;
