import Container from '@mui/material/Container';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Typography from '@mui/material/Typography';
import { CircularProgress, Divider, List, ListItem, ListSubheader, Slide } from '@mui/material';
import React, { ForwardedRef, MutableRefObject, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { mainTheme } from '../resources/themes';
import ProductCard from './ProductCard';
import { Product } from '../resources/types';
import { IS_DEV } from '../resources/constants';

interface ProductsPreviewProps {
  tag: string;
}

interface ProductsContainerProps {
  productIndex: number;
  product: Product;
  direction: 'left' | 'right' | 'up' | 'down' | undefined;
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
  const [listHeight, setListHeight] = useState<number | undefined>();

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
      .catch((error) => {
        IS_DEV && console.log(`Error when trying to fetch product: ${error}`);
      });
    setListHeight(currentProductRef.current?.clientHeight);
    setIsLoading(false);
  };

  const handleDirection = (productIndex: number) => {
    if (productIndex < currentItemIndex) return Changes.Right;
    if (productIndex > currentItemIndex) return Changes.Left;
    return Changes.None;
  };

  function parseChangeToString(direction: Changes) {
    switch (direction) {
      case Changes.Left: {
        return 'left';
      }
      case Changes.Right: {
        return 'right';
      }
      default: {
        return 'left';
      }
    }
  }

  const ProductsContainer = React.forwardRef((props: ProductsContainerProps, ref: ForwardedRef<HTMLLIElement>) => (
    <ListItem
      sx={{ position: 'absolute', margin: '0 auto', alignSelf: 'center', width: 'fit-content' }}
      key={props.productIndex}
      ref={ref}
    >
      <Slide
        direction={props.direction}
        in={currentItemIndex === props.productIndex}
        addEndListener={(event) => {}}
        easing={{ enter: mainTheme.transitions.easing.easeOut, exit: mainTheme.transitions.easing.easeIn }}
        timeout={{ enter: 800, exit: 600 }}
      >
        <Grid container spacing={2}>
          <Grid item>
            <ProductCard product={props.product} />
          </Grid>
        </Grid>
      </Slide>
    </ListItem>
  ));

  useEffect(() => {
    setListHeight(currentProductRef.current?.clientHeight);
  }, [productsArray]);

  useEffect(() => {
    fetchProducts().finally();
  }, []);

  const renderItems = () => {
    if (productsArray.length === 0) {
      if (isLoading) {
        // Return Loading Indicator
        return <CircularProgress />;
      }
      // Return some info message
      return (
        <Typography variant="h5" color="text.secondary">
          Couldn't find matching products
        </Typography>
      );
    }
    return (
      <>
        {productsArray.map((product: Product, productIndex: number) => (
          <ProductsContainer
            ref={currentItemIndex === productIndex + 1 ? currentProductRef : null}
            direction={parseChangeToString(lastChange)}
            productIndex={productIndex + 1}
            product={product}
          />
        ))}
      </>
    );
  };

  return (
    <Container
      sx={{
        m: 0,
        display: 'flex',
        flexFlow: 'column nowrap',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '100%',
        width: '100%'
      }}
      maxWidth={false}
    >
      <ListSubheader component="div" sx={{ fontSize: 24, width: '100%' }}>
        {props.tag}
        <Divider />
      </ListSubheader>
      <List
        sx={{
          height: listHeight || 200,
          width: '100%',
          display: 'flex',
          flexFlow: 'row wrap',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        component="nav"
      >
        {renderItems()}
      </List>
      <Pagination
        count={productsArray.length}
        sx={{ p: 2 }}
        renderItem={(item) => <PaginationItem {...item} />}
        onChange={(_, indexNumber: number) => {
          console.log(`Index to change to: ${indexNumber}`);
          console.log(`Index to change from: ${currentItemIndex}`);
          setCurrentItemIndex(indexNumber);
          setLastChange(handleDirection(indexNumber));
        }}
      />
    </Container>
  );
}
