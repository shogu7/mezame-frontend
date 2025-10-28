import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme.js';
import ColorBends from './components/display/background/colorBends.jsx';
import { BrowserRouter } from 'react-router-dom';
import Router from './router.jsx';

function App() {

  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
  <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none"
      }}
    >
      <ColorBends
        colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
        rotation={20}
        speed={0.7}
        scale={1}
        frequency={1.4}
        warpStrength={1.2}
        mouseInfluence={0.8}
        parallax={0.6}
        noise={0.08}
        transparent
      />
    </div>
        <Router />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App; // TODO: 
