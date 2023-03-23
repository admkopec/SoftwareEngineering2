import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    palette?: {
      primary?: {
        light?: string,
        main?: string,
        dark?: string,
        contrastText?: string,
      },
      secondary?: {
        light?: string,
        main?: string,
        dark?: string,
        contrastText?: string,
      },
      error?: {
        light?: string,
        main?: string,
        dark?: string,
        contrastText?: string,
      },
      warning?: {
        light?: string,
        main?: string,
        dark?: string,
        contrastText?: string,
      },
      info?: {
        light?: string,
        main?: string,
        dark?: string,
        contrastText?: string,
      },
      custom?: {
        light?: string,
        main?: string,
        dark?: string,
        contrastText?: string,
      },
      contrastThreshold?: number,
      tonalOffset?: number,
    },
  }
}

export const mainTheme = createTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#66c927',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: '#0066ff',
      main: '#0044ff',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffcc00',
    },
    contrastThreshold: 4.5,
    tonalOffset: 0.2,
  },
});

// const theme = createTheme({
//   palette: {
//     primary: {
//       light?: string;
//       main: string;
//       dark?: string;
//       contrastText?: string;
//     },
//     secondary: {
//       light?: string;
//       main: string;
//       dark?: string;
//       contrastText?: string;
//     },
//     success: {
//       light?: string;
//       main: string;
//       dark?: string;
//       contrastText?: string;
//     },
//   },
// });

