// import { Outlet } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { CoursesPage } from '../features/courses/pages/CoursesPage';
// import CoursesPage from '../features/courses/pages/CoursesPage';

const CoursesLayout = () => {
	return (
		<Box>

			<Typography variant='h4' component='h1'>
				Gestión de Cursos
			</Typography>
			<CoursesPage />
			{/* Aquí se renderizan las rutas hijas */}
			{/* <Outlet /> */}
		</Box>
	);
};

export default CoursesLayout;
