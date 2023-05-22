import React, {PropsWithChildren} from "react";
import Container from '@mui/material/Container';
import {Box} from "@mui/material";
import Footer from "./Footer";
import Header from "./Header";

const Layout = (props: PropsWithChildren) => (
    <Container sx={{width: 'auto', m: 0, p: 0, maxWidth: '100%', overflow: 'hidden'}} maxWidth={false} disableGutters>
        <Header />
        <Box sx={{minHeight: 'calc(100vh - 351px)'}}>
            { props.children }
        </Box>
        <Footer/>
    </Container>
);

export default Layout;