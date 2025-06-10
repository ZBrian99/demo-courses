import React from 'react';
import { Box, Tooltip } from '@mui/material';
import {
	AccessTimeOutlined,
	InfoOutlined,
	CheckCircleOutline,
	CancelOutlined,
	RemoveCircleOutline,
} from '@mui/icons-material';
import { EnrollmentStatus } from '../../types/enrollmentsTypes';
import { getColorKey } from '../../utils/statusConfig';

const statusConfig: Record<EnrollmentStatus, { icon: React.ElementType; label: string }> = {
	Pendiente: { icon: AccessTimeOutlined, label: 'Pendiente' },
	Parcial: { icon: InfoOutlined, label: 'Parcial' },
	Completo: { icon: CheckCircleOutline, label: 'Completo' },
	Cancelado: { icon: CancelOutlined, label: 'Cancelado' },
	Inactivo: { icon: RemoveCircleOutline, label: 'Inactivo' },
};

interface EnrollmentStatusCellProps {
	status: EnrollmentStatus;
}

export const EnrollmentStatusCell = ({ status }: EnrollmentStatusCellProps) => {
	const StatusIcon = statusConfig[status].icon;

	return (
		<Tooltip title={statusConfig[status].label} arrow>
			<Box
				sx={{
					color: (theme) => {
						const colorKey = getColorKey(status);
						return colorKey === 'default' ? theme.palette.text.secondary : theme.palette.state[colorKey].main;
					},
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<StatusIcon sx={{ fontSize: '1.5rem' }} />
			</Box>
		</Tooltip>
	);
};
