import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import theme from './shared/styles/theme.js';
import GooeyNav from './shared/components/layout/Header/gooeyNav.jsx';
import Router from './router.jsx';
import { useAuth } from './shared/context/authContext.js'; 

function App() {
  const { user, loading } = useAuth();

  if (loading) return null; 
  
  const items = [
    { label: "Home", href: "/" },
    { label: "Collection", href: user ? `/collection/${user.username}` : "/login" },
    { label: "Contact", href: "#" },
    { label: "Connexion", href: "/login" },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
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
