import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '../styles/globals.css';
import type {AppProps} from 'next/app';
import Head from 'next/head';
import {createTheme} from '@mui/material';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#9c27b0'
    },
    secondary: {
      main: '#b02780'
    }
  }
});

function MyApp({Component, pageProps}: AppProps) {
  return <>
    <Head>
      <title> Power Schedules</title>
      <meta name="description" content="A view of sport schedules based on power rankings."/>
      <link rel="icon" href="/favicon.ico"/>
    </Head>
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Component {...pageProps} />
    </ThemeProvider>
  </>;
}

export default MyApp;
