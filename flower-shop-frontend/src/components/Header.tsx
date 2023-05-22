import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import { Divider, ListItemIcon, SvgIcon, SxProps, Theme } from '@mui/material';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import LoginRoundedIcon from '@mui/icons-material/Login';
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import FeaturedPlayListRoundedIcon from '@mui/icons-material/FeaturedPlayListRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useNavigate } from 'react-router-dom';
import { MenuItemSettings, UserData } from '../resources/types';
import SplitButton from './SplitButton';
import Logo from './Logo';
import log from '../utils/logger';
import { mainTheme } from '../resources/themes';
import Basket from './Basket';
import { fetchUser } from '../services/user.service';

interface HeaderBarProps {
  sx?: SxProps<Theme>;
}

const pagesLinks: MenuItemSettings[] = [
  {
    key: 'Home',
    callback: (navigate) => {
      navigate('/');
    }
  },
  {
    key: 'Products',
    callback: (navigate) => {
      navigate('/products');
    }
  },
  {
    key: 'Contact',
    callback: (navigate) => {
      navigate('/');
    }
  }
];

export const authButtons: MenuItemSettings[] = [
  {
    key: 'Log In',
    Icon: LoginRoundedIcon,
    callback: (navigate) => {
      navigate('/login');
    }
  },
  {
    key: 'Sign Up',
    Icon: AppRegistrationRoundedIcon,
    callback: (navigate) => {
      navigate('/signup');
    }
  }
];

const profileSettingsUser: MenuItemSettings[] = [
  {
    key: 'Profile',
    Icon: AccountCircleRoundedIcon,
    callback: () => {}
  },
  {
    key: 'My Orders',
    Icon: FeaturedPlayListRoundedIcon,
    callback: () => {}
  },
  {
    key: 'Logout',
    Icon: LogoutRoundedIcon,
    callback: () => {
      sessionStorage.clear();
      window.location.reload();
    }
  }
];

// Profile menu options for different kinds of users
// const profileSettingsEmployee = ['Profile', 'Orders', 'Logout'];
// const profileSettingsDeliveryMan = ['Profile', 'Deliveries', 'Logout'];

export default function Header(props: HeaderBarProps) {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<undefined | HTMLElement>();
  const [anchorElUser, setAnchorElUser] = React.useState<undefined | HTMLElement>();
  const [userData, setUserData] = React.useState<undefined | UserData>();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav();
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser();
  };

  // Fetching user information
  const fetchUserData = async () => {
    log(sessionStorage.getItem('jwtToken'));
    await fetchUser()
      .then((responseJSON: UserData) => {
        log('Success fetching user data.');
        log(JSON.stringify(responseJSON));
        setUserData(responseJSON);
        return true;
      })
      .catch((error: Error) => {
        sessionStorage.clear();
        log(`Error when trying to fetch user data: ${error.message}`);
        return false;
      });
  };

  React.useEffect(() => {
    if (sessionStorage.getItem('loggedIn') === 'true') {
      fetchUserData().then();
    } else {
      setUserData();
    }
  }, []);

  return (
    <AppBar position="static" sx={props.sx}>
      <Toolbar>
        {/* Logo */}
        <Logo
          sx={{
            flexGrow: 0,
            display: { xs: 'none', md: 'flex' },
            flexFlow: 'row nowrap',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        />

        {/* Shop name, pages to navigate to. Only shows when page width decreases. */}
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
            sx={{ display: 'block' }}
          >
            {pagesLinks.map((page) => (
              <MenuItem
                key={page.key}
                onClick={() => {
                  page.callback(navigate);
                  handleCloseNavMenu();
                }}
              >
                <Typography textAlign="center">{page.key}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        <Logo
          sx={{
            flexGrow: 1,
            display: { xs: 'flex', md: 'none' },
            flexFlow: 'row nowrap',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        />

        {/* Pages */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {pagesLinks.map((page) => (
            <Button
              key={page.key}
              onClick={() => {
                page.callback(navigate);
                handleCloseNavMenu();
              }}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              {page.key}
            </Button>
          ))}
        </Box>

        {/* Basket button */}
        <Basket />

        <Box sx={{ display: 'block', flexGrow: 0 }}>
          {userData === undefined ? (
            <SplitButton options={authButtons} sx={{ flexGrow: 0, color: mainTheme.palette?.primary?.main }} />
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
                    <ListItemIcon>{setting.Icon && <SvgIcon component={setting.Icon} fontSize="small" />}</ListItemIcon>
                    <Typography textAlign="center" color={setting.key === 'Logout' ? 'error.light' : 'inherit'}>
                      {setting.key}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
