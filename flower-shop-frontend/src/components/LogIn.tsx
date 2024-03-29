import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { mainTheme } from '../resources/themes';
import Copyright from './Copyright';
import { Credentials } from '../resources/types';
import { fetchUser, loginWithCredentials } from '../services/user.service';
import Layout from './Layout';
import { ValidationGroup } from 'mui-validate';

export default function LogIn() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const credentials: Credentials = Object.fromEntries(
      new FormData(event.currentTarget).entries()
    ) as unknown as Credentials;
    if (credentials) {
      setIsLoading(true);
      await loginWithCredentials(credentials).catch(() => {
        setIsLoading(false);
      });
      await fetchUser().then((user) => {
        sessionStorage.setItem('role', user.role);
        navigate('/');
      });
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <ThemeProvider theme={mainTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Avatar sx={{ m: 1, backgroundColor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Log In
            </Typography>
            <ValidationGroup>
              <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <LoadingButton
                  loading={isLoading}
                  loadingIndicator={<CircularProgress color="primary" size={20} />}
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2, float: 'right' }}
                >
                  Log In
                </LoadingButton>
                <Grid container>
                  <Grid item xs>
                    <Link
                      href="/signup"
                      variant="body2"
                      sx={{
                        float: 'right'
                      }}
                    >
                      Don&apos;t have an account? Sign Up
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </ValidationGroup>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    </Layout>
  );
}
