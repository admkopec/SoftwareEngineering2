import { SvgIconComponent } from "@mui/icons-material";
import { NavigateFunction } from "react-router-dom";

export interface Credentials {
  username: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  address?: string;
}

export interface Product {
  id: string,
  name: string,
  image: Blob,
  description: string,
  price: number,
}

export interface MenuItemSettings {
  key: string;
  icon: SvgIconComponent;
  callback: (navigate: NavigateFunction) => void;
}