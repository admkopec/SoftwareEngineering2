import React from 'react';
import ReactDOM from 'react-dom/client';

import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import reportWebVitals from './reportWebVitals';
import router from './pages/Router';
import { GlobalStyle, mainTheme } from './resources/themes';

const root = ReactDOM.createRoot(document.querySelector('#root') as HTMLElement);

root.render(
  <React.StrictMode>
    <GlobalStyle />
    <ThemeProvider theme={mainTheme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
