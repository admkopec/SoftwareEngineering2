import List from '@mui/material/List';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  AccordionSummaryProps,
  Box,
  CircularProgress,
  Divider,
  ListItem,
  ListSubheader,
  SvgIcon
} from '@mui/material';
import React, { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import PendingRoundedIcon from '@mui/icons-material/PendingRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { styled } from '@mui/material/styles';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { fetchClientOrders } from '../services/order.service';
import { Order } from '../resources/types';
import log from '../utils/logger';
import { isClient, isDeliveryMan, isEmployee, isEmployeeOrDeliveryMan } from '../services/user.service';
import UpdateItemDialog, { AvailableActions } from './UpdateItemDialog';
import LoadingButton from '@mui/lab/LoadingButton';

interface OrderListProps {
  statusList?: string | undefined;
  title: string;
}

const handleStatusText = (statusString: string | null) => {
  if (isClient() && statusString === null) return 'Processing';
  if (isClient() && statusString === 'accepted') return 'Accepted for execution. Order is on its way';
  if (isClient() && statusString === 'declined') return 'Declined. In case of inquiries please file a complaint';
  if (isClient() && statusString === 'delivered') return 'Delivered';
  if (isEmployee() && statusString === null) return 'Awaiting approval';
  if (isEmployee() && statusString === 'accepted') return 'Accepted';
  if (isEmployee() && statusString === 'declined') return 'Declined';
  if (isEmployeeOrDeliveryMan() && statusString === 'delivered') return 'Delivered';
  if (isDeliveryMan() && statusString === 'accepted') return 'To be delivered';
  return 'Could not determine';
};

const handleStatusIcon = (statusString: string | null) => {
  switch (statusString) {
    case null: {
      return PendingRoundedIcon;
    }
    case 'accepted': {
      return CheckCircleRoundedIcon;
    }
    case 'declined': {
      return CancelRoundedIcon;
    }
    case 'delivered': {
      return SendRoundedIcon;
    }
    default: {
      return HelpRoundedIcon;
    }
  }
};

const StyledAccordionSummary = styled((props: AccordionSummaryProps) => (
  <AccordionSummary expandIcon={<ArrowForwardIosRoundedIcon />} {...props} />
))(({ theme }) => ({
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)'
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1)
  }
}));

export default function OrdersList(props: OrderListProps) {
  const [ordersData, setOrdersData] = React.useState<Order[] | undefined>();
  const [isOrdersDataLoading, setIsOrdersDataLoading] = React.useState<boolean>(true);
  const [isOrderBeingUpdated, setIsOrderBeingUpdated] = React.useState<boolean[]>([false, false, false]);
  const [expanded, setExpanded] = React.useState<number | false>(false);
  const [selectedAction, setSelectedAction] = React.useState<AvailableActions>();

  const handleChange = (panel: number) => (event: React.SyntheticEvent, newPanel: boolean) => {
    if (expanded === panel) {
      log('Fetching products contained in order...');
    }
    setExpanded(newPanel ? panel : false);
  };

  useEffect(() => {
    fetchClientOrders(props.statusList)
      .then((responseObject: Order[]) => {
        log('Success fetching orders.');
        log(JSON.stringify(responseObject));
        setOrdersData(responseObject);
        return responseObject;
      })
      .catch((error: Error) => {
        log(`Error when trying to fetch orders: ${error.message}`);
      });
    setIsOrdersDataLoading(false);
  }, []);

  return (
    <List
      dense={true}
      sx={{
        overflow: 'auto',
        width: '100%',
        m: 'auto',
        display: 'flex',
        flexFlow: 'column nowrap',
        justifyItems: 'center',
        alignItems: 'center'
      }}
      id={`orders-list-${props.title}`}
      role={`orders-list-${props.title}`}
    >
      <ListSubheader component="div" sx={{ fontSize: 24, width: '100%', py: 2 }}>
        {props.title}
        <Divider />
      </ListSubheader>
      {isOrdersDataLoading ? (
        <CircularProgress size={80}></CircularProgress>
      ) : ordersData ? (
        ordersData.map((order: Order, index: number) => (
          <ListItem
            key={index + 1}
            sx={{ width: '100%', m: '0 auto', display: 'flex', flexFlow: 'row nowrap', justifyContent: 'center' }}
          >
            <Accordion onChange={handleChange(index + 1)} sx={{ width: '90%', display: 'block' }}>
              <StyledAccordionSummary>
                <Box
                  component={'div'}
                  sx={{
                    display: 'flex',
                    width: '100%',
                    flexFlow: 'row wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Typography sx={{ px: 2, width: '27%', maxWidth: '50%' }}>
                    Order #{order.orderId.slice(0, 6)}
                  </Typography>
                  <Typography sx={{ px: 2, width: '27%', maxWidth: '50%', color: 'text.secondary' }}>
                    {order.items.length} items
                  </Typography>
                  <Box
                    component="div"
                    display={'flex'}
                    flex={'row nowrap'}
                    justifyItems={'center'}
                    alignItems={'center'}
                    alignSelf={'end'}
                    sx={{ width: '27%', maxWidth: '50%' }}
                  >
                    <SvgIcon component={handleStatusIcon(order.status)} />
                    <Typography>{handleStatusText(order.status)}</Typography>
                  </Box>
                </Box>
              </StyledAccordionSummary>
              <AccordionDetails>
                {isEmployeeOrDeliveryMan() && <Typography>Full order ID: {order.orderId}</Typography>}
                <Typography>Date created: {order.dateCreated}</Typography>
                <Typography>
                  Delivery address: {order.deliveryAddress.street}
                  {order.deliveryAddress.buildingNo}/{order.deliveryAddress.houseNo},{order.deliveryAddress.postalCode}{' '}
                  {order.deliveryAddress.city}, {order.deliveryAddress.country}
                </Typography>
              </AccordionDetails>
              <AccordionActions>
                {order.status === null && isEmployee() && (
                  <>
                    <LoadingButton
                      loading={isOrderBeingUpdated[0]}
                      loadingIndicator={<CircularProgress color="primary" size={20} />}
                      type="button"
                      sx={{ m: 2 }}
                      onClick={() => {
                        setSelectedAction('acceptOrder');
                        setIsOrderBeingUpdated([true, false, false]);
                      }}
                    >
                      Accept
                    </LoadingButton>
                    <LoadingButton
                      loading={isOrderBeingUpdated[1]}
                      loadingIndicator={<CircularProgress color="primary" size={20} />}
                      type="button"
                      color="error"
                      sx={{ m: 2 }}
                      onClick={() => {
                        setSelectedAction('declineOrder');
                        setIsOrderBeingUpdated([false, true, false]);
                      }}
                    >
                      Decline
                    </LoadingButton>
                  </>
                )}
                {order.status === 'accepted' && isDeliveryMan() && (
                  <>
                    <LoadingButton
                      loading={isOrderBeingUpdated[2]}
                      loadingIndicator={<CircularProgress color="primary" size={20} />}
                      type="button"
                      sx={{ m: 2 }}
                      onClick={() => {
                        setSelectedAction('declineOrder');
                        setIsOrderBeingUpdated([false, false, true]);
                      }}
                    >
                      Mark as delivered
                    </LoadingButton>
                  </>
                )}
              </AccordionActions>
            </Accordion>
            <UpdateItemDialog
              orderID={order.orderId}
              action={selectedAction}
              open={isOrderBeingUpdated[0] || isOrderBeingUpdated[1] || isOrderBeingUpdated[2]}
              setOpen={(isOpen) => setIsOrderBeingUpdated([isOpen, isOpen, isOpen])}
            />
          </ListItem>
        ))
      ) : (
        <Typography>No orders found</Typography>
      )}
    </List>
  );
}
