import React, { useCallback, memo } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	IconButton,
	Tooltip,
	Typography,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import {
	EnrollmentsListProps,
	Enrollment,
	EnrollmentStatus,
	PaymentFormData,
	ObservationFormData,
	AddObservation,
} from '../types/enrollmentsTypes';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { EnrollmentActionMenu } from './menus/EnrollmentActionMenu';
import {
	useAddObservationMutation,
	useAddPaymentMutation,
	useUpdateEnrollmentStatusMutation,
} from '../api/enrollmentsApi';
import { useAppDispatch } from '../../../hooks/hooks';
import { showSnackbar } from '../../appState/slices/appStateSlice';
import { getColorKey } from '../utils/statusConfig';
import { AppDispatch } from '../../../app/store';
import { EnrollmentStatusCell } from './cells/EnrollmentStatusCell';
import { EnrollmentPaymentCell } from './cells/EnrollmentPaymentCell';

// Definir interfaces para los diferentes tipos de columnas
interface BaseColumn {
	id: string;
	label: string;
}

interface FixedWidthColumn extends BaseColumn {
	width: string;
	minWidth?: never;
	maxWidth?: never;
}

interface FlexibleWidthColumn extends BaseColumn {
	width?: never;
	minWidth?: string;
	maxWidth?: string;
}

type ColumnDefinition = FixedWidthColumn | FlexibleWidthColumn;

// Definir las columnas con el tipo correcto
const columns: ColumnDefinition[] = [
	{ id: 'status', label: '' },
	{ id: 'observations', label: 'Observaciones', maxWidth: '20rem' },
	{ id: 'totalAgreed', label: 'Total acordado' },
	{ id: 'installments', label: 'Cuotas' },
	{ id: 'paid', label: 'Pagado', maxWidth: '12rem' },
	// { id: 'paid', label: 'Pagado', maxWidth: '12rem' },
	{ id: 'fullNameVendedor', label: 'Vendedor' },
	{ id: 'fullName', label: 'Alumno' },
	{ id: 'phone', label: 'Teléfono' },
	{ id: 'country', label: 'País' },
	{ id: 'date', label: 'Fecha' },
	{ id: 'actions', label: '' },
];

const EnrollmentRow = memo(
	({
		enrollment,
		onMenuOpen,
	}: {
		enrollment: Enrollment;
		onMenuOpen: (event: React.MouseEvent<HTMLElement>, id: string) => void;
	}) => (
		<TableRow
			hover
			sx={{
				backgroundColor: (theme) => {
					const colorKey = getColorKey(enrollment.estado);
					return theme.palette.state[colorKey].lighter;
				},
				'&:nth-of-type(odd)': {
					backgroundColor: (theme) => {
						const colorKey = getColorKey(enrollment.estado);
						return theme.palette.state[colorKey].lighter;
					},
				},
				'&:nth-of-type(even)': {
					backgroundColor: (theme) => {
						const colorKey = getColorKey(enrollment.estado);
						return theme.palette.state[colorKey].lighter;
					},
				},
				'&:hover': {
					backgroundColor: (theme) => {
						const colorKey = getColorKey(enrollment.estado);
						return `${theme.palette.state[colorKey].light}`;
					},
					'&:nth-of-type(odd)': {
						backgroundColor: (theme) => {
							const colorKey = getColorKey(enrollment.estado);
							return `${theme.palette.state[colorKey].light}`;
						},
					},
					'&:nth-of-type(even)': {
						backgroundColor: (theme) => {
							const colorKey = getColorKey(enrollment.estado);
							return `${theme.palette.state[colorKey].light}`;
						},
					},
				},
			}}
		>
			<TableCell sx={{ padding: '1px', verticalAlign: 'middle' }}>
				<EnrollmentStatusCell status={enrollment.estado} />
			</TableCell>
			<TableCell>
				<Tooltip title={enrollment.observaciones || ''} arrow placement='bottom'>
					<Typography
						variant='body2'
						sx={{
							maxWidth: '80ch',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
						}}
					>
						{enrollment.observaciones || ''}
					</Typography>
				</Tooltip>
			</TableCell>
			<TableCell sx={{ fontSize: '14px' }}>{enrollment.totalAcordado || ''}</TableCell>
			<TableCell sx={{ fontSize: '14px' }}>{enrollment.cantidadCuotas || ''}</TableCell>
			<TableCell sx={{ fontSize: '14px' }}>
				<EnrollmentPaymentCell payments={enrollment.pagos || []} />
			</TableCell>
			<TableCell sx={{ fontSize: '14px' }}>
				{`${enrollment.vendedor?.usuario?.nombre || ''} ${enrollment.vendedor?.usuario?.apellido || ''}`}
			</TableCell>
			<TableCell sx={{ fontSize: '14px' }}>
				{`${enrollment.alumno?.usuario?.nombre || ''} ${enrollment.alumno?.usuario?.apellido || ''}`}
			</TableCell>
			<TableCell sx={{ fontSize: '14px' }}>{enrollment.alumno?.usuario?.telefono || ''}</TableCell>
			<TableCell sx={{ fontSize: '14px' }}>{enrollment.alumno?.usuario?.pais || ''}</TableCell>
			<TableCell sx={{ fontSize: '14px' }}>{dayjs(enrollment.createdAt).format('DD/MM/YYYY')}</TableCell>
			<TableCell
				sx={{
					position: 'sticky',
					right: 0,
					backgroundColor: 'inherit',
					padding: '1px',
					paddingLeft: '2px',
					'&::before': {
						content: '""',
						position: 'absolute',
						left: 0,
						top: 0,
						bottom: 0,
						width: '1px',
						backgroundColor: '#DEDFE3',
						zIndex: 1,
					},
				}}
			>
				<IconButton
					onClick={(e) => onMenuOpen(e, enrollment.id)}
					size='small'
					sx={{
						color: 'text.secondary',
						padding: '.25rem',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						mx: 'auto',
					}}
				>
					<MoreVert />
				</IconButton>
			</TableCell>
		</TableRow>
	)
);
const TableHeader = () => (
	<TableHead>
		<TableRow>
			{columns.map((column) => (
				<TableCell
					key={column.id}
					sx={{
						fontWeight: 500,
						fontSize: '14px',
						...(column.id === 'actions' && {
							position: 'sticky',
							right: 0,
							zIndex: 3,
							'&::before': {
								content: '""',
								position: 'absolute',
								left: 0,
								top: 0,
								bottom: 0,
								width: '1px',
								backgroundColor: '#DEDFE3',
								zIndex: 1,
							},
						}),
					}}
				>
					{column.label}
				</TableCell>
			))}
		</TableRow>
	</TableHead>
);

// Modificar el tipo MenuState y MenuAction
interface MenuState {
	anchorEl: HTMLElement | null;
	selectedId: string | null;
	isModalOpen: boolean; // Nuevo campo para controlar si hay algún modal abierto
}

type MenuAction =
	| { type: 'open'; payload: { anchorEl: HTMLElement; id: string } }
	| { type: 'close' }
	| { type: 'setModalOpen'; payload: boolean };

const menuReducer = (state: MenuState, action: MenuAction): MenuState => {
	switch (action.type) {
		case 'open':
			return {
				anchorEl: action.payload.anchorEl,
				selectedId: action.payload.id,
				isModalOpen: false,
			};
		case 'close':
			return {
				...state,
				anchorEl: null,
				isModalOpen: false,
			};
		case 'setModalOpen':
			return {
				...state,
				isModalOpen: action.payload,
			};
		default:
			return state;
	}
};

// Extraer la lógica de las mutaciones a hooks personalizados
const useEnrollmentMutations = (menuState: MenuState, dispatch: AppDispatch) => {
	const [addPayment] = useAddPaymentMutation();
	const [addObservation] = useAddObservationMutation();
	const [updateEnrollmentStatus] = useUpdateEnrollmentStatusMutation();

	const handleAddPayment = useCallback(
		async (paymentData: PaymentFormData) => {
			if (!menuState.selectedId) return;

			try {
				await addPayment({
					id: menuState.selectedId,
					payment: paymentData,
				}).unwrap();
				dispatch(showSnackbar({ message: 'Pago agregado correctamente', severity: 'success' }));
			} catch (error) {
				console.error('Error al agregar pago:', error);
				dispatch(showSnackbar({ message: 'Error al agregar el pago', severity: 'error' }));
			}
		},
		[addPayment, dispatch, menuState.selectedId]
	);

	const handleAddObservation = useCallback(
		async (data: AddObservation) => {
			if (!menuState.selectedId) return;

			try {
				await addObservation({
					id: menuState.selectedId,
					observation: data,
				}).unwrap();
				dispatch(showSnackbar({ message: 'Observación añadida correctamente', severity: 'success' }));
			} catch (error) {
				console.error('Error al añadir observación:', error);
				dispatch(showSnackbar({ message: 'Error al añadir la observación', severity: 'error' }));
			}
		},
		[addObservation, dispatch, menuState.selectedId]
	);

	const handleStatusChange = useCallback(
		async (newStatus: EnrollmentStatus) => {
			if (!menuState.selectedId) return;

			try {
				await updateEnrollmentStatus({
					id: menuState.selectedId,
					estado: newStatus,
				}).unwrap();
				dispatch(showSnackbar({ message: `Estado actualizado a ${newStatus}`, severity: 'success' }));
			} catch (error) {
				dispatch(showSnackbar({ message: 'Error al cambiar el estado', severity: 'error' }));
			}
		},
		[updateEnrollmentStatus, dispatch, menuState.selectedId]
	);

	return { handleAddPayment, handleAddObservation, handleStatusChange };
};

export const EnrollmentsListNew: React.FC<EnrollmentsListProps> = ({ enrollments = [] }) => {
	const navigate = useNavigate();
	const { comisionId } = useParams<{ comisionId: string }>();

	const [menuState, dispatch] = React.useReducer(menuReducer, {
		anchorEl: null,
		selectedId: null,
		isModalOpen: false,
	});

	const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>, id: string) => {
		event.stopPropagation();
		dispatch({ type: 'open', payload: { anchorEl: event.currentTarget, id } });
	}, []);

	const handleMenuClose = useCallback(() => {
		if (!menuState.isModalOpen) {
			dispatch({ type: 'close' });
		}
	}, [menuState.isModalOpen]);

	const handleViewDetails = useCallback(() => {
		if (menuState.selectedId) {
			navigate(`/enrollments/${comisionId}/${menuState.selectedId}`);
		}
		handleMenuClose();
	}, [comisionId, navigate, menuState.selectedId]);

	const { handleAddPayment, handleAddObservation, handleStatusChange } = useEnrollmentMutations(
		menuState,
		dispatch as AppDispatch
	);

	// Crear el objeto mapa directamente
	const enrollmentsMap = Object.fromEntries(enrollments.map((enrollment) => [enrollment.id, enrollment]));

	// Acceso directo por ID
	const selectedEnrollment = menuState.selectedId ? enrollmentsMap[menuState.selectedId] : null;

	return (
		<>
			<TableContainer
				sx={{
					position: 'relative',
					'& th:nth-last-child(2)': {
						borderRight: 'none',
					},
					'& td:nth-last-child(2)': {
						borderRight: 'none',
					},
				}}
			>
				<Table size='small'>
					<TableHeader />
					<TableBody>
						{enrollments.map((enrollment) => (
							<EnrollmentRow key={enrollment.id} enrollment={enrollment} onMenuOpen={handleMenuOpen} />
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<EnrollmentActionMenu
				anchorEl={menuState.anchorEl}
				onClose={handleMenuClose}
				onViewDetails={handleViewDetails}
				onAddObservation={handleAddObservation}
				onAddPayment={handleAddPayment}
				onStatusChange={handleStatusChange}
				enrollment={selectedEnrollment}
			/>
		</>
	);
};

export default EnrollmentsListNew;
