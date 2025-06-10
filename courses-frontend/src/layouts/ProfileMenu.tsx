import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, styled } from '@mui/material';
import { Person, Settings, Logout } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/hooks';
import { logout } from '../features/auth/slices/authSlice';



const ProfileMenuContainer = styled(Paper, {
	shouldForwardProp: (prop) => prop !== 'isOpen',
})<ProfileMenuProps>(({ theme, isOpen }) => ({
	position: 'absolute',
	top: '4.5rem',
	right: '1rem',
	// backgroundColor: theme.palette.background.paper,
	// boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
	borderRadius: '0.5rem',
	display: isOpen ? 'block' : 'none',
	zIndex: 1000,
	width: '12rem',
}));
interface ProfileMenuProps {
	isOpen: boolean;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ isOpen }) => {
	const dispatch = useAppDispatch();
	// const navigate = useNavigate();

	const handleLogout = () => {
		dispatch(logout());
		// navigate('/login');
	};
	return (
		<ProfileMenuContainer isOpen={isOpen}>
			<List>
				<ListItem disablePadding>
					<ListItemButton>
						<ListItemIcon>
							<Person />
						</ListItemIcon>
						<ListItemText primary='Ver Perfil' />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton>
						<ListItemIcon>
							<Settings />
						</ListItemIcon>
						<ListItemText primary='Configuración' />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton onClick={handleLogout}>
						<ListItemIcon>
							<Logout />
						</ListItemIcon>
						<ListItemText primary='Cerrar Sesión' />
					</ListItemButton>
				</ListItem>
			</List>
		</ProfileMenuContainer>
	);
};

export default ProfileMenu;
