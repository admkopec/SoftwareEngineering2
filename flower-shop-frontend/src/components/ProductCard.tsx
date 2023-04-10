import Card from '@mui/material/Card';
import { CardMedia, Grid } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import React from 'react';

export default function ProductCard() {
  return (
      <Grid item style={{width: '250px'}}>
    <Card variant="outlined">
      <CardMedia
        component="img"
        alt="roses bouquet"
        height="300"
        width="400"
        image={require('../static/imgs/rose-bouquet.jpg')}
      />
      <CardContent>
        <Typography variant="h5" component="div">
          Roses
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Bouquet
        </Typography>
        <Typography variant="body2">Very beautiful flower!</Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Go to Product</Button>
      </CardActions>
    </Card>
      </Grid>
  );
}
