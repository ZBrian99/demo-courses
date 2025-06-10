// components/AppBreadcrumbs.tsx
import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useAppSelector } from '../hooks/hooks';
import { Link as RouterLink } from 'react-router-dom';
import { NavigateNextRounded } from '@mui/icons-material';

const AppBreadcrumbs: React.FC = () => {
	const breadcrumbs = useAppSelector((state) => state.appState.breadcrumbs);

	return (
		<Breadcrumbs
			aria-label='breadcrumb'
			separator={<NavigateNextRounded fontSize='medium' />}
			sx={{
				display: 'flex',
				alignItems: 'center',
				flex: 1,
			}}
		>
			{breadcrumbs.map((crumb, index) =>
				index === breadcrumbs.length - 1 ? (
					<Typography key={index} color='primary' fontWeight={500}>
						{crumb.label}
					</Typography>
				) : (
					<Link
						key={index}
						component={RouterLink}
						color='inherit'
						fontWeight={500}
						to={crumb.path}
						sx={{
							textDecoration: 'none',
							'&:hover': {
								textDecoration: 'none',
							},
						}}
					>
						{crumb.label}
					</Link>
				)
			)}
		</Breadcrumbs>
	);
};

export default AppBreadcrumbs;
