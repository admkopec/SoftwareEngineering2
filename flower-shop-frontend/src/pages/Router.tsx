import { createBrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';
import LogIn from '../components/LogIn';
import SignUp from '../components/SignUp';
import SignUpSuccess from '../components/SignUpSuccess';
import ErrorPage from './ErrorPage';
import ProductInfoPage from './ProductInfoPage';

enum User {
  Client,
  Employee,
  Deliveryman
}

export interface PageProps {
  isLoggedIn: boolean;
  userType?: User;
}

export const routes = [
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/login',
    element: <LogIn />,
    errorElement: <ErrorPage />
  },
  {
    path: '/signup',
    element: <SignUp />,
    errorElement: <ErrorPage />
  },
  {
    path: '/signup/success',
    element: <SignUpSuccess />,
    errorElement: <ErrorPage />
  },
  {
    path: '/product/:productId',
    element: <ProductInfoPage />,
    errorElement: <ErrorPage />
  }
];

const router = createBrowserRouter(routes);

export default router;
