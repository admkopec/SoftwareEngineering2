import Container from '@mui/material/Container';
import OrdersList from './OrdersList';
import { OrderStatus, Roles } from '../resources/constants';

export default function ClientOrders() {
  const handleOrdersByRole = () => {
    switch (sessionStorage.getItem('role')) {
      case 'client': {
        return (
          <Container>
            <OrdersList status={OrderStatus.Any} role={Roles.Client} />
          </Container>
        );
      }
      case 'employee': {
        return (
          <Container>
            <OrdersList status={OrderStatus.Pending} role={Roles.Employee} />
            <OrdersList status={OrderStatus.Accepted} role={Roles.Employee} />
            <OrdersList status={OrderStatus.Declined} role={Roles.Employee} />
            <OrdersList status={OrderStatus.Delivered} role={Roles.Employee} />
          </Container>
        );
      }
      case 'deliveryMan': {
        return (
          <Container>
            <OrdersList status={OrderStatus.Pending} role={Roles.DeliveryMan} />
            <OrdersList status={OrderStatus.Delivered} role={Roles.DeliveryMan} />
          </Container>
        );
      }
      default: {
        throw new Error('Invalid user role.');
      }
    }
  };

  return <Container sx={{ display: 'flex', flexFlow: 'column nowrap' }}>{handleOrdersByRole()}</Container>;
}
