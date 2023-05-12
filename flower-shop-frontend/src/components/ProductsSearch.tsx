import React, { useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import { CircularProgress, FormControl, FormLabel, Slider, SxProps, Theme } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useOutletContext } from "react-router-dom";
import { Credentials, Product } from '../resources/types';
import ProductCard from './ProductCard';
import log from '../utils/logger';
import { fetchProductsFiltered } from '../services/product.service';
import { Category, SurfaceSizes } from '../resources/constants';

function valuetext(value: number) {
  return `${value}$`;
}

const minDistance = 4;

export default function ProductsSearch(){
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [query] = useOutletContext<[(string | undefined)]>();
  const [categories, setCategories] = React.useState<string | undefined>();
  const [page, setPage] = React.useState<number>(-1);
  const [maxPerPage, setMaxPerPage] = React.useState<number>(-1);
  const [checked, setChecked] = React.useState<boolean[]>(
    Array.from({length: Object.keys(Category).length}).fill(false) as boolean[]
  );
  const [valueSlider, setValueSlider] = React.useState<number[]>([4, 20]);
  const [productsData, setProductsData] = React.useState<Product[] | undefined>();

  const handleChangeSlider = (
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setValueSlider([Math.min(newValue[0], valueSlider[1] - minDistance), valueSlider[1]]);
    } else {
      setValueSlider([valueSlider[0], Math.max(newValue[1], valueSlider[0] + minDistance)]);
    }
  };

  const handleChangeAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([...checked].fill(event.target.checked));
  };

  function handleChangeCategory(event: React.ChangeEvent<HTMLInputElement>, index: number) {
    setChecked([...checked].fill(event.target.checked, index, index+1));
  }
  
  const generateChildrenCategories = () => (
    <>
      {Object.keys(Category).filter(cat => Number.isNaN(Number(cat))).map((cat, index) =>
        <FormControlLabel
          label={cat}
          key={index}
          name={cat}
          id={`category${cat}`}
          control={<Checkbox checked={checked[index]}
                             onChange={(event) =>
                               handleChangeCategory(event, index)} />}
        />
      )}
    </>
  );

  const renderItems = (itemsList: Product[] | undefined, isLoadingIndicator: boolean, Container: typeof ProductCard) => {
    if (!itemsList) {
      if (isLoadingIndicator) {
        // Return Loading Indicator
        return <CircularProgress />;
      }
      // Return some info message
      return (
        <Typography variant="h5" color="text.secondary">
          Couldn&apos;t find matching products
        </Typography>
      );
    }
    return (
      <>
        {itemsList.map((product: Product, productIndex: number) => (
          <Container
            product={product}
            key={product.productID}
            sx={{m: 2}}
            size={SurfaceSizes.TileSmall}
            isDetailed={true}
          />
        ))}
      </>
    );
  };

  const handleFilter = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCategories([...(new FormData(event.currentTarget)).keys()].join(','));
    setValueSlider(valueSlider);
  }

  useEffect(() => {
    setIsLoading(true);
    fetchProductsFiltered(query, categories, valueSlider[0], valueSlider[1], page, maxPerPage)
      .then((responseObject: Product[]) => {
        log('Success fetching products.');
        log(JSON.stringify(responseObject));
        setProductsData(responseObject);
        return responseObject;
      })
      .catch((error: Error) => {
        log(`Error when trying to fetch products: ${error.message}`);
      });
    setIsLoading(false);
  }, [query, categories, valueSlider]);

  return(
    <Grid container>
      <Grid container component='form' item xs={12} flexDirection={'row'} flexWrap={'nowrap'} alignItems={"flex-start"}
            justifyContent="center" columnGap={2} onSubmit={handleFilter}>
        <Typography sx={{alignSelf: 'center', mr: 4}} variant={"h5"}>
          Filter by:
        </Typography>
        <FormControl>
          <FormLabel component="legend">Select product types</FormLabel>
          <FormControlLabel
            label="All"
            control={
              <Checkbox
                indeterminate={checked.includes(false) && checked.includes(true)}
                // TODO: fix behaviour when this checkbox is not set to checked when selecting everything
                checked={checked.every(Boolean)}
                onChange={handleChangeAll}
              />
            }
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
            {generateChildrenCategories()}
          </Box>
        </FormControl>
        <FormControl>
          <FormLabel component="legend">Select price range</FormLabel>
          <Slider
            getAriaLabel={() => 'Minimum distance'}
            value={valueSlider}
            onChange={handleChangeSlider}
            valueLabelDisplay="auto"
            max={60}
            marks={true}
            getAriaValueText={valuetext}
            sx={{width: '300px'}}
            disableSwap
          />
        </FormControl>
        <FormControl>
          <LoadingButton
            loading={isLoading}
            loadingIndicator={<CircularProgress color="primary" size={20} />}
            type="submit"
            variant="contained"
            sx={{ m: 2 }}
          >
            Filter
          </LoadingButton>
        </FormControl>
      </Grid>
      <Grid container item xs={12} flexDirection={'row'} flexWrap={'wrap'} alignItems={'center'}
            justifyContent='space-evenly'>
        {renderItems(productsData, isLoading, ProductCard)}
      </Grid>
      <Grid item xs={12} container flexDirection={'row'} flexWrap={'nowrap'} alignItems={'center'}
            justifyContent='center'>
        <LoadingButton
          loading={isLoading}
          loadingIndicator={<CircularProgress color="primary" size={20} />}
          type="button"
          variant="contained"
          sx={{ m: 2 }}
        >
          Next page
        </LoadingButton>
      </Grid>
    </Grid>
  );
}