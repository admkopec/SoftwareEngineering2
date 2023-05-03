import { createBrowserRouter } from 'react-router-dom';
import HomePage from "./HomePage";
import LogIn from '../components/LogIn';
import SignUp from '../components/SignUp';
import SignUpSuccess from '../components/SignUpSuccess';
import ErrorPage from './ErrorPage';
import ProductsPreview from "../components/ProductsPreview";
import ProductInfo from "../components/ProductInfo";

export const signUpSuccessPageRoute = {
  path: '/signup/success',
  element: <SignUpSuccess />,
  errorElement: <ErrorPage />
}

export const signUpPageRoute = {
  path: '/signup',
  element: <SignUp />,
  errorElement: <ErrorPage />
}

export const loginPageRoute = {
  path: '/login',
  element: <LogIn />,
  errorElement: <ErrorPage />
}

export const productInfoSubPageRoute = {
  path: '/products/:name',
  element: <ProductInfo />,
  errorElement: <ErrorPage />
}

export const productsSubPageRoute = {
  path: '/products',
  element: <></>,
  errorElement: <ErrorPage />
}

export const productsPreviewSubPageRoute = {
  path: '/',
  element: <ProductsPreview tag={'Flowers'}></ProductsPreview>,
  errorElement: <ErrorPage />
}

export const homePageRoute = {
  path: '/',
  element: <HomePage />,
  errorElement: <ErrorPage />,
  children: [
    productsPreviewSubPageRoute,  // 0
    productsSubPageRoute,         // 1
    productInfoSubPageRoute       // 2
  ]
}

export const routes = [
  homePageRoute,
  loginPageRoute,
  signUpPageRoute,
  signUpSuccessPageRoute
];

const router = createBrowserRouter(routes);

export default router;
