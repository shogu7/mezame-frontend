import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import theme from './shared/styles/theme.js';
import GooeyNav from './shared/components/layout/Header/gooeyNav.jsx';
import Router from './router.jsx';
import { useAuth } from './shared/context/authContext.js';
// import FaultyTerminal from './shared/components/layout/Background/FaultyTerminal/FaultyTerminal.jsx';
import LightRays from './shared/components/layout/Background/LightRays/LightRays.jsx';


function App() {
  const { user, loading } = useAuth();

  if (loading) return null;

  const items = [
    { label: "Home", href: "/" },
    { label: "Collection", href: user ? `/collection/${user.username}` : "/login" },
    { label: "Profile", href: `/profile/${user.username}` },
    { label: "Connexion", href: "/login" },
  ];

  return (
    <ThemeProvider theme={theme}>
      {/* 2.82 s LCP ---> TODO: fix*/}
      <LightRays
        raysOrigin="top-center"
        raysColor="#00ffff"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={1.2}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0.1}
        distortion={0.05}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />

      <CssBaseline />
      <BrowserRouter>
        {/* Header */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <GooeyNav items={items} />
        </div>

        {/* Main */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Router />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
