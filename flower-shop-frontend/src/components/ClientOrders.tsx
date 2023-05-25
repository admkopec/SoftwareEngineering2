import Container from '@mui/material/Container';
import OrdersList from './OrdersList';
import { OrderStatus } from '../resources/constants';

export default function ClientOrders(){
  return (
    <Container sx={{display: 'flex', flexFlow: 'column nowrap'}}>
      <OrdersList status={OrderStatus.Pending} />
      <OrdersList status={OrderStatus.Accepted} />
      <OrdersList status={OrderStatus.Declined} />
      <OrdersList status={OrderStatus.Delivered} />
    </Container>
  );
}