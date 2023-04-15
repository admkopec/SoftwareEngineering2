import React from 'react';
import ReactDOM from 'react-dom/client';

import { RouterProvider } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import router from './pages/Router';
import { GlobalStyle } from './resources/themes';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <GlobalStyle />
    <RouterProvider router={router} fallbackElement={<></>} />
  </React.StrictMode>
);

reportWebVitals();
