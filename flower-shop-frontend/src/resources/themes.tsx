import { createGlobalStyle } from 'styled-components';
import { createTheme } from '@mui/material/styles';
import { blue } from '@mui/material/colors';

declare module '@mui/material/styles' {
  interface Theme {
    palette?: {
      primary?: {
        light?: string;
        main?: string;
        dark?: string;
        contrastText?: string;
      };
      secondary?: {
        light?: string;
        main?: string;
        dark?: string;
        contrastText?: string;
      };
      error?: {
        light?: string;
        main?: string;
        dark?: string;
        contrastText?: string;
      };
      warning?: {
        light?: string;
        main?: string;
        dark?: string;
        contrastText?: string;
      };
      info?: {
        light?: string;
        main?: string;
        dark?: string;
        contrastText?: string;
      };
      custom?: {
        light?: string;
        main?: string;
        dark?: string;
        contrastText?: string;
      };
      contrastThreshold?: number;
      tonalOffset?: number;
    };
  }
}

export const mainTheme = createTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#054b65'
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      // light: will be calculated from palette.primary.main,
      main: blue[500],
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffcc00'
    },
    contrastThreshold: 4.5,
    tonalOffset: 0.2
  },
  typography: {
    fontFamily: [
      'Raleway',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(',')
  }
});

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: white;
    width: 100%;
  }
`;
