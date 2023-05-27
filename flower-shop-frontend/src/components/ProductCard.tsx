import Card from '@mui/material/Card';
import {Box, SxProps, Theme} from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import React from 'react';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import Paper from '@mui/material/Paper';
import {useNavigate} from 'react-router-dom';
import {Product} from '../resources/types';
import {SurfaceSizes} from '../resources/constants';
import FloweryImage from "./FloweryImage";

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
        <Box sx={{p: 2}}/>
        <FloweryImage src={`data:image/png;base64,${props.product.image || ''}`} width="auto"
                      height={props?.size ? `${(props.size*0.6).toString()}px`: "auto"}
                      style={{ objectFit: 'contain', padding: 2, maxWidth: props.size }}/>
        <CardContent sx={{display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', justifyContent: 'space-evenly'}}>
          <Typography variant="h5" component="div" role="product name">
            {props.product.name}
          </Typography>
          { props.isDetailed && <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {props.product.category}
          </Typography> }
          <Typography variant="body2">{props.product.description}</Typography>
          { props.isDetailed && <Typography sx={{ p: 1 }} variant='h5' textAlign={'center'}>
            {props.product.price.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </Typography> }
        </CardContent>
        <CardActions>
          <Button size="small" style={{zIndex: 50}} endIcon={<KeyboardArrowRightRoundedIcon />} onClick={goToProduct}>
            Go to Product
          </Button>
        </CardActions>
      </Card>
    </Paper>
  );
}
