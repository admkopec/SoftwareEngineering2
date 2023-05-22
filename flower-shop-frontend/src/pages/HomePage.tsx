import React, {useEffect} from 'react';
import {Grid} from '@mui/material';
import {Outlet} from "react-router-dom";
import SearchBar from '../components/SearchBar';
import Layout from "../components/Layout";

function HomePage() {
  const [query, setQuery] = React.useState<string | undefined>();

  // NOTE: Function meant to check the validity of jwt token and set variables in sessionStorage
  useEffect(()=>{

  }, []);

  return (
    <Layout>
        <SearchBar setQuery={setQuery}/>
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
                <Outlet context={[query, setQuery]}/>
            </Grid>
        </Grid>
    </Layout>
  );
}

export default HomePage;
