import Container from '@mui/material/Container';
import OrdersList from './OrdersList';
import { OrderStatus } from '../resources/constants';
import { isClient, isDeliveryMan, isEmployee } from '../services/user.service';
import log from '../utils/logger';

const parseStatusList = (statusList: OrderStatus[]) => {
  let stringStatusList;
  if (statusList) {
    stringStatusList = statusList.map((status) => OrderStatus[status].toLowerCase()).join(',');
    log(stringStatusList);
  }
  return stringStatusList;
};

export default function ClientOrders() {
  const handleOrdersByRole = () => {
    if (isClient())
      return (
        <>
          <OrdersList title="My Orders" />
        </>
      );
    if (isEmployee())
      return (
        <>
          <OrdersList statusList={parseStatusList([OrderStatus.Pending])} title="Pending" />
          <OrdersList statusList={parseStatusList([OrderStatus.Accepted, OrderStatus.Declined])} title="Resolved" />
          <OrdersList statusList={parseStatusList([OrderStatus.Delivered])} title="Past" />
        </>
      );
    if (isDeliveryMan())
      return (
        <>
          <OrdersList statusList={parseStatusList([OrderStatus.Accepted])} title="To Deliver" />
          <OrdersList statusList={parseStatusList([OrderStatus.Delivered])} title="Delivered" />
        </>
      );
    throw new Error('Invalid user role.');
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexFlow: 'column nowrap',
        height: 'auto',
        width: '100%',
        alignItems: 'center',
        justifyItems: 'start'
      }}
    >
      {handleOrdersByRole()}
    </Container>
  );
}
