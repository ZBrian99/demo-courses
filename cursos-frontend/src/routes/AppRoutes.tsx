// src/routes/index.tsx
import { lazy } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import PrivateRoutes from '../routes/PrivateRoutes';
import RoleRoute from '../routes/RoleRoute';
import { useAppSelector } from '../hooks/hooks';
import { useInitializeAuth } from '../hooks/useInitializeAuth';
import { Box, CircularProgress } from '@mui/material';
// import { CourseDetailsPage } from '../features/courses/pages/CourseDetailsPage';
// import { CommissionsPage } from '../features/comision/pages/CommissionsPage';
// import FormsPage from '../features/form/pages/FormsPage';
// import DashboardLayout from '../layouts/DashboardLayout';
// import LoginPage from '../pages/LoginPage';
// import CoursesPage from './CoursesPage';
import LoginPage from '../features/auth/pages/LoginPage';
import DashboardLayout from '../layouts/DashboardLayout';
import { Role } from '../features/users/types/types';
// import CoursesPage from '../features/courses/pages/CoursesPage';

// const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
// const Dashboard = lazy(() => import('../pages/Dashboard'));
// const CourseDetailsLayout = lazy(() => import('../routes/CourseDetailsLayout'));
// const DashboardLayout = lazy(() => import('../layouts/DashboardLayout'));
const CoursesPage = lazy(() => import('../features/courses/pages/CoursesPage'));
const CourseDetailsPage = lazy(() => import('../features/courses/pages/CourseDetailsPage'));
const CommissionsPage = lazy(() => import('../features/comision/pages/CommissionsPage'));
const FormsPage = lazy(() => import('../features/forms/pages/FormsPage'));
const CreateForm = lazy(() => import('../features/forms/components/CreateForm'));
const ViewForm = lazy(() => import('../features/forms/components/ViewForm'));
// const UsersPage = lazy(() => import('../features/users/page/UsersPage'));
const UserProfilePage = lazy(() => import('../features/users/page/UserProfilePage'));
const PreinscripcionPage = lazy(() => import('../features/preinscripcion/pages/PreinscripcionPage'));
// const FailedRefPage = lazy(() => import('../features/preinscripcion/pages/FailedRefPage'));
const EnrollmentsCommissionsPage = lazy(() => import('../features/enrollments/pages/EnrollmentsCommissionsPage'));
const EnrollmentsPage = lazy(() => import('../features/enrollments/pages/EnrollmentsPage'));
const EnrollmentDetailsPage = lazy(() => import('../features/enrollments/pages/EnrollmentDetailsPage'));
const StaffPage = lazy(() => import('../features/users/pages/StaffPage'));
const StudentsPage = lazy(() => import('../features/users/pages/StudentsPage'));
const AccessDeniedPage = lazy(() => import('../pages/AccessDeniedPage'));
const UnderDevelopmentPage = lazy(() => import('../pages/UnderDevelopmentPage'));

const AppRoutes: React.FC = () => {
	useInitializeAuth();

	const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);

	if (isLoading) {
		return (
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '100vh',
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	// Verificar si el usuario tiene un rol permitido para acceso completo
	const hasValidRole = user?.rol
		? [Role.ADMIN, Role.FINANZAS, Role.PROFESORVENDEDOR, Role.VENDEDOR, Role.PROFESOR].includes(user.rol as Role)
		: false;

	// Verificar si es un estudiante u otro rol conocido
	const isStudent = user?.rol === Role.ALUMNO || user?.rol === Role.USUARIO;

	return (
		<Routes>
			{/* Rutas públicas */}
			<Route path='/ref/:id' element={<PreinscripcionPage />} />
			{/* <Route path='/ref' element={<FailedRefPage />} /> */}
			<Route path='/login' element={isAuthenticated ? <Navigate to='/' /> : <LoginPage />} />

			{/* Redirección inicial según rol */}
			<Route
				path=''
				element={
					isAuthenticated ? (
						hasValidRole ? (
							<Navigate to='/enrollments' />
						) : isStudent ? (
							<Navigate to='/dashboard' />
						) : (
							<AccessDeniedPage />
						)
					) : (
						<Navigate to='/login' />
					)
				}
			/>
			<Route
				path='/'
				element={
					isAuthenticated ? (
						hasValidRole ? (
							<Navigate to='/enrollments' />
						) : isStudent ? (
							<Navigate to='/dashboard' />
						) : (
							<AccessDeniedPage />
						)
					) : (
						<Navigate to='/login' />
					)
				}
			/>

			{/* Rutas Privadas para roles principales */}
			<Route element={<PrivateRoutes />}>
				<Route element={<DashboardLayout />}>
					{/* Rutas existentes para Admin y Finanzas */}
					<Route element={<RoleRoute roles={[Role.ADMIN, Role.FINANZAS]} />}>
						<Route path='/courses' element={<CoursesPage />} />
						<Route path='/courses/:id' element={<CourseDetailsPage />} />
						<Route path='/commissions' element={<CommissionsPage />} />
						<Route path='/forms' element={<FormsPage />} />
						<Route path='/forms/create' element={<CreateForm />} />
						<Route path='/forms/edit/:id' element={<CreateForm />} />
						{/* <Route path='/forms/duplicate/:id' element={<CreateForm />} /> */}
						<Route path='/forms/view/:id' element={<ViewForm />} />
						<Route path='/staff' element={<StaffPage />} />
						<Route path='/staff/view/:userId' element={<UserProfilePage />} />
						<Route path='/staff/edit/:userId' element={<UserProfilePage />} />
					</Route>

					{/* Rutas compartidas existentes */}
					<Route element={<RoleRoute roles={[Role.ADMIN, Role.FINANZAS, Role.PROFESORVENDEDOR, Role.VENDEDOR]} />}>
						<Route path='/enrollments' element={<EnrollmentsCommissionsPage />} />
						<Route path='/enrollments/:comisionId' element={<EnrollmentsPage />} />
						<Route path='/enrollments/:comisionId/:enrollmentId' element={<EnrollmentDetailsPage />} />
						<Route path='/students' element={<StudentsPage />} />
						<Route path='/students/view/:userId' element={<UserProfilePage />} />
						<Route path='/students/edit/:userId' element={<UserProfilePage />} />
					</Route>

					{/* Nueva sección: Rutas para estudiantes */}
					<Route element={<RoleRoute roles={[Role.ALUMNO, Role.USUARIO, Role.PROFESOR]} />}>
						<Route path='/dashboard' element={<UnderDevelopmentPage />} />
					</Route>

					{/* Nueva sección: Rutas para otros roles conocidos */}
					{/* <Route element={<RoleRoute roles={[Role.PROFESOR]} />}>
						<Route path='/dashboard' element={<UnderDevelopmentPage />} />
					</Route> */}
				</Route>
			</Route>

			{/* Rutas de manejo de acceso */}
			<Route path='/access-denied' element={<AccessDeniedPage />} />
			<Route path='/under-development' element={<UnderDevelopmentPage />} />

			{/* Fallback */}
			<Route
				path='*'
				element={
					isAuthenticated ? (
						hasValidRole ? (
              <Navigate to='/enrollments' />
							// <Navigate to='/' />
						) : isStudent ? (
							<Navigate to='/dashboard' />
						) : (
							<AccessDeniedPage />
						)
					) : (
						<Navigate to='/login' />
					)
				}
			/>
		</Routes>
	);
};

export default AppRoutes;
