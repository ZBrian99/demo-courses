import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../hooks/hooks';

interface RoleRouteProps {
	roles: string[];
}

const RoleRoute: React.FC<RoleRouteProps> = ({ roles }) => {
	const { user } = useAppSelector((state) => state.auth);

	if (!user || !roles.includes(user.rol)) {
		return <Navigate to='/dashboard' />;
	}

	return <Outlet />;
};

export default RoleRoute;
