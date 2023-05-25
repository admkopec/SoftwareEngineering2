import List from '@mui/material/List';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Divider,
  ListItem,
  ListSubheader
} from '@mui/material';
import React, { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { OrderStatus } from '../resources/constants';
import { fetchClientOrders } from '../services/order.service';
import { Order } from '../resources/types';
import log from '../utils/logger';

interface OrderListProps {
  status: OrderStatus
}

export default function OrdersList(props: OrderListProps){
  const [ordersData, setOrdersData] = React.useState<Order[]>();
  const [expanded, setExpanded] = React.useState<number | false>(false);

  useEffect(()=>{
    fetchClientOrders().then((responseObject: Order[]) => {
      log('Success fetching orders.');
      log(JSON.stringify(responseObject));
      setOrdersData(responseObject);
      return responseObject;
    })
      .catch((error: Error) => {
        log(`Error when trying to fetch orders: ${error.message}`);
      });
  }, []);

  const handleChange = (panel: number) => (event: React.SyntheticEvent, newPanel: boolean) => {
    if (expanded === panel) {
      log("Fetching products contained in order...");
    }
    setExpanded(newPanel ? panel : false);
  };

  return (
    <List dense={true} sx={{overflow: 'auto'}} id={`orders-list-${props.status.toString()}`}
          role={`orders-list-${props.status.toString()}`}>
      <ListSubheader component="div" sx={{ fontSize: 24, width: '100%' }}>
        {OrderStatus[props.status]}
        <Divider />
      </ListSubheader>
      {ordersData ? ordersData.map((order: Order, index: number) => (
        <ListItem key={index+1}>
          <Accordion disabled={props.status === OrderStatus.Delivered || props.status === OrderStatus.Declined}
                     onChange={handleChange(index+1)}>
            <AccordionSummary>
              <Typography sx={{ width: '33%', flexShrink: 0 }}>
                Order #{index+1}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {order.items.length} items
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Order ID: {order.orderId}
              </Typography>
              <Typography>
                Client ID: {order.clientId}
              </Typography>
              <Typography>
                Created: {order.dateCreated}
              </Typography>
              <Typography>
                Delivery address: {order.deliveryAddress.country}
              </Typography>
            </AccordionDetails>
            <AccordionActions>
              {props.status === OrderStatus.Pending ?? <>
                <Button>Accept</Button>
                <Button>Decline</Button>
                </>}
            </AccordionActions>
          </Accordion>
        </ListItem>
      )) : <Typography>No orders found</Typography>}
    </List>
  );
}