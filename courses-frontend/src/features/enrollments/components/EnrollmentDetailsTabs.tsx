// EnrollmentDetailsTabs.tsx
import React, { useState } from 'react';
import { Tabs, Tab, Box, Paper } from '@mui/material';
import { Enrollment } from '../types/enrollmentsTypes';
import { EnrollmentInfo } from './details/EnrollmentInfo';
import { EnrollmentResponses } from './details/EnrollmentResponses';
import { EnrollmentPayments } from './details/EnrollmentPayments';

interface EnrollmentDetailsTabsProps {
	enrollment: Enrollment;
}

export const EnrollmentDetailsTabs: React.FC<EnrollmentDetailsTabsProps> = ({ enrollment }) => {
	const [selectedTab, setSelectedTab] = useState(0);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setSelectedTab(newValue);
	};

	return (
		<Paper
			sx={{
				p: '1rem',
				borderRadius: { xs: 0, md: '1rem' },
				backgroundColor: 'common.white',
				flexGrow: 1,
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<Tabs
				value={selectedTab}
				onChange={handleTabChange}
				variant='scrollable'
				scrollButtons='auto'
				sx={{
					position: 'relative',
					'.MuiTabs-indicator': {
						zIndex: 2,
					},
					'&::after': {
						content: '""',
						position: 'absolute',
						bottom: 0,
						left: 0,
						width: '100%',
						height: '1px',
						backgroundColor: '#C2C4CB',
					},
				}}
			>
				<Tab
					label='Datos de inscripción'
					sx={{
						textTransform: 'none',
					}}
				/>
				<Tab
					label='Respuestas'
					sx={{
						textTransform: 'none',
					}}
				/>
				<Tab
					label='Pagos'
					sx={{
						textTransform: 'none',
					}}
				/>
			</Tabs>
			<Box
				sx={{
					pt: '1rem',
					display: 'flex',
					flexDirection: 'column',
					gap: '1rem',
					flexGrow: 1,
				}}
			>
				{selectedTab === 0 && <EnrollmentInfo enrollment={enrollment} />}
				{selectedTab === 1 && <EnrollmentResponses />}
				{selectedTab === 2 && <EnrollmentPayments />}
			</Box>
		</Paper>
	);
};
