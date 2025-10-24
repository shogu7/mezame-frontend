import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import theme from '../theme';
import Register from '../components/user/register.jsx';
import Login from '../components/user/login.jsx';
import ManhwaList from '../components/display/manhwa.jsx';
import CurrentUser from '../components/display/currentUser.jsx';
import { jwtDecode } from 'jwt-decode';
import IsConected from '../components/isConnected.jsx';

function Accueil() {
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ maxWidth: { xs: 300, sm: 600, md: 900 }, mx: 'auto' }}>
        <Typography variant="h4" align="center" sx={{ mt: 4, mb: 2, fontWeight: 700 }}>
          Mezame Frontend
        </Typography>

        {!user && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <Card sx={{ width: 380, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {showRegister ? <Register setUser={setUser} /> : <Login setUser={setUser} />}

              <Box sx={{ textAlign: 'center', color: 'text.secondary', mt: 0.5 }}>
                {showRegister ? (
                  <>
                    Déjà inscrit ?&nbsp;
                    <Button size="small" onClick={() => setShowRegister(false)}>Sign in</Button>
                  </>
                ) : (
                  <>
                    Pas de compte ?&nbsp;
                    <Button size="small" onClick={() => setShowRegister(true)}>Sign up</Button>
                  </>
                )}
              </Box>
            </Card>
          </Box>
        )}

        <IsConected user={user} setUser={setUser} />

        <Box sx={{ mt: 3 }}>
          <ManhwaList />
        </Box>

        <Box sx={{ mt: 2 }}>
          <CurrentUser />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Accueil;
