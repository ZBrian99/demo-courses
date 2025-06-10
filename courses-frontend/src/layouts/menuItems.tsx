import { AppRegistrationOutlined, AutoStoriesOutlined, LibraryBooksOutlined, DescriptionOutlined, BadgeOutlined, SchoolOutlined } from '@mui/icons-material';
import { Role } from '../features/users/types/types';

export interface MenuItem {
	icon: JSX.Element;
	label: string;
	path: string;
	disable?: boolean;
	showFor: string[];
}

export const menuItems: MenuItem[] = [
	{
		icon: <AppRegistrationOutlined fontSize='medium' />,
		label: 'Inscripciones',
		path: '/enrollments',
		showFor: [Role.ADMIN, Role.FINANZAS, Role.VENDEDOR, Role.PROFESORVENDEDOR],
	},

	{
		icon: <AutoStoriesOutlined fontSize='medium' />,
		label: 'Cursos',
		path: '/courses',
		showFor: [Role.ADMIN, Role.FINANZAS],
	},

	{
		icon: <LibraryBooksOutlined fontSize='medium' />,
		label: 'Comisiones',
		path: '/commissions',
		showFor: [Role.ADMIN, Role.FINANZAS],
	},

	{
		icon: <DescriptionOutlined fontSize='medium' />,
		label: 'Formularios',
		path: '/forms',
		showFor: [Role.ADMIN, Role.FINANZAS],
	},

	{
		icon: <BadgeOutlined fontSize='medium' />,
		label: 'Personal',
		path: '/staff',
		showFor: [Role.ADMIN, Role.FINANZAS],
	},

	{
		icon: <SchoolOutlined fontSize='medium' />,
		label: 'Alumnos',
		path: '/students',
		showFor: [Role.ADMIN, Role.FINANZAS, Role.PROFESORVENDEDOR, Role.VENDEDOR],
	},

]; 