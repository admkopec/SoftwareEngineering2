import React, {useEffect} from 'react';
import Container from '@mui/material/Container';
import {Grid} from '@mui/material';
import {Outlet} from "react-router-dom";
import SearchBar from '../components/SearchBar';
import Footer from "../components/Footer";
import Header from "../components/Header";

function HomePage() {
  // NOTE: Function meant to check the validity of jwt token and set variables in sessionStorage
  useEffect(()=>{

  }, []);

  return (
    <Container sx={{width: 'auto', m: 0, p: 0, maxWidth: '100%', overflow: 'hidden'}} maxWidth={false} disableGutters>
      <Header />
      <Grid
        container
        display ="flex"
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={2}
        width='auto'
        sx={{ pr: 4, pl: 4, zIndex: 1, minHeight: '80vh' }}
      >
        <Grid item>
          <SearchBar/>
        </Grid>
        <Grid item>
          <Outlet />
        </Grid>
      </Grid>
      <Footer />
    </Container>
  );
}

export default HomePage;
