import React from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	IconButton,
	Tooltip,
	Typography,
	CircularProgress,
	Box,
} from '@mui/material';
import { Visibility, Print, VisibilityOutlined } from '@mui/icons-material';
import { Payment } from '../../types/enrollmentsTypes';

interface EnrollmentPaymentsListProps {
	payments?: Payment[];
	isLoading: boolean;
	isError: boolean;
}

const currencyDetails: Record<string, { symbol: string; description: string }> = {
	ARS: { symbol: '$', description: 'Peso argentino' },
	USD: { symbol: '$', description: 'Dólar estadounidense' },
	CLP: { symbol: '$', description: 'Peso chileno' },
	BRL: { symbol: 'R$', description: 'Real brasileño' },
	COP: { symbol: '$', description: 'Peso colombiano' },
	CUP: { symbol: '$', description: 'Peso cubano' },
	EUR: { symbol: '€', description: 'Euro' },
	SVC: { symbol: '₡', description: 'Colón salvadoreño' },
	GTQ: { symbol: 'Q', description: 'Quetzal guatemalteco' },
	HNL: { symbol: 'L', description: 'Lempira hondureño' },
	MXN: { symbol: '$', description: 'Peso mexicano' },
	NIO: { symbol: 'C$', description: 'Córdoba nicaragüense' },
	PAB: { symbol: 'B/.', description: 'Balboa panameño' },
	BOB: { symbol: 'Bs.', description: 'Boliviano' },
	PYG: { symbol: '₲', description: 'Guaraní paraguayo' },
	PEN: { symbol: 'S/', description: 'Sol peruano' },
	DOP: { symbol: '$', description: 'Peso dominicano' },
	UYU: { symbol: '$', description: 'Peso uruguayo' },
	VES: { symbol: 'Bs.', description: 'Bolívar venezolano' },
	GBP: { symbol: '£', description: 'Libra esterlina' },
	CAD: { symbol: '$', description: 'Dólar canadiense' },
	CHF: { symbol: 'CHF', description: 'Franco suizo' },
	JPY: { symbol: '¥', description: 'Yen japonés' },
	CNY: { symbol: '¥', description: 'Yuan chino' },
};

export const EnrollmentPaymentsList: React.FC<
	EnrollmentPaymentsListProps & { onViewPayment: (payment: Payment) => void }
> = ({ payments, isLoading, isError, onViewPayment }) => {
	if (isLoading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (isError) {
		return (
			<Typography color='error' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
				Error al cargar los pagos o no hay pagos disponibles.
			</Typography>
		);
	}
	if (!payments || payments.length === 0) {
		return (
			<Typography color='warning' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
				No se han agregado pagos a esta inscripción.
			</Typography>
		);
	}

	return (
		<TableContainer>
			<Table>
				<TableHead>
					<TableRow
						sx={{
							'& th': {
								pt: '1rem',
								pb: '.5rem',
								backgroundColor: '#F8F7F9',
								borderBottom: '1px solid rgba(224, 224, 224, 1)',
							},
						}}
					>
						<TableCell>Fecha</TableCell>
						<TableCell>Monto</TableCell>
						<TableCell>Moneda</TableCell>
						<TableCell>Método de pago</TableCell>
						<TableCell>Forma de pago</TableCell>
						<TableCell>Cuenta Propia</TableCell>
						<TableCell>Comentario</TableCell>
						<TableCell>Acciones</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{payments.map((payment, index) => {
						const currencyInfo = currencyDetails[payment.moneda] || { symbol: '', description: 'Moneda desconocida' };

						return (
							<TableRow key={payment.id}>
								<TableCell>{new Date(payment.fechaPago).toLocaleDateString()}</TableCell>
								<TableCell>
									{currencyInfo.symbol} {payment.monto}
								</TableCell>
								<TableCell>
									<Tooltip title={currencyInfo.description} arrow placement='right'>
										<span>{payment.moneda}</span>
									</Tooltip>
								</TableCell>
								<TableCell>{payment.metodoPago || 'N/A'}</TableCell>
								<TableCell>{payment.tipoPago || 'N/A'}</TableCell>
								<TableCell>{payment.cuentaPropia ? 'Si' : 'No'}</TableCell>
								<TableCell>
									<Tooltip title={payment.observaciones || ''} arrow placement='right'>
										<span>
											{payment.observaciones && payment.observaciones.length > 15
												? `${payment.observaciones.slice(0, 15)}...`
												: payment.observaciones}
										</span>
									</Tooltip>
								</TableCell>
								<TableCell>
									<Tooltip title='Ver detalles'>
										<IconButton onClick={() => onViewPayment(payment)}>
											<VisibilityOutlined />
										</IconButton>
									</Tooltip>
									{/* <Tooltip title='Imprimir comprobante'>
										<IconButton>
											<Print />
										</IconButton>
									</Tooltip> */}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default EnrollmentPaymentsList;
