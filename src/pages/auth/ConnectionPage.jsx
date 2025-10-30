import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import theme from '../../shared/styles/theme.js';
import Register from '../../features/auth/components/register/register.jsx';
import Login from '../../features/auth/components/login/login.jsx';
import { jwtDecode } from 'jwt-decode';
import IsConected from '../../features/auth/components/isConnected.jsx';

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
        <Box sx={{ maxWidth: { xs: 300, sm: 600, md: 900 }, mx: 'auto', py: 4 }}>
          <Typography variant="h4" align="center" sx={{ mb: 3, fontWeight: 700, color: 'common.white' }}>
            Mezame Frontend
          </Typography>

          {!user && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card sx={{
                width: 380,
                maxWidth: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 3,
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(6px)',
                boxShadow: '0 0 30px rgba(169, 169, 169, 0.3), 0 0 60px rgba(83, 63, 101, 0.32)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 0 30px rgba(162, 0, 255, 0.3), 0 0 60px rgba(134, 5, 248, 0.32)',
                }
              }}>
                {showRegister ? <Register setUser={setUser} /> : <Login setUser={setUser} />}

                <Box sx={{ textAlign: 'center', color: 'grey.400', mt: 0.5 }}>
                  {showRegister ? (
                    <>
                      Déjà inscrit ?&nbsp;
                      <Button
                        size="small"
                        onClick={() => setShowRegister(false)}
                        sx={{ color: 'secondary.main', fontWeight: 600, '&:hover': { backgroundColor: 'rgba(0, 180, 216, 0.1)' } }}
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
                        sx={{ color: 'secondary.main', fontWeight: 600, '&:hover': { backgroundColor: 'rgba(0, 180, 216, 0.1)' } }}
                      >
                        Sign up
                      </Button>
                    </>
                  )}
                </Box>
              </Card>
            </Box>
          )}

          <Box sx={{ mt: 3 }}>
            <IsConected user={user} setUser={setUser} />
          </Box>
        </Box>
      </ThemeProvider>
    </motion.div>
  );
}

export default Connection;
