import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import {Popover, Stack} from '@mui/material';
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import SearchIcon from "@mui/icons-material/Search";
import * as React from "react";
import {alpha, styled} from "@mui/material/styles";
import {mainTheme as theme} from "../resources/themes";
import {Divider} from "@mui/material";
import LocalPhone from '@mui/icons-material/LocalPhone';
import Email from '@mui/icons-material/Email';
import Facebook from '@mui/icons-material/Facebook';
import Instagram from '@mui/icons-material/Instagram';
import { useState } from "react";
import Copyright from "./Copyright";

const FooterBox = styled(Box)(() => ({
    margin: theme.spacing('20%', 0, 0,0),
    padding: theme.spacing('2%', 0, '2%',0),
    width: '100%',
    height: '30%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems:'center',
    bottom: 0,
    backgroundColor: alpha(theme.palette?.primary?.light as string, 1)

}));

const OptionsBox = styled(Box)(() => ({
    color:'white',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    alignContent:'center',


}));

const FooterGrid = styled(Grid)(() => ({
    color: 'white',
    fontSize: 13,
    textAlign: 'center',
    width: '30%',
    justifyContent:'center',


}));

export default function Footer(){
    return (

    <FooterBox>
        <FooterGrid container  >

            <Grid item xs>
                <Stack spacing={2} >

                    <Typography variant="caption" component="a" fontSize="13">
                        CONTACT US
                    </Typography>
                    <OptionsBox >
                        <Typography sx={{pr: 1}} variant="caption" component="a" >
                            PHONE
                         </Typography>
                        <LocalPhone/>
                    </OptionsBox>
                    <OptionsBox >
                        <Typography sx={{pr: 1}} variant="caption" component="a" >
                            MAIL
                        </Typography>
                        <Email/>
                    </OptionsBox>
                </Stack>
            </Grid>
            <Divider orientation="vertical" color='white' flexItem/>
            <Grid item xs>
                <Stack spacing={2} >
                    <Typography  variant="caption" component="a" >
                        FOLLOW US
                    </Typography>
                    <OptionsBox>
                        <Typography sx={{pr: 1, textDecoration: 'none'}} color='white' variant="caption" component="a" href="https://www.facebook.com/" >
                            FACEBOOK
                        </Typography>
                        <Facebook/>
                    </OptionsBox>
                    <OptionsBox>
                        <Typography sx={{pr: 1, textDecoration: 'none'}} color='white' variant="caption" component="a" href="https://www.instagram.com/" >
                            INSTAGRAM
                        </Typography>
                        <Instagram/>
                    </OptionsBox>
                </Stack>
            </Grid>


        </FooterGrid>
        <Copyright />
    </FooterBox>
    );
}





