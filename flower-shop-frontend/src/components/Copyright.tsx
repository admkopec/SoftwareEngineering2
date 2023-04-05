import { SxProps, Theme } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Copyright(sx: SxProps<Theme>) {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="body2" color="text.secondary" align="center" sx={sx}>
        {'Copyright © '}Flower Shop {new Date().getFullYear()}.
      </Typography>
    </Box>
  );
}
