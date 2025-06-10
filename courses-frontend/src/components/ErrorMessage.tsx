import { Typography } from '@mui/material';

const ErrorMessage = ({ message }: { message: string }) => (
  <Typography color="error" align="center">
    {message}
  </Typography>
);

export default ErrorMessage; 