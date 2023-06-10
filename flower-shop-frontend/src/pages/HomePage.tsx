import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Layout from '../components/Layout';

function HomePage() {
  const [query, setQuery] = React.useState<string | undefined>();

  // NOTE: Function meant to check the validity of jwt token and set variables in sessionStorage
  useEffect(() => {}, []);

  return (
    <Layout>
      <SearchBar setQuery={setQuery} />

      <Outlet context={[query, setQuery]} />
    </Layout>
  );
}

export default HomePage;
