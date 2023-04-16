import Card from '@mui/material/Card';
import { CardMedia, Grid } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import React from 'react';
import { Product } from '../resources/types';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

interface ProductCardProps{
  product: Product
}

export default function ProductCard(props: ProductCardProps) {
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
            <Typography variant="h5" component="div" role='product name'>
              {props.product.name}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {props.product.category}
            </Typography>
            <Typography variant="body2">
              {props.product.description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" endIcon={<KeyboardArrowRightRoundedIcon />}>Go to Product </Button>
          </CardActions>
        </Card>
      </Grid>
  );
}
