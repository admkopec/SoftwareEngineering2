import { createBrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';
import LogIn from '../components/LogIn';
import SignUp from '../components/SignUp';
import ErrorPage from './ErrorPage';
import ProductsPreview from '../components/ProductsPreview';
import ProductsSearch from '../components/ProductsSearch';
import ProductInfo from '../components/ProductInfo';
import OrderPage from './OrderPage';
import ClientOrders from '../components/ClientOrders';

export const signUpPageRoute = {
  path: '/signup',
  element: <SignUp />,
  errorElement: <ErrorPage />
};

export const loginPageRoute = {
  path: '/login',
  element: <LogIn />,
  errorElement: <ErrorPage />
};

export const productInfoSubPageRoute = {
  path: '/products/:productID',
  element: <ProductInfo />,
  errorElement: <ErrorPage />
};

export const productsSubPageRoute = {
  path: '/products',
  element: <ProductsSearch />,
  errorElement: <ErrorPage />
};

export const productsPreviewSubPageRoute = {
  path: '/',
  element: <ProductsPreview tag="Flowers" />,
  errorElement: <ErrorPage />
};

export const orderPageRoute = {
  path: '/order',
  element: <OrderPage />,
  errorElement: <ErrorPage />
};

export const ordersSubPageRoute = {
  path: '/orders',
  element: <ClientOrders />,
  errorElement: <ErrorPage />
};

export const homePageRoute = {
  path: '/',
  element: <HomePage />,
  errorElement: <ErrorPage />,
  children: [
    productsPreviewSubPageRoute, // 0
    productsSubPageRoute, // 1
    productInfoSubPageRoute, // 2
    ordersSubPageRoute // 3
  ]
};

export const routes = [homePageRoute, orderPageRoute, loginPageRoute, signUpPageRoute];

const router = createBrowserRouter(routes);

export default router;
