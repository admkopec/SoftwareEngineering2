import { SvgIconComponent } from "@mui/icons-material";
import { NavigateFunction } from "react-router-dom";
import {Category, Roles} from "./constants";

// Will be used later in profile pages
export interface Credentials {
  name: string,
  email: string,
  password: string,
  role?: Roles
}

// To use in future order processing
export interface OrderProduct {
  productId: string,
  quantity: number
}

export interface User {
  id: string;
  name: string;
  email: string;
  address?: string;
}

export interface JWTToken {
  jwtToken: string;
}

export interface Product {
  productId: string,
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