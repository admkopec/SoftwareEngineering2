import { SvgIconComponent } from '@mui/icons-material';
import { NavigateFunction } from 'react-router-dom';
import { Category } from './constants';

// Will be used later in profile pages
export interface UserData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface AddressCreation {
  street: string;
  buildingNo: string;
  houseNo: string;
  postalCode: string;
  city: string;
  country: string;
  saveAddress?: string;
}

export interface OrderProduct {
  productID: string;
  quantity: number;
}

export interface OrderCreation {
  id?: string;
  clientID?: string;
  deliveryAddress: AddressCreation;
  items: OrderProduct[];
}

export interface Order {
  orderId: string;
  deliveryAddress: AddressCreation;
  dateCreated: string;
  items: OrderProduct[];
  status: string;
}

export interface User {
  name: string;
  email: string;
  password: string;
  newsletter: boolean;
}

export interface JWTToken {
  jwttoken: string;
}

export interface Product {
  productID: string;
  name: string;
  image: string;
  description: string;
  price: number;
  quantity: number;
  category: Category;
}

export interface BasketItem {
  product: Product;
  quantity: number;
}

export interface MenuItemSettings {
  key: string;
  Icon?: SvgIconComponent;
  callback: (navigate: NavigateFunction) => void;
}
