import React from 'react';
import ReactDOM from 'react-dom/client';

import { RouterProvider } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import router from './pages/Router';
import { GlobalStyle, mainTheme } from './resources/themes';
import { ThemeProvider } from 'styled-components';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <GlobalStyle />
    <ThemeProvider theme={mainTheme}>
      <RouterProvider router={router} fallbackElement={<></>} />
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
