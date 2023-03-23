import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Copyright(props: any) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
          <Box>{'Copyright © '}Flower Shop {new Date().getFullYear()}{'.'}</Box>
      </Typography>
    );
  }