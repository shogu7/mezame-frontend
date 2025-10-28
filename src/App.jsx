import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import { motion } from "framer-motion";
import theme from './theme.js';
import ColorBends from './components/display/background/colorBends.jsx';
import GooeyNav from "./components/display/header/gooeyNav.jsx";
import Router from './router.jsx';

function App() {
  const items = [
    { label: "Home", href: "/" },
    { label: "Collection", href: "/home" },
    { label: "Contact", href: "#" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          {/* Background */}
          <div
            style={{
              position: "fixed",
              inset: 0,
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

          {/* Header */}
          <div style={{ position: 'relative' }}>
            <GooeyNav
              items={items}
              onLogin={() => {}}
              particleCount={15}
              particleDistances={[90, 10]}
              particleR={100}
              initialActiveIndex={0}
              animationTime={600}
              timeVariance={300}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            />
          </div>

          {/* Main content */}
          <Router />
        </BrowserRouter>
      </ThemeProvider>
    </motion.div>
  );
}

export default App;
