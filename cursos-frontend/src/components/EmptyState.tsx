import { Typography } from '@mui/material';

const EmptyState = ({ message }: { message: string }) => (
  <Typography align="center" color="textSecondary">
    {message}
  </Typography>
);

export default EmptyState; 