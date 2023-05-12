import Card from '@mui/material/Card';
import { CardMedia, SxProps, Theme } from '@mui/material';
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
  sx?: SxProps<Theme>;
  size?: SurfaceSizes;
  isDetailed?: boolean;
}

export default function ProductCard(props: ProductCardProps & React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const goToProduct = () => {
    navigate(`/products/${props.product.productID}`);
  }

  return (
    <Paper elevation={4} sx={{ width: 'fit-content', height: 'fit-content', ...props.sx }}>
      <Card sx={{ width: props.size, height: 'auto' }}>
        <CardMedia
          component="img"
          width="auto"
          height={props?.size ? props.size*0.6 : "auto"}
          sx={{ objectFit: 'contain', p: 2, maxWidth: props.size }}
          alt={`a picture of a ${props.product.name}`}
          image={`data:image/png;base64,${props.product.image}`}
        />
        <CardContent sx={{display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', justifyContent: 'space-evenly'}}>
          <Typography variant="h5" component="div" role="product name">
            {props.product.name}
          </Typography>
          { props.isDetailed && <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {props.product.category}
          </Typography> }
          <Typography variant="body2">{props.product.description}</Typography>
          { props.isDetailed && <Typography sx={{ p: 1 }} variant='h5' textAlign={'center'}>
            {props.product.price}.00 $
          </Typography> }
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
