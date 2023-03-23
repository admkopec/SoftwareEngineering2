import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  RouterProvider,
} from "react-router-dom";
import reportWebVitals from './reportWebVitals'
import router from './pages/Router';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} fallbackElement={<></>}/>
  </React.StrictMode>
);

reportWebVitals();
