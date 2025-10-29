import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import theme from '../theme.js';
import Register from '../components/user/auth/register/register.jsx';
import Login from '../components/user/auth/login/login.jsx';
import { jwtDecode } from 'jwt-decode';
import IsConected from '../components/user/auth/isConnected.jsx';

function Connection() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = jwtDecode(token);
        setUser(payload);
      } catch {
        setUser(null);
      }
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ maxWidth: { xs: 300, sm: 600, md: 900 }, mx: 'auto' }}>
          <Typography variant="h4" align="center" sx={{ mt: 4, mb: 2, fontWeight: 700 }}>
            Mezame Frontend
          </Typography>

          {!user && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Card sx={{ 
                width: 380, 
                maxWidth: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2,
                boxShadow: '0 8px 32px rgba(0, 180, 216, 0.3), 0 0 80px rgba(0, 180, 216, 0.15)',
                border: '1px solid rgba(0, 180, 216, 0.2)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0, 180, 216, 0.4), 0 0 100px rgba(0, 180, 216, 0.2)',
                }
              }}>
                {showRegister ? <Register setUser={setUser} /> : <Login setUser={setUser} />}

                <Box sx={{ textAlign: 'center', color: '#a8dadc', mt: 0.5 }}>
                  {showRegister ? (
                    <>
                      Déjà inscrit ?&nbsp;
                      <Button 
                        size="small" 
                        onClick={() => setShowRegister(false)}
                        sx={{ color: '#00b4d8', fontWeight: 600, '&:hover': { backgroundColor: 'rgba(0, 180, 216, 0.1)' } }}
                      >
                        Sign in
                      </Button>
                    </>
                  ) : (
                    <>
                      Pas de compte ?&nbsp;
                      <Button 
                        size="small" 
                        onClick={() => setShowRegister(true)}
                        sx={{ color: '#00b4d8', fontWeight: 600, '&:hover': { backgroundColor: 'rgba(0, 180, 216, 0.1)' } }}
                      >
                        Sign up
                      </Button>
                    </>
                  )}
                </Box>
              </Card>
            </Box>
          )}

          <IsConected user={user} setUser={setUser} />
        </Box>
      </ThemeProvider>
    </motion.div>
  );
}

export default Connection;