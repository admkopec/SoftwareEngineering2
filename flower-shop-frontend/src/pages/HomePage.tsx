import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { ThemeProvider } from '@emotion/react';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { Divider, Grid, ListItemIcon } from '@mui/material';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import FeaturedPlayListRoundedIcon from '@mui/icons-material/FeaturedPlayListRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useNavigate } from 'react-router-dom';
import { MenuItemSettings, User } from '../resources/types';
import { mainTheme } from '../resources/themes';
import SplitButton from '../components/SplitButton';
import LoginRoundedIcon from '@mui/icons-material/Login';
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';
import Logo from '../components/Logo';
import SearchBar from '../components/SearchBar';
import Footer from "../components/Footer";
import ProductsPreview from "../components/ProductsPreview";
import Header from "../components/Header";

function HomePage() {
  return (
    <>
      <Header/>
      <Grid
        container
        display ="flex"
        direction="column"
        alignItems="center"
        justifyContent="flexStart"
        spacing={2}
        width='100%'
        minHeight="calc(100vh - 203px - 70px)"
        sx={{ pr: 4, pl: 4, zIndex: 1, maxWidth: "100%" }}
      >
        <Grid item marginTop="2%">
          <SearchBar/>
        </Grid>
        <Grid item>
          <ProductsPreview tag='Flowers'/>
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default HomePage;
