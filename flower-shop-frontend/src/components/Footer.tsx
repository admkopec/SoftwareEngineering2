import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import {Divider, Stack} from '@mui/material';
import * as React from 'react';
import {alpha, styled} from '@mui/material/styles';
import LocalPhone from '@mui/icons-material/LocalPhone';
import Email from '@mui/icons-material/Email';
import Facebook from '@mui/icons-material/Facebook';
import Instagram from '@mui/icons-material/Instagram';
import Avatar from '@mui/material/Avatar';
import {mainTheme as theme} from '../resources/themes';
import Copyright from './Copyright';
import Team1 from '../static/imgs/team-1.png';
import Team2 from '../static/imgs/team-2.png';
import Team3 from '../static/imgs/team-3.png';
import {getBackendURL, isLoggedIn} from "../services/user.service";
import {regions} from "../resources/constants";

const FooterBox = styled(Box)(() => ({
  margin: theme.spacing(0, 0, 0, 0),
  padding: theme.spacing('2%', 0, '2%', 0),
  width: '100%',
  height: '30%',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  justifyContent: 'center',
  alignItems: 'center',
  bottom: 0,
  backgroundColor: alpha(theme.palette?.primary?.light as string, 1)
}));

const OptionsBox = styled(Box)(() => ({
  color: 'white',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  alignContent: 'center'
}));

const FooterGrid = styled(Grid)(() => ({
  color: 'white',
  fontSize: 13,
  textAlign: 'center',
  width: '30%',
  justifyContent: 'center',
  padding: theme.spacing('2%', 0, '2%', 0)
}));
const insideAvatarFunction = (e: MouseEvent) => {
  e.stopPropagation();
  console.log('Fired insideAvatarFunction()!');
}

export default function Footer() {

  const avatarDisabled = {
    cursor: 'default',
  };

  const avatarSelectable = {
    cursor: 'pointer',
  };

  const avatarSelected = {
    cursor: 'default',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
  };

  return (
    <FooterBox>
      <FooterGrid container>
        <Grid item xs>
          <Stack spacing={2}>
            <Typography variant="caption" component="a" fontSize="13">
              CONTACT US
            </Typography>
            <OptionsBox>
              <Typography sx={{ pr: 1 }} variant="caption" component="a">
                PHONE
              </Typography>
              <LocalPhone />
            </OptionsBox>
            <OptionsBox>
              <Typography sx={{ pr: 1 }} variant="caption" component="a">
                MAIL
              </Typography>
              <Email />
            </OptionsBox>
          </Stack>
        </Grid>
        <Divider orientation="vertical" color="white" flexItem />
        <Grid item xs>
          <Stack spacing={2}>
            <Typography variant="caption" component="a">
              FOLLOW US
            </Typography>
            <OptionsBox>
              <Typography
                sx={{ pr: 1, textDecoration: 'none' }}
                color="white"
                variant="caption"
                component="a"
                href="https://www.facebook.com/"
              >
                FACEBOOK
              </Typography>
              <Facebook />
            </OptionsBox>
            <OptionsBox>
              <Typography
                sx={{ pr: 1, textDecoration: 'none' }}
                color="white"
                variant="caption"
                component="a"
                href="https://www.instagram.com/"
              >
                INSTAGRAM
              </Typography>
              <Instagram />
            </OptionsBox>
          </Stack>
        </Grid>

      </FooterGrid>
      <Grid item xs>
        <Stack
            direction="row"
            divider={<Divider orientation="vertical" color="white" flexItem />}
            spacing={2}
        >
          <Avatar sx={getBackendURL() === regions.ours ? avatarSelected : (isLoggedIn() ? avatarDisabled : avatarSelectable)} src={Team1} onClick={() => {
            if (isLoggedIn()) { return; }
            sessionStorage.removeItem('backendURL');
            window.location.reload();
          }}/>
          <Avatar sx={getBackendURL() === regions.alpsMountains ? avatarSelected : (isLoggedIn() ? avatarDisabled : avatarSelectable)} src={Team2} onClick={() => {
            if (isLoggedIn()) { return; }
            sessionStorage.setItem('backendURL', regions.alpsMountains);
            window.location.reload();
          }}/>
          <Avatar sx={getBackendURL() === regions.easterIsland ? avatarSelected : (isLoggedIn() ? avatarDisabled : avatarSelectable)} src={Team3} onClick={() => {
            if (isLoggedIn()) { return; }
            sessionStorage.setItem('backendURL', regions.easterIsland);
            window.location.reload();
          }}/>
        </Stack>
      </Grid>
      <Copyright />
    </FooterBox>
  );
}
