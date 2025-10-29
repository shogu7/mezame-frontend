import React from 'react';
import './user/styles/isConnected.css';
import { Box, Button, Chip, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function IsConected({ user, setUser }) {
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (!user) {
    return <div className="is-connected"> Vous n'êtes pas connecté.</div>;
  }

  return (
    <div className="is-connected">
      <div className="user-row">
        <Typography component="p" sx={{ m: 0 }}>
          Connecté en tant que : <span className="username">{user.username}</span>
        </Typography>

        <Chip
          label={user.is_admin ? 'Admin' : 'User'}
          color={user.is_admin ? 'primary' : 'default'}
          size="small"
          className="admin"
        />
      </div>
      
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
        {user.is_admin && (
          <Button
            component={RouterLink}
            to="/adminpanel"
            variant="contained"
            color="primary"
            size="small"
            className="button-to-admin"
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 2,
              py: 0.5,
            }}
          >
            Panel Admin
          </Button>
        )}

        <Button
          variant="outlined"
          color="primary"
          onClick={logout}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Se déconnecter
        </Button>
      </Box>
    </div>
  );
}

export default IsConected;