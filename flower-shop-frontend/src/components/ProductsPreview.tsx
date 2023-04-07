import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Typography from '@mui/material/Typography';
import { CardMedia, Divider, List, ListItem, Slide } from '@mui/material';
import React from 'react';
import { mainTheme } from './Themes';

export default function ProductsPreview() {
    const [currentItemIndex, setCurrentItemIndex] = React.useState(1);

    return (
        <Container>
            <Typography variant='h5'>Classic Bouquets</Typography><Divider />
            <List sx={{height: '500px'}}>
                <ListItem sx={{ position: 'absolute', display: 'block' }}>
                    <Slide direction={currentItemIndex === 1 ? 'left' : 'right'} in={currentItemIndex === 1} addEndListener={(event) => {event}} easing={{ enter: mainTheme.transitions.easing.easeOut, exit: mainTheme.transitions.easing.easeIn }}>
                        <Card variant='outlined'>
                            <CardMedia
                                component="img"
                                alt="roses bouquet"
                                height="300"
                                width="400"
                                image={require("../static/imgs/rose-bouquet.jpg")}
                            ></CardMedia>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Roses
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    Bouquet
                                </Typography>
                                <Typography variant="body2">
                                    Very beautiful flower!
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">Go to Product</Button>
                            </CardActions>
                        </Card>
                    </Slide>
                </ListItem>
                <ListItem sx={{ position: 'absolute', display: 'block' }}>
                    <Slide direction={currentItemIndex === 2 ? 'left' : 'right'} in={currentItemIndex === 2} addEndListener={(event) => {event}} easing={{ enter: mainTheme.transitions.easing.easeOut, exit: mainTheme.transitions.easing.easeIn }}>
                        <Card variant='outlined'>
                            <CardMedia
                                component="img"
                                alt="tulip bouquet"
                                height="300"
                                width="400"
                                image={require("../static/imgs/tulip-bouquet.webp")}
                            ></CardMedia>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Tulip
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    Bouquet
                                </Typography>
                                <Typography variant="body2">
                                    Very beautiful flower as well!
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">Go to Product</Button>
                            </CardActions>
                        </Card>
                    </Slide>
                </ListItem>
            </List>
            <Pagination count={10} renderItem={(item) =>
                <PaginationItem {...item} >
                </PaginationItem>
            } onChange={(_, indexNumber: number) => {

                setCurrentItemIndex(indexNumber);

            }}/>
        </Container>
    );
}
