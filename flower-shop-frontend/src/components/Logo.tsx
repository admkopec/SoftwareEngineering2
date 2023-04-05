import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';

export default function Logo() {
  return (
    <Box sx={{ display: 'flex', p: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
      <LocalFloristIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
      <Typography
        variant="h6"
        noWrap
        component="a"
        href="/"
        sx={{
          mr: 2,
          display: { xs: 'none', md: 'flex' },
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
