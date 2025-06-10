import React, { lazy, Suspense, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import AuthFormSteps from '../components/AuthFormSteps';
import EnrollmentInfo from '../components/EnrollmentInfo';
import SuccessPreInscription from '../components/SuccessPreInscription';
import PreInscriptionForm from '../components/PreInscriptionForm';
import AlreadyEnrolledMessage from '../components/AlreadyEnrolledMessage';
import { useParams } from 'react-router-dom';
import { useFindByRefQuery } from '../api/preinscripcionApi';
import { User } from '../types/types';

const FailedRefPage = lazy(() => import('./FailedRefPage'));

const PreinscripcionPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { data, isLoading, isError } = useFindByRefQuery({ ref: id as string }, { skip: !id });
	const [step, setStep] = useState(1);
	const [user, setUser] = useState<User | null>(null);
	const [formId, setFormId] = useState('');

	const handleUserVerification = (user: User | null) => {
		if (user) {
			setUser(user);
			setStep(3);
		} else {
			setStep(2);
		}
	};

	// Muestra un mensaje de carga mientras la consulta está en proceso
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

	// Muestra la página de error si no hay datos (el `ref` no existe) o si ocurrió un error
	if (isError || !data) {
		return (
			<Suspense
				fallback={
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
				}
			>
				<FailedRefPage />
			</Suspense>
		);
	}

	// Renderiza el contenido principal si los datos son correctos
	return (
		<Box
			sx={{
				padding: '1rem',
				minHeight: '100vh',
				overflow: 'auto',
				maxHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column',
				width: '100%',
				bgcolor: 'primary.light',
			}}
		>
			{step === 1 || step === 2 ? (
				<AuthFormSteps step={step} handleUserVerification={handleUserVerification} setStep={setStep} />
			) : step === 3 ? (
				<EnrollmentInfo setStep={setStep} setFormId={setFormId} />
			) : step === 4 && user ? (
				<PreInscriptionForm user={user} formId={formId} setStep={setStep} />
			) : step === 5 ? (
				<SuccessPreInscription />
			) : step === 6 ? (
				<AlreadyEnrolledMessage />
			) : null}
		</Box>
	);
};

export default PreinscripcionPage;
