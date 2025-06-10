import React from 'react';
import { Box, Chip, styled, Typography, useTheme } from '@mui/material';

interface CustomStepperProps {
	title: string;
	subtitle?: string;
	label?: string;
	steps: string[];
	activeStep: number;
}

const ProgressBar = styled(Box)(({ theme }) => ({
	width: '100%',
	backgroundColor: theme.palette.gray[300],
	height: '.25rem',
	borderRadius: '5rem',
	position: 'relative',
	overflow: 'hidden',
}));

const ProgressFiller = styled(Box)<{ progress: number }>(({ progress, theme }) => ({
	height: '100%',
	width: `${progress}%`,
	backgroundColor: theme.palette.primary.main,
	transition: 'width 0.4s ease-in-out',
	borderRadius: '5rem',
}));

const CustomStepperNew: React.FC<CustomStepperProps> = ({ title, subtitle, label, steps, activeStep }) => {
	const theme = useTheme();

	const totalSteps = steps.length;
	const progress = ((activeStep + 1) / totalSteps) * 100;

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				position: 'relative',
				zIndex: 200,
				color: 'gray.800',
			}}
		>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Typography variant='h6' fontWeight='500'>
					{title}
				</Typography>

				{label && (
					<Chip
						label={label}
						variant='outlined'
						color='primary'
						sx={{
							borderRadius: '.25rem',
							backgroundColor: 'primary.light',
							fontWeight: '500',
						}}
					/>
				)}
			</Box>
			{subtitle && (
				<Typography variant='body2' color='gray.700'>
					{subtitle}
				</Typography>
			)}
			<Typography variant='body2' color='gray.800' mt={'1rem'} mb={'.5rem'}>
				<Typography variant='body2' component={'span'} fontWeight={700}>
					{`Paso ${activeStep + 1}: `}
					{/* {`Paso ${activeStep + 1} de ${totalSteps}: `} */}
				</Typography>
				{steps[activeStep]}
			</Typography>
			<ProgressBar>
				<ProgressFiller progress={progress} />
			</ProgressBar>
		</Box>
	);
};

export default CustomStepperNew;
