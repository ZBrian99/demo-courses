import {
    AccessTimeOutlined,
    InfoOutlined,
    CheckCircleOutline,
    CancelOutlined,
    RemoveCircleOutline,
} from '@mui/icons-material';
import { Theme } from '@mui/material';

export type StatusKey = 'Pendiente' | 'Parcial' | 'Completo' | 'Cancelado' | 'Inactivo';
export type StateColorKey = 'success' | 'warning' | 'error' | 'inactive' | 'default';

export const statusOptions = {
    Pendiente: { 
        color: 'default', 
        icon: AccessTimeOutlined, 
        label: 'Pendiente',
    },
    Parcial: { 
        color: 'warning', 
        icon: InfoOutlined, 
        label: 'Parcial',
    },
    Completo: { 
        color: 'success', 
        icon: CheckCircleOutline, 
        label: 'Completo',
    },
    Cancelado: { 
        color: 'error', 
        icon: CancelOutlined, 
        label: 'Cancelado',
    },
    Inactivo: { 
        color: 'inactive', 
        icon: RemoveCircleOutline, 
        label: 'Inactivo',
    },
};

export const getColorKey = (estado: string): StateColorKey => {
    const estadoLower = estado.toLowerCase();
    switch (estadoLower) {
        case 'pendiente':
            return 'default';
        case 'parcial':
            return 'warning';
        case 'completo':
            return 'success';
        case 'cancelado':
            return 'error';
        case 'inactivo':
            return 'inactive';
        default:
            return 'default';
    }
};

export const getStatusColor = (theme: Theme, estado: string) => {
    const colorKey = getColorKey(estado);
    return colorKey === 'default'
        ? theme.palette.text.secondary
        : theme.palette.state[colorKey].main;
};

export const getStatusBgColor = (theme: Theme, estado: string) => {
    const colorKey = getColorKey(estado);
    return colorKey === 'default'
        ? theme.palette.background.default
        : theme.palette.state[colorKey].light;
}; 