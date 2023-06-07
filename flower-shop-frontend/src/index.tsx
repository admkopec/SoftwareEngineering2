import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import reportWebVitals from './reportWebVitals';
import router from './pages/Router';
import { GlobalStyle, mainTheme } from './resources/themes';
import 'overlayscrollbars/overlayscrollbars.css';

const root = ReactDOM.createRoot(document.querySelector('#root') as HTMLElement);

root.render(
  <React.StrictMode>
    <OverlayScrollbarsComponent
      element={'div'}
      style={{ width: '100%', height: '100%' }}
      options={{ scrollbars: { theme: 'os-theme-light' }, overflow: { x: 'hidden', y: 'scroll' } }}
      defer
    >
      <GlobalStyle />
      <ThemeProvider theme={mainTheme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </OverlayScrollbarsComponent>
  </React.StrictMode>
);

reportWebVitals();
