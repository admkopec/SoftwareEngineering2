import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import LogIn from "../components/LogIn";
import SignUp from "../components/SignUp";
import SignUpSuccess from "../components/SignUpSuccess";
import ErrorPage from "./ErrorPage";

export const routes = [
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <LogIn />,
    errorElement: <ErrorPage />
  },
  {
    path: "/signup",
    element: <SignUp />,
    errorElement: <ErrorPage />
  },
  {
    path: "/signup/success",
    element: <SignUpSuccess />,
    errorElement: <ErrorPage />
  },
];

const router = createBrowserRouter(routes);

export default router;