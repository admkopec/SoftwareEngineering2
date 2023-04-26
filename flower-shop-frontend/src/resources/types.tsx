import { SvgIconComponent } from '@mui/icons-material';
import { NavigateFunction } from 'react-router-dom';
import { Category, Roles } from './constants';

// Will be used later in profile pages
export interface Credentials {
  name: string,
  email: string,
  password: string,
  newsletter?: boolean
}

interface Address {
  street: string,
  buildingNo?: string,
  houseNo?: string,
  postalCode: string,
  city: string,
  country: string
}

export interface OrderCreation {
  id?: string,
  clientID?: string,
  deliveryAddress: Address,
  items: OrderProduct[]
}

export interface Order {
  id: string,
  deliveryAddress: Address,
  items: OrderProduct[]
}

// To use in future order processing
export interface OrderProduct {
  productID: string,
  quantity: number
}

export interface User {
  id: string;
  name: string;
  email: string;
  address?: Address;
}

export interface JWTToken {
  jwttoken: string;
}

export interface Product {
  productID: string,
  name: string,
  image: string,
  description: string,
  price: number,
  quantity: number,
  category: Category
}

export interface MenuItemSettings {
  key: string;
  icon: SvgIconComponent;
  callback: (navigate: NavigateFunction) => void;
}
