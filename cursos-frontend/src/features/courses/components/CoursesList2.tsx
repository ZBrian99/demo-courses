import React from 'react';
import { Box } from '@mui/material';
import { CoursesListProps } from '../types/types';
import { useDeleteCourseMutation } from '../api/coursesApi';
import { CourseCard } from './CourseCard';

export const CoursesList2: React.FC<CoursesListProps> = ({ 
	filters, 
	openModal, 
	setCourseId,
	courses
}) => {
	const [deleteCourse] = useDeleteCourseMutation();

	const handleEditCourse = (id: string) => {
		setCourseId(id);
		openModal(id);
	};

	const handleRemoveCourse = async (id: string) => {
		try {
			await deleteCourse(id).unwrap();
		} catch (error) {
			console.error('Error deleting course:', error);
		}
	};

	return (
		<Box
			sx={{
				display: 'grid',
				gridTemplateColumns: {
					xs: '1fr',
					sm: 'repeat(auto-fill, minmax(20rem, 1fr))',
				},
				gap: '1.5rem',
				alignItems: 'stretch',
			}}
		>
			{courses.map((course) => (
				<CourseCard 
					key={course.id} 
					course={course} 
					onEdit={handleEditCourse} 
					onDelete={handleRemoveCourse} 
				/>
			))}
		</Box>
	);
};
