import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import theme from './shared/styles/theme.js';
import GooeyNav from './shared/components/layout/Header/gooeyNav.jsx';
import Router from './router.jsx';
import { AuthProvider, useAuth } from './shared/context/authContext.js';

function AppContent() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

 // console.log('🔵 AppContent render - user:', user, 'loading:', loading);

  const showMessage = (msg) => {
    setSnackbarMessage(msg);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const username = user?.username || '';
  const items = [
    { label: "Home", href: "/" },
    { label: "Library", href: "/library" },
    { 
      label: "Collection", 
      href: username ? `/collection/${username}` : "/collection",
      requiresAuth: true 
    },
    { 
      label: "Profile", 
      href: username ? `/profile/${username}` : "/profile",
      requiresAuth: true 
    },
    ...(user?.is_admin === 1 ? [{ label: "Admin Panel", href: "/admin", requiresAuth: true }] : []),
    { 
      label: user ? "Déconnexion" : "Connexion", 
      href: user ? "/logout" : "/login",
      isAuthToggle: true
    },
  ];

  // console.log('Items:', items.map(i => ({ label: i.label, href: i.href })));

  const handleNavItemClick = (href) => {
    // console.log('Click:', href, 'user:', user?.username);
    
    if (!href) return;

    const hrefNorm = String(href).toLowerCase();
    const item = items.find(it => it.href === href);

    if (hrefNorm === "/logout") {
      logout();
      navigate("/", { replace: true });
      return;
    }

    if (!user && item?.requiresAuth) {
      console.log('❌ Accès refusé');
      showMessage("Vous devez être connecté pour accéder à cette page");
      navigate("/login", { state: { from: href }, replace: true });
      return;
    }

    console.log('✅ Navigation vers:', hrefNorm);
    navigate(hrefNorm);
  };

  useEffect(() => {
    if (user || loading) return;
    
    const currentPath = location.pathname.toLowerCase();
    const isProtectedPath = 
      currentPath.startsWith('/profile') || 
      currentPath.startsWith('/collection');
    
    if (isProtectedPath && currentPath !== '/login') {
     // console.log('Guard: Redirection vers login');
      showMessage("Vous devez être connecté pour accéder à cette page");
      navigate("/login", { state: { from: location.pathname }, replace: true });
    }
  }, [user, loading, location.pathname, navigate]);

  if (loading) {
    // console.log('Loading...');
    return null;
  }

  return (
    <>
      <CssBaseline />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <GooeyNav 
          items={items} 
          onItemClick={handleNavItemClick}
          key={user?.username || 'guest'}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Router />
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}