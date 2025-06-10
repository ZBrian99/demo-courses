import React, { useState, useEffect } from 'react';
import {
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Modal,
    Box,
} from '@mui/material';
import {
    VisibilityOutlined,
    FeedbackOutlined,
    AddCircleOutline,
    AppRegistrationRounded,
} from '@mui/icons-material';
import { EnrollmentStatusMenu } from './EnrollmentStatusMenu';
import EnrollmentPaymentModal from '../details/EnrollmentPaymentModal';
import ObservationsModal from '../details/EnrollmentObservationsModal';
import { EnrollmentStatus, PaymentFormData, ObservationFormData, Enrollment, AddObservation } from '../../types/enrollmentsTypes';
import dayjs from 'dayjs';

interface EnrollmentActionMenuProps {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    onViewDetails: () => void;
    onAddObservation: (data: AddObservation) => void;
    onAddPayment: (paymentData: PaymentFormData) => void;
    onStatusChange: (status: EnrollmentStatus) => void;
    enrollment: Enrollment | null;
}

const initialPayment: PaymentFormData = {
    monto: '',
    moneda: 'ARS',
    metodoPago: '',
    tipoPago: '',
    fechaPago: dayjs().format('YYYY-MM-DD'),
    observaciones: '',
    cuentaPropia: false,
};

export const EnrollmentActionMenu = ({
    anchorEl,
    onClose,
    onViewDetails,
    onAddObservation,
    onAddPayment,
    onStatusChange,
    enrollment
}: EnrollmentActionMenuProps) => {
    const [statusAnchorEl, setStatusAnchorEl] = useState<HTMLElement | null>(null);
    const [openPaymentModal, setOpenPaymentModal] = useState(false);
    const [openObservationsModal, setOpenObservationsModal] = useState(false);
    const [mainMenuOpen, setMainMenuOpen] = useState(true);

    useEffect(() => {
        if (anchorEl) {
            setMainMenuOpen(true);
        }
    }, [anchorEl]);

    const handleMainMenuClose = () => {
        setMainMenuOpen(false);
        onClose();
    };

    const handleStatusMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setStatusAnchorEl(event.currentTarget);
        setMainMenuOpen(false);
    };

    const handleStatusMenuClose = () => {
        setStatusAnchorEl(null);
        onClose();
    };

    const handleOpenPaymentModal = () => {
        setOpenPaymentModal(true);
        setMainMenuOpen(false);
    };

    const handleOpenObservationsModal = () => {
        setOpenObservationsModal(true);
        setMainMenuOpen(false);
    };

    const handleSubmitPayment = (data: PaymentFormData) => {
        if (!enrollment?.id) {
            console.error('No hay ID de inscripción');
            return;
        }
        const paymentData: PaymentFormData = {
            ...data,
            observaciones: data.observaciones || ''
        };
        onAddPayment(paymentData);
        setOpenPaymentModal(false);
        onClose();
    };

    const handleSubmitObservation = (data: AddObservation) => {
        if (!enrollment?.id) {
            console.error('No hay ID de inscripción');
            return;
        }
        onAddObservation(data);
        setOpenObservationsModal(false);
        onClose();
    };

    const handleStatusChange = (status: EnrollmentStatus) => {
        if (!enrollment?.id) {
            console.error('No hay ID de inscripción');
            return;
        }
        onStatusChange(status);
        handleStatusMenuClose();
    };

    const handleClosePaymentModal = () => {
        setOpenPaymentModal(false);
        onClose();
    };

    const handleCloseObservationsModal = () => {
        setOpenObservationsModal(false);
        onClose();
    };

    return (
        <>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl) && mainMenuOpen}
                onClose={handleMainMenuClose}
                disableScrollLock
            >
                <MenuItem onClick={onViewDetails}>
                    <ListItemIcon>
                        <VisibilityOutlined />
                    </ListItemIcon>
                    <ListItemText>Ver detalles</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleOpenObservationsModal}>
                    <ListItemIcon>
                        <FeedbackOutlined />
                    </ListItemIcon>
                    <ListItemText>Observaciones</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleOpenPaymentModal}>
                    <ListItemIcon>
                        <AddCircleOutline />
                    </ListItemIcon>
                    <ListItemText>Agregar Pago</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleStatusMenuOpen}>
                    <ListItemIcon>
                        <AppRegistrationRounded />
                    </ListItemIcon>
                    <ListItemText>Cambiar estado</ListItemText>
                </MenuItem>
            </Menu>

            <EnrollmentStatusMenu
                anchorEl={statusAnchorEl}
                onClose={handleStatusMenuClose}
                onStatusChange={handleStatusChange}
            />

            {openPaymentModal && (
                <Modal
                    open={openPaymentModal}
                    onClose={handleClosePaymentModal}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: '1rem',
                    }}
                >
                    <Box>
                        <EnrollmentPaymentModal
                            onClose={handleClosePaymentModal}
                            onSubmit={handleSubmitPayment}
                            defaultValues={initialPayment}
                        />
                    </Box>
                </Modal>
            )}

            {openObservationsModal && (
                <Modal
                    open={openObservationsModal}
                    onClose={handleCloseObservationsModal}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: '1rem',
                    }}
                >
                    <Box>
                        <ObservationsModal
                            onClose={handleCloseObservationsModal}
                            onSubmit={handleSubmitObservation}
                            defaultValues={{
                                observaciones: enrollment?.observaciones || '',
                                totalAcordado: enrollment?.totalAcordado || '',
                                cantidadCuotas: enrollment?.cantidadCuotas || '',
                            }}
                        />
                    </Box>
                </Modal>
            )}
        </>
    );
};

EnrollmentActionMenu.displayName = 'EnrollmentActionMenu'; 