import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import theme from './theme.js';
// import ColorBends from './components/display/background/colorBends.jsx';
import GooeyNav from "./components/display/header/gooeyNav.jsx";
import Router from './router.jsx';

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