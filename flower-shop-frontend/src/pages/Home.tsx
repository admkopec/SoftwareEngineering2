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
import AdbIcon from '@mui/icons-material/Adb';
import { ThemeProvider } from '@emotion/react';
import { mainTheme } from '../components/Themes';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { Divider, ListItemIcon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import FeaturedPlayListRoundedIcon from '@mui/icons-material/FeaturedPlayListRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import Copyright from '../components/Copyright';

interface UserSettingsItem {
  key: string,
  icon: SvgIconComponent,
  callback: () => void
}

const pages = ['Home', 'Products', 'Contact'];
const profileSettingsUser : UserSettingsItem[] = [{ 
    key: 'Profile', 
    icon: AccountCircleRoundedIcon, 
    callback: () => { }
  }, {
    key: 'My Orders',
    icon: FeaturedPlayListRoundedIcon, 
    callback: () => { }
  }, {
    key: 'Logout',
    icon: LogoutRoundedIcon,
    callback: () => { }
  }];
const profileSettingsEmployee = ['Profile', 'Orders', 'Logout'];
const profileSettingsDeliveryMan = ['Profile', 'Deliveries', 'Logout'];


function Home() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenBasket = (event: React.MouseEvent<HTMLElement>) => {
    
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <ThemeProvider theme={mainTheme}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <LocalFloristIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'inherit',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Flower Shop
            </Typography>

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
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              LOGO
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Show items in your basket" sx={{ p: 0, mr: 3 }}>
                <IconButton onClick={handleOpenBasket} sx={{ p: 0, mr: 3 }}>
                  <ShoppingBagIcon fontSize='large' sx={{ color: 'white' }}></ShoppingBagIcon>
                </IconButton>
              </Tooltip>
            </Box>

            {/* TODO: implement switching between menu and button */}
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
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseNavMenu}>
                  <Avatar sx={{ height: 30, width: 30, mr: 1 }}/> Welcome, User
                </MenuItem>
                <Divider />
                {profileSettingsUser.map((setting) => (
                  <MenuItem key={setting.key} onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <setting.icon></setting.icon>
                    </ListItemIcon>
                    <Typography textAlign="center" color={setting.key === 'Logout' ? 'error.light' : 'inherit' }>{setting.key}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Copyright></Copyright>
    </ThemeProvider>
  );
}

export default Home;
