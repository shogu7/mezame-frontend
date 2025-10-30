import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import theme from './shared/styles/theme.js';
import GooeyNav from './shared/components/layout/Header/gooeyNav.jsx';
import Router from './Router.jsx';


function App() {
  const items = [
    { label: "Home", href: "/" },
    { label: "Collection", href: "/home" },
    { label: "Contact", href: "#" },
    { label: "Connexion", href: "/login" },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        {/* Background */}

        {/* Header */}
        <div style={{ position: 'relative' }}>
          <GooeyNav items={items}/>
        </div>

        {/* Main content */}  
        <Router />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;