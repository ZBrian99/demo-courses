import { Box, Typography, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import { Course } from '../types/types';
import { Link } from 'react-router-dom';
import { Delete, Edit } from '@mui/icons-material';

interface ActiveCoursesProps {
	courses: Course[];
}

export const ActiveCourses: React.FC<ActiveCoursesProps> = ({ courses }) => {
	return (
		<Box mb='2rem'>
			<Typography variant='h6' gutterBottom>
				Cursos activos
			</Typography>
			<Box display='flex' flexWrap='wrap' gap='1rem'>
				{courses.map((course) => (
					<Box key={course.id} component={Link} to={`/courses/${course.id}`}>
						<Card>
							<CardMedia
								component='img'
								height='140'
								image={`https://via.placeholder.com/300x140?text=${course.codigo}`}
								alt={course.nombre}
							/>
							<CardContent>
								<Typography variant='body2'>{course.nombre}</Typography>
							</CardContent>
						</Card>
					</Box>
				))}
			</Box>
		</Box>
	);
};
