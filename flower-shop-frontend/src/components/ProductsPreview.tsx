import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Typography from '@mui/material/Typography';
import { Box, CardMedia, Divider, List, ListItem, ListSubheader, Slide } from '@mui/material';
import React, { ForwardedRef, MutableRefObject, useEffect, useState } from 'react';
import { mainTheme } from '../resources/themes';
import ProductCard from './ProductCard';
import Grid from "@mui/material/Grid";
import { Product } from '../resources/types';
import { IS_DEV } from '../resources/setup';

interface ProductsPreviewProps{
  tag: string
}

interface ProductItemProps{
  productIndex: number,
  product: Product,
  direction: 'left' | 'right' | 'up' | 'down' | undefined
}

enum Changes {
  None = 0,
  Right = 1,
  Left = 2
}

export default function ProductsPreview(props: ProductsPreviewProps) {
  const [currentItemIndex, setCurrentItemIndex] = React.useState<number>(1);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [productsArray, setProductsArray] = React.useState<Product[]>([]);
  const currentProductRef = React.useRef<HTMLLIElement>(null);
  const [lastChange, setLastChange] = useState<Changes>(Changes.None);

  const fetchProducts = async () => {
    setIsLoading(true);
    await fetch(`/api/products`, {
    method: 'GET',
    headers: {
        'Content-type': 'application/json'
    }
    })
    .then((response) => {
        if (response.ok) return response.json();
        throw new Error(`ERROR ${response.status}`);
    })
    .then((responseJSON: Product[]) => {
        IS_DEV && console.log('Success fetching product.');
        IS_DEV && console.log(responseJSON);
        setProductsArray(responseJSON);
    })
    .catch((e) => {
        IS_DEV && console.log(`Error when trying to fetch product: ${e}`);
    });
    setIsLoading(false);
  };    

  const handleDirection = (productIndex: number) => {
    if (productIndex < currentItemIndex)
      return Changes.Right;
    else if (productIndex > currentItemIndex)
      return Changes.Left;
    else
      return Changes.None;
  }

  function parseChangeToString(direction: Changes) {
    switch(direction){
      case Changes.Left:
        return 'left';
      case Changes.Right:
        return 'right';
      default:
        return undefined;
    }
  } 

  const ProductItem = React.forwardRef((props: ProductItemProps, ref: ForwardedRef<HTMLLIElement>) => (
    <ListItem sx={{ position: 'absolute', margin: '0 auto', alignSelf: 'center', width: 'fit-content' }} key={props.productIndex} ref={ref}>
      <Slide
        direction={props.direction}
        in={currentItemIndex === props.productIndex}
        addEndListener={(event) => {
        const _ = event;
        }}
        easing={{ enter: mainTheme.transitions.easing.easeOut, exit: mainTheme.transitions.easing.easeIn }}
      >
        <Grid container spacing={2}>
          <ProductCard product={props.product}/>
        </Grid>
      </Slide>
    </ListItem>
  )
  );

  useEffect(() => {
    fetchProducts();
  }, [])

  const renderItems = () => {
    return <>
        {productsArray.map((product: Product, productIndex: number) => {
          return <ProductItem ref={currentProductRef} direction={parseChangeToString(lastChange)} productIndex={productIndex+1} product={product}/>
        })}
    </>; 
  }

  return (
    <React.Fragment>
      <Container sx={{ m: 'auto', display: 'flex', flexFlow: 'column nowrap', justifyContent: 'center', alignItems: 'center'}}>
        <ListSubheader component="div" sx={{fontSize: 24, width: '100%'}}>
          {props.tag}
          <Divider />
        </ListSubheader>
        <List sx={{ height: currentProductRef.current?.clientHeight ? currentProductRef.current?.clientHeight + 30 : 200, minWidth: '80vw', display: 'flex', flexFlow: 'row nowrap', justifyContent: 'center', alignItems: 'center'}}>
          {renderItems()}
        </List>
        <Pagination
          count={productsArray.length}
          sx={{p: 2}}
          renderItem={(item) => <PaginationItem {...item}/>}
          onChange={(_, indexNumber: number) => {
            console.log('Index to change to: ' + indexNumber);
            console.log('Index to change from: ' + currentItemIndex);
            setCurrentItemIndex(indexNumber);
            setLastChange(handleDirection(indexNumber));
          }}
          />
      </Container>
    </React.Fragment>
  );
}
