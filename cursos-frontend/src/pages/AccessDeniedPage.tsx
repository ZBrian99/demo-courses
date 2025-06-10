import { Box, Typography } from '@mui/material';

const AccessDeniedPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '1rem',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Acceso Denegado
      </Typography>
      <Typography variant="body1">
        No tienes permisos para acceder a esta sección.
      </Typography>
    </Box>
  );
};

export default AccessDeniedPage; 