import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material';
import Typography from '@mui/material/Typography';
import FlowerIcon from '../static/imgs/icons8-flower-96.png';

interface LogoProps {
  sx?: SxProps<Theme>;
}

export default function Logo(props: LogoProps) {
  return (
    <Box sx={props.sx}>
      <img src={FlowerIcon} alt={'Flower icon'} height={32} width={32} style={{ margin: '0 10px' }} />
      <Typography
        variant="h6"
        noWrap
        component="a"
        href="/"
        sx={{
          mr: 2,
          fontFamily: 'Marcellus, serif',
          color: 'inherit',
          textDecoration: 'none',
          fontSize: 34
        }}
      >
        Flower Shop
      </Typography>
    </Box>
  );
}
