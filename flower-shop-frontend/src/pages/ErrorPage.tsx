import * as React from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error)) {
    return (
      <div id="error-page">
        <Header />
        <Grid
          container
          display="flex"
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={2}
          width="100%"
          minHeight="calc(100vh - 203px - 70px)"
          sx={{ pr: 4, pl: 4, zIndex: 1, maxWidth: '100%' }}
        >
          <Typography variant="h2" marginTop="10%">
            Oops!
          </Typography>
          <Typography variant="h6">Sorry, an unknown error has occurred.</Typography>
          <p>
            <i>
              {error.status} {error.statusText}
            </i>
          </p>
        </Grid>
        <Footer />
      </div>
    );
  }

  return (
    <div id="error-page">
      <Header />
      <Grid
        container
        display="flex"
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={2}
        width="100%"
        minHeight="calc(100vh - 203px - 70px)"
        sx={{ pr: 4, pl: 4, zIndex: 1, maxWidth: '100%' }}
      >
        <Typography variant="h2" marginTop="10%">
          Oops!
        </Typography>
        <Typography variant="h6">Sorry, an unknown error has occurred.</Typography>
      </Grid>
      <Footer />
    </div>
  );
}
