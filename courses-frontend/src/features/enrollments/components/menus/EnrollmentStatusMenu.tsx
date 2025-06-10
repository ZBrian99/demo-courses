import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import { AccessTimeOutlined, InfoOutlined, CheckCircleOutline, CancelOutlined, RemoveCircleOutline } from '@mui/icons-material';
import { getColorKey } from '../../utils/statusConfig';
import { EnrollmentStatus } from '../../types/enrollmentsTypes';

interface StatusOption {
  icon: React.ElementType;
  label: string;
}

const statusOptions: Record<EnrollmentStatus, StatusOption> = {
  Pendiente: { icon: AccessTimeOutlined, label: 'Pendiente' },
  Parcial: { icon: InfoOutlined, label: 'Parcial' },
  Completo: { icon: CheckCircleOutline, label: 'Completo' },
  Cancelado: { icon: CancelOutlined, label: 'Cancelado' },
  Inactivo: { icon: RemoveCircleOutline, label: 'Inactivo' },
};

interface EnrollmentStatusMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onStatusChange: (status: EnrollmentStatus) => void;
}

export const EnrollmentStatusMenu = React.memo(({ anchorEl, onClose, onStatusChange }: EnrollmentStatusMenuProps) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      disableScrollLock
    >
      {Object.entries(statusOptions).map(([status, config]) => (
        <MenuItem
          key={status}
          onClick={() => {
            onStatusChange(status as EnrollmentStatus);
            onClose();
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '.5rem',
            pl: '.5rem',
            pr: '1rem',
          }}
        >
          <ListItemIcon sx={{ minWidth: '2rem' }}>
            <Box
              sx={{
                color: (theme) => {
                  const colorKey = getColorKey(status);
                  return colorKey === 'default'
                    ? theme.palette.text.secondary
                    : theme.palette.state[colorKey].main;
                },
              }}
            >
              {React.createElement(config.icon)}
            </Box>
          </ListItemIcon>
          <ListItemText primary={config.label} sx={{ m: 0 }} />
        </MenuItem>
      ))}
    </Menu>
  );
});

EnrollmentStatusMenu.displayName = 'EnrollmentStatusMenu'; 