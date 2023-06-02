import React, {useEffect} from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import {useLocation, useNavigate} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import BasketList from '../components/BasketList';
import {clearBasket, fetchBasket, fetchProduct} from '../services/product.service';
import {BasketItem, OrderProduct, Product} from '../resources/types';
import log from '../utils/logger';
import {placeOrder} from "../services/order.service";

const steps = [
  'Your products',
  'Delivery details',
  // 'Delivery method',
  'Payment',
  'Purchase completed',
];

const isStepOptional = (step: number) => step === -1;
const isStepTerminal = (step: number) => step >= 3;

export default function OrderPage() {
  const { productID, quantity } = useLocation().state as OrderProduct;
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [basketData, setBasketData] = React.useState<BasketItem[]>();
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [country, setCountry] = React.useState("");

  const isStepSkipped = (step: number) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleBasketFetch = () => {
    if (productID && quantity) {
      fetchProduct(productID).then((product: Product) => {
        setBasketData([{product, quantity}]);
      }).catch((error: Error) => {
        log(`Error when trying to fetch product: ${error.message}`);
      });
    } else {
      fetchBasket()
          .then((responseJSON: BasketItem[]) => {
            log('Success fetching basket.');
            log(JSON.stringify(responseJSON));
            setBasketData(responseJSON);
            return responseJSON;
          })
          .catch((error: Error) => {
            log(`Error when trying to fetch product: ${error.message}`);
          });
    }
  }

  const handleGoHome = async () => {
    await placeOrder({
      deliveryAddress: {
        street: address,
        postalCode,
        city,
        country
      },
      items: basketData?.map(e => ({productID: e.product.productID, quantity: e.quantity})) ?? []
    }).then(() => clearBasket());
    navigate('/');
  };

  useEffect(() => {
    handleBasketFetch();
  }, []);

  const handleSteps = (stepNo: number) => {
    switch (stepNo){
      case 0: {
        return (
          <React.Fragment>
            {/* <Typography sx={{ mt: 2, mb: 1 }}>Step {stepNo+1} - See an overview of your products</Typography> */}
            <Box sx={{m: '0 auto', p: 2 }}>
              <BasketList editable={true} basketItems={basketData} dense={false} refetch={handleBasketFetch}/>
            </Box>
          </React.Fragment>
        );
      } case 1: {
        return (
          <React.Fragment>
            {/* <Typography sx={{ mt: 2, mb: 1 }}>Step {stepNo+1} - Provide address details for delivery</Typography> */}
            <Box sx={{m: '2 auto', p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      name="firstName"
                      autoComplete="given-name"
                      autoFocus
                      onChange={e => {setFirstName(e.target.value)}}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="family-name"
                      onChange={e => {setLastName(e.target.value)}}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      required
                      fullWidth
                      id="address"
                      label="Address"
                      name="address"
                      autoComplete="street-address"
                      onChange={e => {setAddress(e.target.value)}}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      required
                      fullWidth
                      name="city"
                      label="City"
                      id="city"
                      autoComplete="city"
                      onChange={e => {setCity(e.target.value)}}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      required
                      fullWidth
                      name="postcode"
                      label="Postal Code"
                      id="postcode"
                      autoComplete="postal-code"
                      onChange={e => {setPostalCode(e.target.value)}}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      required
                      fullWidth
                      name="country"
                      label="Country"
                      id="country"
                      autoComplete="country"
                      onChange={e => {setCountry(e.target.value)}}
                  />
                </Grid>
              </Grid>
            </Box>
          </React.Fragment>
        );
      } case 2: {
        return (
          <React.Fragment>
            {/* <Typography sx={{ mt: 2, mb: 1 }}>Step {stepNo+1} - Choose payment method</Typography> */}
            <Typography>Here goes Stripe redirect...</Typography>
          </React.Fragment>
        );
      } case 3: {
        return (
          <React.Fragment>
            {/* <Typography sx={{ mt: 2, mb: 1 }}>Step {stepNo+1} - Payment approved. Purchase completed</Typography> */}
            <Grid margin={3}>
              <Typography>First name: {firstName}</Typography>
              <Typography>Last name: {lastName}</Typography>
              <Typography>Address: {address}</Typography>
              <Typography>City: {city}</Typography>
              <Typography>Postal Code: {postalCode}</Typography>
              <Typography>Country: {country}</Typography>
              <BasketList editable={false} basketItems={basketData} dense={true} refetch={handleBasketFetch}/>
            </Grid>
          </React.Fragment>
        );
      } default: {
        throw new Error("Access denied.");
      }
    }
  }

  // NOTE: Function meant to check the validity of jwt token and set variables in sessionStorage
  useEffect(()=> {

  }, []);

  return (
    <Container sx={{width: '60%', m: 'auto', mt: 4, mb: 4, maxWidth: '100%' }} maxWidth={false} disableGutters>
      <Paper sx={{width: 'auto', m: 'auto', p: 4, maxWidth: '100%', overflow: 'hidden' }} elevation={8}>
        <Stepper activeStep={activeStep} alternativeLabel={true}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption">Optional</Typography>
              );
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <React.Fragment>
          {handleSteps(activeStep)}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}
            {isStepTerminal(activeStep) ?
                <Button onClick={handleGoHome}>
                  Home
                </Button> :
                <Button onClick={handleNext}>
                  Next
                </Button>
            }

          </Box>
        </React.Fragment>
      </Paper>
    </Container>
  );
}