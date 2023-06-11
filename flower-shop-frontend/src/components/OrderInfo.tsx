import Container from '@mui/material/Container';
import React, { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';
import { BasketItem, Order } from '../resources/types';
import { isEmployeeOrDeliveryMan } from '../services/user.service';
import BasketList from './BasketList';
import { fetchOrderItems } from '../services/order.service';
import log from '../utils/logger';

interface OrderInfoProps {
  order: Order;
}

export default function OrderInfo(props: OrderInfoProps) {
  const { order } = props;
  const [orderItems, setOrderItems] = React.useState<BasketItem[]>();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  useEffect(() => {
    fetchOrderItems(order.orderId)
      .then((responseJSON: BasketItem[]) => {
        log('Success fetching order items.');
        log(JSON.stringify(responseJSON));
        setOrderItems(responseJSON);
        return responseJSON;
      })
      .catch((error: Error) => {
        log(`Error when trying to fetch order items: ${error.message}`);
      });
    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading ? (
        <CircularProgress size={60} />
      ) : (
        <Container>
          {isEmployeeOrDeliveryMan() && <Typography>Full order ID: {order.orderId}</Typography>}
          <Typography>Date created: {order.dateCreated}</Typography>
          <Typography>
            Delivery address: {order.deliveryAddress.street} {order.deliveryAddress.buildingNo}/
            {order.deliveryAddress.houseNo}, {order.deliveryAddress.postalCode} {order.deliveryAddress.city},{' '}
            {order.deliveryAddress.country}
          </Typography>
          <Typography>Items bought:</Typography>
          <BasketList editable={false} basketItems={orderItems} dense={true} refetch={() => {}} />
        </Container>
      )}
    </>
  );
}
