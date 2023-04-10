import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { mainTheme } from './Themes';

export default function SignUpSuccess() {
  return (
    <ThemeProvider theme={mainTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            m: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography component="h3">You have been successfully signed up!</Typography>
          <Typography component="h3">
            You may{' '}
            <Link href="/" variant="body1">
              start using website
            </Link>{' '}
            now.
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
