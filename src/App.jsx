import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme.js';
import { BrowserRouter } from 'react-router-dom';
import Router from './router.jsx';

function App() {

  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
