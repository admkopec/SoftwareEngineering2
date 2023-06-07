import React, { useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useLocation, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { TransitionGroup } from 'react-transition-group';
import Grow from '@mui/material/Grow';
import { AutoDisabler, Validate, ValidationGroup } from 'mui-validate';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import BasketList from '../components/BasketList';
import { clearBasket, fetchBasket, fetchProduct } from '../services/product.service';
import { AddressCreation, BasketItem, OrderProduct, Product } from '../resources/types';
import log from '../utils/logger';
import { placeOrder } from '../services/order.service';

const steps = ['Your products', 'Delivery details', 'Payment', 'Summary'];

const isStepOptional = (step: number) => step === -1;
const isStepTerminal = (step: number) => step >= steps.length - 1;
const isStepFirst = (step: number) => step === 0;
const isStepAddress = (step: number) => step === 1;

export default function OrderPage() {
  const orderProduct = useLocation().state as OrderProduct | null;
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [basketData, setBasketData] = React.useState<BasketItem[]>();
  const [totalDue, setTotalDue] = React.useState<number | undefined>();
  const [addressData, setAddressData] = React.useState<AddressCreation | undefined>();
  const isStepSkipped = (step: number) => skipped.has(step);
  const linkedRef = useRef();

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
    if (activeStep === 0) navigate('/');
    else setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleBasketFetch = () => {
    if (orderProduct) {
      const { productID, quantity } = orderProduct;
      fetchProduct(productID)
        .then((product: Product) => {
          setBasketData([{ product, quantity }]);
        })
        .catch((error: Error) => {
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
  };

  const handleGoHome = async () => {
    if (addressData) {
      await placeOrder({
        deliveryAddress: addressData,
        items: basketData?.map((e) => ({ productID: e.product.productID, quantity: e.quantity })) ?? []
      }).then(() => clearBasket());
      navigate('/');
    }
  };

  const handleAddressDataAndNext = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const address: AddressCreation = Object.fromEntries(
      new FormData(event.currentTarget).entries()
    ) as unknown as AddressCreation;
    setAddressData(address);
    log(JSON.stringify(address));
    handleNext();
  };

  useEffect(() => {
    handleBasketFetch();
  }, []);

  useEffect(() => {
    let sum = 0;
    basketData?.forEach((basketItem: BasketItem) => {
      sum += basketItem.quantity * basketItem.product.price;
    });
    setTotalDue(sum);
  }, [basketData]);

  const handleSteps = (stepNo: number) => {
    switch (stepNo) {
      case 0: {
        return (
          <Container>
            <Typography sx={{ mt: 3, mb: 1 }} variant={'h6'}>
              See an overview of products you wish to buy
            </Typography>
            <Box sx={{ m: '0 auto', p: 2 }}>
              <BasketList editable={!orderProduct} basketItems={basketData} dense={false} refetch={handleBasketFetch} />
              <Typography variant={'overline'} fontSize={20}>
                Total due: {totalDue}$
              </Typography>
            </Box>
          </Container>
        );
      }
      case 1: {
        return (
          <Container>
            <Typography sx={{ mt: 3, mb: 1 }} variant={'h6'}>
              Provide address details for delivery
            </Typography>
            <Box
              sx={{ m: '2 auto', p: 2 }}
              component="form"
              onSubmit={handleAddressDataAndNext}
              name="address-form"
              id="address-form"
            >
              <Grid container spacing={2} alignItems={'start'}>
                <Grid item xs={12} sm={6}>
                  <Validate
                    name="internal first-name"
                    required={[true, 'This is a required field']}
                    reference={linkedRef}
                  >
                    <TextField
                      fullWidth
                      id="firstName"
                      label="First Name"
                      name="firstName"
                      defaultValue={addressData?.firstName}
                      autoComplete="given-name"
                      autoFocus
                    />
                  </Validate>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Validate
                    name="internal last-name"
                    required={[true, 'This is a required field']}
                    reference={linkedRef}
                    initialValidation="silent"
                  >
                    <TextField
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      defaultValue={addressData?.lastName}
                      name="lastName"
                      autoComplete="family-name"
                    />
                  </Validate>
                </Grid>
                <Grid item xs={12}>
                  <Validate
                    name="internal street"
                    reference={linkedRef}
                    required={[true, 'This is a required field']}
                    initialValidation="silent"
                  >
                    <TextField
                      fullWidth
                      id="street"
                      label="Street"
                      defaultValue={addressData?.street}
                      name="street"
                      autoComplete="street-address address-line1"
                    />
                  </Validate>
                </Grid>
                <Grid item xs={4}>
                  <Validate
                    name="internal building-no"
                    reference={linkedRef}
                    regex={[/\d+/, 'Please enter a valid number']}
                    required={[true, 'This is a required field']}
                    initialValidation="silent"
                  >
                    <TextField
                      fullWidth
                      id="buildingNo"
                      label="Building number"
                      defaultValue={addressData?.buildingNo}
                      name="buildingNo"
                      autoComplete="street-address address-line2"
                    />
                  </Validate>
                </Grid>
                <Grid item xs={4}>
                  <Validate
                    name="internal house-no"
                    reference={linkedRef}
                    regex={[/\d*/, 'Please enter a valid number']}
                    required={[true, 'This is a required field']}
                    initialValidation="silent"
                  >
                    <TextField
                      fullWidth
                      id="houseNo"
                      defaultValue={addressData?.houseNo}
                      label="House or flat number"
                      name="houseNo"
                      autoComplete="street-address address-line2"
                    />
                  </Validate>
                </Grid>
                <Grid item xs={4}>
                  <Validate
                    name="internal postal-code"
                    reference={linkedRef}
                    regex={[/\d{2}-\d{3}/, 'Please enter a valid postal code']}
                    required={[true, 'This is a required field']}
                    initialValidation="silent"
                  >
                    <TextField
                      fullWidth
                      defaultValue={addressData?.postalCode}
                      name="postalCode"
                      label="Postal Code"
                      id="postalCode"
                      autoComplete="postal-code"
                    />
                  </Validate>
                </Grid>
                <Grid item xs={6}>
                  <Validate
                    name="internal city"
                    reference={linkedRef}
                    required={[true, 'This is a required field']}
                    initialValidation="silent"
                  >
                    <TextField
                      fullWidth
                      name="city"
                      label="City"
                      defaultValue={addressData?.city}
                      id="city"
                      autoComplete="street-address address-line3"
                    />
                  </Validate>
                </Grid>
                <Grid item xs={6}>
                  <Validate
                    name="internal country"
                    reference={linkedRef}
                    required={[true, 'This is a required field']}
                    initialValidation="silent"
                  >
                    <TextField
                      fullWidth
                      name="country"
                      defaultValue={addressData?.country}
                      label="Country"
                      id="country"
                      autoComplete="country-name"
                    />
                  </Validate>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox role="save-address" id="save-address" name="save-address" color="primary" />}
                    sx={{ my: 2 }}
                    defaultValue={addressData?.saveAddress}
                    label="Save this address in my profile for future orders"
                  />
                </Grid>
              </Grid>
            </Box>
          </Container>
        );
      }
      case 2: {
        return (
          <Container>
            <Typography sx={{ mt: 3, mb: 1 }} variant={'h6'}>
              Choose your preferred payment method
            </Typography>
            <Typography>Here goes Stripe redirect...</Typography>
          </Container>
        );
      }
      case 3: {
        return (
          <Container sx={{ display: 'absolute' }}>
            <Typography sx={{ mt: 3, mb: 1 }} variant={'h6'}>
              Payment approved - purchase completed!
            </Typography>
            <Grid margin={3}>
              <Typography>First name: {addressData?.firstName}</Typography>
              <Typography>Last name: {addressData?.lastName}</Typography>
              <Typography>
                Address: {addressData?.street} {addressData?.buildingNo} / {addressData?.houseNo}
              </Typography>
              <Typography>City: {addressData?.city}</Typography>
              <Typography>Postal Code: {addressData?.postalCode}</Typography>
              <Typography>Country: {addressData?.country}</Typography>
              <BasketList editable={false} basketItems={basketData} dense={true} refetch={handleBasketFetch} />
            </Grid>
          </Container>
        );
      }
      default: {
        throw new Error('Access denied.');
      }
    }
  };

  const renderSteps = () =>
    steps.map((_, index) => (
      <Container sx={{ display: 'absolute' }} key={index}>
        {index === activeStep ? <Grow in={index === activeStep}>{handleSteps(index)}</Grow> : <></>}
      </Container>
    ));

  return (
    <Container sx={{ width: '60%', m: 'auto', mt: 4, mb: 4, maxWidth: '100%' }} maxWidth={false} disableGutters>
      <Paper sx={{ width: 'auto', m: 'auto', p: 4, maxWidth: '100%', overflow: 'hidden' }} elevation={8}>
        <Stepper activeStep={activeStep} alternativeLabel={true}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            if (isStepOptional(index)) {
              labelProps.optional = <Typography variant="caption">Optional</Typography>;
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
        <Container sx={{ textAlign: 'center' }}>
          <ValidationGroup>
            <Container>
              <TransitionGroup>{renderSteps()}</TransitionGroup>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
                  {isStepFirst(activeStep) ? 'Cancel' : 'Back'}
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Skip
                  </Button>
                )}
                {isStepTerminal(activeStep) ? (
                  <Button onClick={handleGoHome}>Finish</Button>
                ) : isStepAddress(activeStep) ? (
                  <AutoDisabler>
                    <Button type={'submit'} form={'address-form'}>
                      Next
                    </Button>
                  </AutoDisabler>
                ) : (
                  <Button onClick={handleNext}>Next</Button>
                )}
              </Box>
            </Container>
          </ValidationGroup>
        </Container>
      </Paper>
    </Container>
  );
}
