// DashboardLayout.tsx
import { Suspense, useRef, useState, useEffect } from 'react';
import { useMediaQuery, Box, CircularProgress, IconButton, Paper } from '@mui/material';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import AppBreadcrumbs from '../components/AppBreadcrumbs';
import AppSnackbar from '../components/AppSnackbar';
import { Menu } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const LoadingFallback = () => (
	<Box display='flex' alignItems='center' justifyContent='center' minHeight='100vh'>
		<CircularProgress />
	</Box>
);

const DashboardLayout = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const [collapsed, setCollapsed] = useState(true);
	const sidebarRef = useRef<HTMLDivElement>(null);

	const handleToggleSidebar = () => {
		setCollapsed(!collapsed);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (isMobile && !collapsed && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
			setCollapsed(true);
		}
	};

	useEffect(() => {
		setCollapsed(true);
	}, [isMobile]);

	useEffect(() => {
		if (isMobile && !collapsed) {
			document.addEventListener('mousedown', handleClickOutside);
			return () => document.removeEventListener('mousedown', handleClickOutside);
		}
	}, [isMobile, collapsed]);

	return (
		<Box
			sx={{
				marginLeft: isMobile ? 0 : collapsed ? '4.5rem' : '15rem',
				transition: 'margin-left 0.3s ease-in-out',
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				position: 'relative',
				padding: isMobile ? 0 : '1rem',
				gap: '1rem',
			}}
		>
			<Sidebar
				ref={sidebarRef}
				collapsed={collapsed}
				isMobile={isMobile}
				toggleSidebar={handleToggleSidebar}
				setCollapsed={setCollapsed}
			/>

			<Paper
				sx={{
					display: 'flex',
					alignItems: 'center',
					width: '100%',
					gap: '.5rem',
					justifyContent: 'space-between',
					height: { xs: '4rem', md: '3.5rem' },
					bgcolor: 'common.white',
					px: { xs: '1rem', md: '1.5rem' },
					pl: { xs: '.5rem', md: '1.5rem' },
					borderRadius: { xs: 0, md: '1rem' },
				}}
			>
				{isMobile && (
					<IconButton
						onClick={() => setCollapsed(false)}
						edge='start'
						sx={{
							width: '3.5rem',
							height: '3.5rem',
							minWidth: '0',
							bgcolor: 'common.white',
						}}
					>
						<Menu fontSize='medium' />
					</IconButton>
				)}
				<AppBreadcrumbs />
			</Paper>

			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: '1rem',
					flexGrow: 1,
					maxWidth: '100rem',
					width: '100%',
					mx: 'auto',
				}}
			>
				<Suspense fallback={<LoadingFallback />}>
					<Outlet />
				</Suspense>
			</Box>

			<AppSnackbar />
		</Box>
	);
};

export default DashboardLayout;
