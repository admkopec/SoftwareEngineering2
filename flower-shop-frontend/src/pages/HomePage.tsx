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
import { MenuItemSettings, User } from '../resources/dataTypes';
import { mainTheme } from '../components/Themes';
import SplitButton from '../components/SplitButton';
import LoginRoundedIcon from '@mui/icons-material/Login';
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';
import Logo from '../components/Logo';
import SearchBar from '../components/SearchBar';
import Footer from "../components/Footer";
import ProductsPreview from "../components/ProductsPreview";

const pagesLinks = ['Home', 'Products', 'Contact'];

export const authButtons: MenuItemSettings[] = [
  {
    key: 'Log In',
    icon: LoginRoundedIcon,
    callback: (navigate) => {
      navigate('/login');
    }
  },
  {
    key: 'Sign Up',
    icon: AppRegistrationRoundedIcon,
    callback: (navigate) => {
      navigate('/signup');
    }
  }
];

const profileSettingsUser: MenuItemSettings[] = [
  {
    key: 'Profile',
    icon: AccountCircleRoundedIcon,
    callback: () => {}
  },
  {
    key: 'My Orders',
    icon: FeaturedPlayListRoundedIcon,
    callback: () => {}
  },
  {
    key: 'Logout',
    icon: LogoutRoundedIcon,
    callback: (navigate) => {
      sessionStorage.removeItem('jwttoken');
      sessionStorage.setItem('loggedIn', 'false');
      navigate('/');
    }
  }
];
const profileSettingsEmployee = ['Profile', 'Orders', 'Logout'];
const profileSettingsDeliveryMan = ['Profile', 'Deliveries', 'Logout'];

function HomePage() {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [userData, setUserData] = React.useState<null | User>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenBasket = (event: React.MouseEvent<HTMLElement>) => {};

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const fetchUserData = async () => {
    console.log(sessionStorage.getItem('jwttoken'));
    await fetch(`/api/users`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('jwttoken')}`,
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then((response) => {
        if (response.ok) return response.json();

        throw new Error(`ERROR ${response.status}`);
      })
      .then((responseJSON: User) => {
        console.log('Success fetching user data.');
        console.log(responseJSON);
        setUserData(responseJSON);
        return true;
      })
      .catch((e) => {
        console.log(`Error when trying to fetch user data: ${e}`);
      });
  };

  React.useEffect(() => {
    if (sessionStorage.getItem('loggedIn') === 'true') {
      fetchUserData();
    } else {
      setUserData(null);
    }
  }, []);

  return (
    <ThemeProvider theme={mainTheme}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' }
                }}
              >
                {pagesLinks.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Logo />
            
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'Amatic SC, cursive',
                color: 'inherit',
                textDecoration: 'none',
                fontSize: 34,
                letterSpacing: '.5rem'
              }}
            >
              Flower Shop
            </Typography>

            {/* Pages */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pagesLinks.map((page) => (
                <Button key={page} onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
                  {page}
                </Button>
              ))}
            </Box>

            {/* Basket button */}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Show items in your basket" sx={{ p: 0, mr: 3 }}>
                <IconButton onClick={handleOpenBasket} sx={{ p: 0, mr: 3 }}>
                  <ShoppingBagIcon fontSize="large" sx={{ color: 'white' }} />
                </IconButton>
              </Tooltip>
            </Box>

            {userData === null ? (
              <SplitButton options={authButtons} />
            ) : (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="User" src="#" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Avatar sx={{ height: 30, width: 30, mr: 1 }} /> Welcome, {userData?.name}
                  </MenuItem>
                  <Divider />
                  {profileSettingsUser.map((setting) => (
                    <MenuItem key={setting.key} onClick={() => setting.callback(navigate)}>
                      <ListItemIcon>
                        <setting.icon />
                      </ListItemIcon>
                      <Typography textAlign="center" color={setting.key === 'Logout' ? 'error.light' : 'inherit'}>
                        {setting.key}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Grid
        container
        display ="flex"
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={2}
        maxWidth="xl"
        sx={{ pr: 4, pl: 4 }}
      >
        <Grid item>
          <SearchBar/>
        </Grid>
        <Grid item>
          <ProductsPreview/>
        </Grid>

      </Grid>
      <Footer/>
    </ThemeProvider>
  );
}

export default HomePage;
