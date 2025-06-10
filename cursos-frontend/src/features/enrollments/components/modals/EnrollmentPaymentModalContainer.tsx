import React from 'react';
import { Modal, Box } from '@mui/material';
import { PaymentFormData } from '../../types/enrollmentsTypes';
import EnrollmentPaymentModal from '../details/EnrollmentPaymentModal';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentFormData) => void;
  initialValues: PaymentFormData;
}

export const EnrollmentPaymentModalContainer = ({ 
  open, 
  onClose, 
  onSubmit, 
  initialValues 
}: Props) => (
  <Modal
    open={open}
    onClose={onClose}
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      p: '1rem',
    }}
  >
    <Box>
      <EnrollmentPaymentModal
        onClose={onClose}
        onSubmit={(data: PaymentFormData) => onSubmit(data)}
        defaultValues={initialValues}
      />
    </Box>
  </Modal>
); 