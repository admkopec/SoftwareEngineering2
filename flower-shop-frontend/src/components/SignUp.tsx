import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { mainTheme } from './Themes';
import Copyright from './Copyright';

interface JWTToken {
  jwttoken: string;
}

export default function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formEntries = Object.fromEntries(new FormData(event.currentTarget).entries());
    setIsLoading(true);
    if (formEntries.password !== formEntries.verifyPassword) {
      setIsLoading(false);
      throw new Error(`Passwords don't match`);
    }
    const credentials = {
      'name': formEntries.firstName + ' ' + formEntries.lastName,
      'email': formEntries.email,
      'password': formEntries.password
    };
    console.log(JSON.stringify(credentials));
    await fetch(`/api/users`, {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Content-type': 'application/json'
      }
    })
        .then((response) => {
          if (response.ok) return response.json();

          throw new Error(`ERROR ${response.status}`);
        })
        .then((responseJSON: JWTToken) => {
          console.log('Success signing up.');
          sessionStorage.setItem('loggedIn', 'true');
          sessionStorage.setItem('jwttoken', responseJSON.jwttoken);
          console.log(responseJSON.jwttoken);
          navigate('/signup/success');
        })
        .catch((e) => {
          console.log(`Error when trying to sign up: ${e}`);
        });
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
            alignItems: 'center'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="given-name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth id="email" label="Email Address" name="email" type="email" autoComplete="username" />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                    required
                    fullWidth
                    name="verifyPassword"
                    label="Verify Password"
                    type="password"
                    id="confirm-password"
                    autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="hasNewsletter" color="primary" />}
                  label="I would like to partake in the Newsletter programme, that is receive discount information, updates and suggestions via email."
                />
              </Grid>
            </Grid>
            <LoadingButton
              loading={isLoading}
              loadingIndicator={<CircularProgress color="primary" size={20} />}
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2, float: 'right' }}
            >
              Sign Up
            </LoadingButton>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Log In
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
