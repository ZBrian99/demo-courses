import React from 'react';
import { Box } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { useAppDispatch } from '../../../hooks/hooks';
import CommissionDetails from './StepForm1/CommissionDetails';
import ModalitySection from './StepForm1/ModalitySection';
import ScheduleSection from './StepForm1/ScheduleSection';
import { useGetCoursesQuery } from '../../courses/api/coursesApi';

interface StepForm1Props {
	isFromCourse?: boolean;
}

const StepForm1: React.FC<StepForm1Props> = ({ isFromCourse }) => {
	const dispatch = useAppDispatch();
	const { data: coursesData = { items: [] } } = useGetCoursesQuery({
		page: 1,
		limit: 1000,
	});
	const { control, setValue } = useFormContext();

	const modalidad = useWatch({ control, name: 'modalidad' });
	const fechaInicio = useWatch({ control, name: 'fechaInicio' });
	const fechaFin = useWatch({ control, name: 'fechaFin' });

	React.useEffect(() => {
		if (modalidad === 'Virtual') {
			setValue('cupo', undefined);
			setValue('ubicacion', undefined);
		}
	}, [modalidad, setValue]);

	return (
		<Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
			<CommissionDetails 
				courses={coursesData.items}
				isFromCourse={isFromCourse}
				modalidad={modalidad}
			/>
			<ModalitySection modalidad={modalidad}/>
			<ScheduleSection 
				fechaInicio={fechaInicio}
				fechaFin={fechaFin}
			/>
		</Box>
	);
};

export default StepForm1;
