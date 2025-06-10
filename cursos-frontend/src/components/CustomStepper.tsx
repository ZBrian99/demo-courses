import React from 'react';
import { Box, styled, Typography, useTheme } from '@mui/material';

interface CustomStepperProps {
	title: string;
	steps: string[];
	activeStep: number;
}

const ProgressBar = styled(Box)(({ theme }) => ({
	width: '100%',
	backgroundColor: theme.palette.gray[300],
	position: 'absolute',
	left: 0,
	bottom: 0,
	height: '.25rem',
  zIndex: 100,
  borderRadius: '5rem',
	// transform: 'translateY(-100%)',
}));

const ProgressFiller = styled(Box)<{ progress: number }>(({ progress, theme }) => ({
	height: '100%',
	width: `${progress}%`,
	backgroundColor: theme.palette.primary.main,
	transition: 'width 0.3s ease-in-out',
	borderRadius: '5rem',
}));

// const StepDivider = styled(Box)(({ theme }) => ({
// 	width: '2px',
// 	backgroundColor: theme.palette.gray[400],
// 	height: '100%',
//   position: 'absolute',
//   top: 0,
// }));

const CustomStepper: React.FC<CustomStepperProps> = ({ title, steps, activeStep }) => {

	const totalSteps = steps.length;
	const progress = ((activeStep + 1) / totalSteps) * 100;
	// const stepWidth = 100 / totalSteps;

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				gap: '1rem',
				zIndex: 200,
        position: 'relative',
        pt: '2rem',
        pb: '1rem',
        mx: '2rem',
			}}
		>
			<Typography variant='h4'>{title}</Typography>
			<Typography variant='h6' fontWeight={'normal'} fontSize={'small'}>{`Paso ${activeStep + 1}: ${
				steps[activeStep]
			}`}</Typography>
			<ProgressBar>
				<ProgressFiller progress={progress} />
			</ProgressBar>
		</Box>
	);
};

export default CustomStepper;
