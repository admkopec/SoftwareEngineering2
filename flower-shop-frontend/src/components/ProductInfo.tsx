import React, { useEffect } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useNavigate, useParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import RemoveCircleTwoToneIcon from '@mui/icons-material/RemoveCircleTwoTone';
import BuildCircleTwoToneIcon from '@mui/icons-material/BuildCircleTwoTone';
import { Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Validate, ValidationGroup } from 'mui-validate';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import FloweryImage from './FloweryImage';
import { Roles } from '../resources/constants';
import { Product } from '../resources/types';
import DeleteDialog from './DeleteDialog';
import log from '../utils/logger';

export default function ProductInfo() {
  const { productID } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);
  const [productData, setProductData] = React.useState<Product | undefined>();
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/" onClick={() => navigate('/')}>
      Home
    </Link>,
    <Link underline="hover" key="2" color="inherit" href="/products/" onClick={() => {}}>
      Products
    </Link>,
    <Typography key="2">Flowers</Typography>,
    <Typography key="3" color="text.primary">
      {productData?.name}
    </Typography>
  ];

  const checkEmployee = () => {
    if (sessionStorage.getItem('role') === Roles.Employee.toString()) {
      setIsAdmin(true);
    } else setIsAdmin(false);
  };

  const fetchProduct = async () => {
    if (productID){
      setIsLoading(true);
      log(productID);
      await fetch(`/api/products/${productID}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        }
      })
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error(`ERROR ${response.status}`);
        })
        .then((responseJSON: Product) => {
          log('Success fetching product.');
          log(JSON.stringify(responseJSON));
          setProductData(responseJSON);
        })
        .catch((error: Error) => {
          log(`Error when trying to fetch product: ${error.message}`);
        })
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    if (sessionStorage.getItem('loggedIn')) checkEmployee();
  }, []);

  return (
    <Container sx={{ width: '100%', backgroundColor: '', p: 2 }}>
      <Breadcrumbs separator={<NavigateNextRoundedIcon fontSize="small" />} aria-label="breadcrumb" sx={{ p: 2 }}>
        {breadcrumbs}
      </Breadcrumbs>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} justifyContent="center">
          <Paper elevation={4} sx={{ p: 3, width: 'fit-content', alignSelf: 'center' }}>
            <FloweryImage src={`data:image/png;base64,${productData?.image || ''}`} width="auto" height="auto" />
          </Paper>
        </Grid>
        <Grid container item xs={12} md={8} textAlign="center">
          <Grid item xs={12} flexGrow={0}>
            <Typography variant="h3">{productData?.name}</Typography>
          </Grid>
          <Grid item container xs={12} flexGrow={1} textAlign="center">
            <Grid item xs={12} flexGrow={0}>
              <Typography variant="overline" role="overview-headline">Overview</Typography>
              <Typography variant="body1">{productData?.description}</Typography>
            </Grid>
          </Grid>
          <Grid item container xs={12} textAlign="center" flexGrow={0}>
            <Grid item xs={12} flexGrow={0}>
              <Typography variant="overline" role="details-headline">Details</Typography>
            </Grid>
            <Grid item container spacing={0} margin={0}>
              <Grid item xs={4} textAlign="center" flexGrow={0}>
                <Typography variant="caption">Category</Typography>
                <Typography variant="body1">{productData?.category}</Typography>
              </Grid>
              <Grid item xs={4} flexGrow={0}>
                <Typography variant="caption">In Stock</Typography>
                <Typography variant="body1">{productData?.quantity}</Typography>
              </Grid>
              <Grid item xs={4} flexGrow={0}>
                <Typography variant="caption">Price</Typography>
                <Typography variant="body1">{productData?.price}$ / flower</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'center', alignItems: 'center' }}>
              <ValidationGroup>
                <Validate
                  name="internal item-quantity"
                  custom={[
                    (value) => {
                      if (!productData?.quantity)
                        return false;
                      return Number.parseInt(value, 10) > 0 &&
                        Number.parseInt(value, 10) < productData.quantity + 1;
                    },
                    'Please enter a valid number.'
                  ]}
                  initialValidation="silent"
                >
                  <TextField
                    id="outlined-number"
                    label="Number"
                    type="number"
                    variant="outlined"
                    size="small"
                    aria-valuemax={productData?.quantity}
                    sx={{ width: '120px', maxWidth: '180px', minWidth: '60px', m: 2 }}
                  />
                </Validate>
              </ValidationGroup>
              <LoadingButton
                loading={isLoading}
                loadingIndicator={<CircularProgress color="primary" size={20} />}
                type="button"
                variant="contained"
                sx={{ m: 2 }}
                endIcon={<AddCircleTwoToneIcon />}
              >
                Buy Now
              </LoadingButton>
              <LoadingButton
                loading={isLoading}
                loadingIndicator={<CircularProgress color="primary" size={20} />}
                type="button"
                variant="contained"
                sx={{ m: 2 }}
                endIcon={<CheckCircleTwoToneIcon />}
              >
                Add to cart
              </LoadingButton>
            </Box>
          </Grid>
          <Grid item xs={12}>
            {isAdmin && (
              <>
                <Typography variant="overline">Employee Panel</Typography>
                <Box sx={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'center', alignItems: 'center' }}>
                  <LoadingButton
                    loading={isDeleting}
                    loadingIndicator={<CircularProgress color="primary" size={20} />}
                    type="button"
                    variant="contained"
                    color="error"
                    sx={{ m: 2 }}
                    onClick={() => setIsDeleting(true)}
                    endIcon={<RemoveCircleTwoToneIcon />}
                  >
                    Delete Product
                  </LoadingButton>
                  <LoadingButton
                    loading={isLoading}
                    loadingIndicator={<CircularProgress color="primary" size={20} />}
                    type="button"
                    color="error"
                    variant="contained"
                    sx={{ m: 2 }}
                    endIcon={<BuildCircleTwoToneIcon />}
                  >
                    Modify Product
                  </LoadingButton>
                </Box>
              </>
            )}
            <DeleteDialog
              productID={productData?.productID}
              productName={productData?.name}
              open={isDeleting}
              setOpen={(isOpen) => setIsDeleting(isOpen)}
            />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
