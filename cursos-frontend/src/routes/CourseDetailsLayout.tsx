import { Outlet } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const CourseDetailsLayout = () => {
	return (
		<Box>
			<Typography variant='h5' component='h2'>
				Detalles del Curso
			</Typography>

			{/* Aquí se renderizan las rutas hijas de un curso */}
			<Outlet />
		</Box>
	);
};

export default CourseDetailsLayout;
