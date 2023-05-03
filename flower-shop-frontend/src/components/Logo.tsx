import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import { SxProps, Theme } from '@mui/material';

interface LogoProps {
  sx?: SxProps<Theme>;
}

export default function Logo(props: LogoProps) {
  return (
    <Box sx={props.sx}>
      <LocalFloristIcon titleAccess="flower-icon" sx={{ mr: 1 }} />
      <Typography
        variant="h6"
        noWrap
        component="a"
        href="/"
        sx={{
          mr: 2,
          fontFamily: 'Amatic SC, cursive',
          color: 'inherit',
          textDecoration: 'none',
          fontSize: 34,
          letterSpacing: '.2rem'
        }}
      >
        Flower Shop
      </Typography>
    </Box>
  );
}
