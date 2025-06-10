import React, { useState } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import EnrollmentPaymentsList from './EnrollmentPaymentsList';
import EnrollmentPaymentModal from './EnrollmentPaymentModal';
import { useGetPaymentsByEnrollmentIdQuery, useAddPaymentMutation } from '../../api/enrollmentsApi';
import { useParams } from 'react-router-dom';
import { AddCircleOutlineOutlined } from '@mui/icons-material';
import { Payment, PaymentFormData } from '../../types/enrollmentsTypes';
import { useAppDispatch } from '../../../../hooks/hooks';
import { showSnackbar } from '../../../appState/slices/appStateSlice';
import dayjs from 'dayjs';

const initialPayment: PaymentFormData = {
	monto: '',
	moneda: '',
	metodoPago: '',
	tipoPago: '',
	fechaPago: dayjs().format('YYYY-MM-DD'),
	observaciones: '',
	cuentaPropia: false,
};

export const EnrollmentPayments: React.FC = () => {
	const { enrollmentId = '' } = useParams<{ enrollmentId: string }>();
	const dispatch = useAppDispatch();
	const [openModal, setOpenModal] = useState(false);
	const [selectedPayment, setSelectedPayment] = useState<PaymentFormData>(initialPayment);

	const [isReadOnly, setIsReadOnly] = useState(false);

	const { data: payments, isLoading, isError } = useGetPaymentsByEnrollmentIdQuery(enrollmentId);
	const [addPayment] = useAddPaymentMutation();

	const handleOpenModal = (payment: PaymentFormData = initialPayment, readOnly: boolean = false) => {
    // console.log(payment)
		setSelectedPayment(payment);
		setIsReadOnly(readOnly);
		setOpenModal(true);
	};

	const handleCloseModal = () => setOpenModal(false);

  const handleAddPayment = async (paymentData: PaymentFormData) => {
		try {
			await addPayment({ id: enrollmentId, payment: paymentData }).unwrap();
			handleCloseModal();
			dispatch(showSnackbar({ message: 'Pago agregado correctamente', severity: 'success' }));
		} catch (error) {
			console.error('Error al añadir el pago:', error);
			dispatch(showSnackbar({ message: 'Error al agregar el pago', severity: 'error' }));
		}
	};

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: '1rem',
				flexGrow: 1,
			}}
		>
			<EnrollmentPaymentsList
				payments={payments}
				isLoading={isLoading}
				isError={isError}
				onViewPayment={(payment) => handleOpenModal(payment, true)}
			/>
			<Button
				sx={{
					width: 'fit-content',
					mt: 'auto',
					ml: 'auto',
				}}
				variant='contained'
				color='primary'
				onClick={() => handleOpenModal()}
				endIcon={<AddCircleOutlineOutlined />}
			>
				Cargar pago
			</Button>
			<Modal
				open={openModal}
				onClose={handleCloseModal}
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					padding: '1rem',
				}}
			>
				<Box>
					{/* <Box
					sx={{
						// mx: 'auto',
						width: '35rem',
						// maxWidth: '100%',
						// padding: '1rem',
					}}
				> */}
					<EnrollmentPaymentModal
						onClose={handleCloseModal}
						onSubmit={handleAddPayment}
						readOnly={isReadOnly}
						defaultValues={selectedPayment}
					/>
				</Box>

				{/* </Box> */}
			</Modal>
		</Box>
	);
};

export default EnrollmentPayments;
