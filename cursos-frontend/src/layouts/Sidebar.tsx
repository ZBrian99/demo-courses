import {
	Box,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Paper,
	Tooltip,
} from '@mui/material';
import { Menu, MenuOpen, Logout } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { forwardRef, Dispatch, SetStateAction } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { logout } from '../features/auth/slices/authSlice';
import { menuItems } from './menuItems';

interface SidebarProps {
	collapsed: boolean;
	isMobile: boolean;
	toggleSidebar?: () => void;
	setCollapsed: Dispatch<SetStateAction<boolean>>;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
	({ collapsed, isMobile, toggleSidebar, setCollapsed }, ref) => {
		const dispatch = useAppDispatch();
		const { user } = useAppSelector((state) => state.auth);

		const handleLogout = () => {
			dispatch(logout());
			if (isMobile) setCollapsed(true);
		};

		const filteredItems = menuItems.filter((item) => item.showFor.includes(user?.rol || ''));

		return (
			<Paper
				ref={ref}
				component='aside'
				sx={{
					position: 'fixed',
					top: isMobile ? 0 : '1rem',
					left: isMobile ? (collapsed ? '-14rem' : 0) : '1rem',
					height: isMobile ? '100vh' : 'calc(100vh - 2rem)',
					width: collapsed ? '3.5rem' : '14rem',
					display: 'flex',
					flexDirection: 'column',
					transition: 'all 0.3s ease-in-out',
					zIndex: 900,
					overflow: 'hidden',
					borderRadius: isMobile ? 0 : '1rem',
				}}
			>
				<ListItem disablePadding>
					<ListItemButton
						onClick={isMobile ? () => setCollapsed(true) : toggleSidebar}
						sx={{ height: { xs: '4rem', md: '3.5rem' }, p: 0, px: '1rem' }}
					>
						<ListItemIcon sx={{ minWidth: 0, ml: 'auto' }}>
							{collapsed ? <Menu fontSize='medium' /> : <MenuOpen fontSize='medium' />}
						</ListItemIcon>
					</ListItemButton>
				</ListItem>

				<Divider />

				<List>
					{filteredItems.map((item) => (
						<Tooltip key={item.path} title={item.label} placement='right' arrow disableHoverListener={!collapsed}>
							<ListItem disablePadding>
								<ListItemButton
									component={Link}
									to={item.path}
									disabled={item.disable}
									onClick={isMobile ? () => setCollapsed(true) : undefined}
									sx={{
										minHeight: { xs: '3.5rem', md: '3rem' },
										px: '1rem',
									}}
								>
									<ListItemIcon sx={{ minWidth: '2.5rem' }}>{item.icon}</ListItemIcon>
									<ListItemText
										primary={item.label}
										sx={{
											whiteSpace: 'nowrap',
										}}
									/>
								</ListItemButton>
							</ListItem>
						</Tooltip>
					))}
				</List>

				<Divider sx={{ mt: 'auto' }} />
				<Tooltip title='Cerrar Sesión' placement='right' arrow disableHoverListener={!collapsed}>
					<ListItem disablePadding>
						<ListItemButton
							onClick={handleLogout}
							sx={{
								height: { xs: '4rem', md: '3.5rem' },
								px: '1rem',
							}}
						>
							<ListItemIcon sx={{ minWidth: '2.5rem' }}>
								<Logout fontSize='medium' />
							</ListItemIcon>
							<ListItemText
								primary='Cerrar Sesión'
								sx={{
									whiteSpace: 'nowrap',
								}}
							/>
						</ListItemButton>
					</ListItem>
				</Tooltip>
			</Paper>
		);
	}
);

export default Sidebar;
