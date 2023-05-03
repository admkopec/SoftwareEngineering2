import Card from '@mui/material/Card';
import { CardMedia } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import React from 'react';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import { Product } from '../resources/types';
import { SurfaceSizes } from '../resources/constants';

interface ProductCardProps {
  product: Product;
}

interface ProductInfoProps {
  productId: string;
}

const useNavigateSearch = () => {
  const navigate = useNavigate();
  return (pathname: string, params: ProductInfoProps) => navigate(pathname, { state: params });
};

export default function ProductCard(props: ProductCardProps) {
  const navigateSearch = useNavigateSearch();

  const goToProduct = () =>
    navigateSearch(`/products/${props.product.name.toLowerCase().replace(' ', '-')}`, {
      productId: props.product.productId
    });

  return (
    <Paper elevation={4} sx={{ width: 'fit-content', height: 'fit-content' }}>
      <Card sx={{ width: SurfaceSizes.TileLarge, height: 'auto' }}>
        <CardMedia
          component="img"
          width="auto"
          height={SurfaceSizes.ImageLarge.valueOf()}
          sx={{ objectFit: 'contain', p: 2 }}
          alt={`a picture of a ${props.product.name}`}
          image={`data:image/png;base64,${props.product.image}`}
        />
        <CardContent>
          <Typography variant="h5" component="div" role="product name">
            {props.product.name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {props.product.category}
          </Typography>
          <Typography variant="body2">{props.product.description}</Typography>
        </CardContent>
        <CardActions>
          <Button size="small" endIcon={<KeyboardArrowRightRoundedIcon />} onClick={goToProduct}>
            Go to Product
          </Button>
        </CardActions>
      </Card>
    </Paper>
  );
}
