import { Box, Typography } from '@mui/material';

const UnderDevelopmentPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        padding: '1rem',
        textAlign: 'center',
        backgroundColor: 'common.white',
        borderRadius: '.5rem',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Sitio en Desarrollo
      </Typography>
     
      <Typography variant="body2" color="text.secondary">
        Por favor, espere a que se complete el desarrollo.
      </Typography>
    </Box>
  );
};

export default UnderDevelopmentPage; 