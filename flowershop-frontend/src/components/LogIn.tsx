import * as React from 'react';
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
import Copyright from './Copyright';
import { mainTheme } from './Themes';
import { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton'
import delay from '../util/delay';
import CircularProgress from '@mui/material/CircularProgress';

export default function LogIn() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const credentials = new FormData(event.currentTarget);
    setIsLoading(true);
    await fetch(`$/api/users/log_in`, {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        'Content-type': 'application/json;charset=UTF-8',
      },
    })
    .then((response) => {
      if (response.ok) return response.json();
      else {
        throw new Error("ERROR " + response.status);
      }
    })
    .then((bookings) => {
      console.log("Success logging in.");
    })
    .catch((e) => {
      console.log("Error when trying to log in: " + e);
    });
    await delay(2000);
    setIsLoading(false);
  };

  return (
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log In
          </Typography>
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
              loadingIndicator={<CircularProgress color='primary' size={20} />}
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2, float: 'right'}}
            >
              Log In
            </LoadingButton>
            <Grid container>
              <Grid item xs>
                <Link href="/signup" variant="body2" sx={{
                float: 'right'
                }}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}