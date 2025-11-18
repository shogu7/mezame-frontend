import React from 'react';
import { Box, Button, Chip, Typography, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function IsConnected({ user, setUser }) {
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (!user) {
    return (
      <Box
        component="section"
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'transparent',
          color: 'grey.300',
        }}
      >
        <Typography variant="body2">Vous n'êtes pas connecté.</Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.25,
        p: 2,
        borderRadius: 2,
        width: '100%',
        maxWidth: 420,
        bgcolor: 'rgba(255,255,255,0.03)',
        border: '1px solid',
        borderColor: 'rgba(255,255,255,0.08)',
        color: 'common.white',
        backdropFilter: 'blur(6px)',
      }}
      aria-label="bloc compte connecté"
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'grey.400', display: 'block' }}>
            Connecté en tant que
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {user.username}
          </Typography>
        </Box>

        <Chip
          label={user.is_admin ? 'Admin' : 'Utilisateur'}
          size="small"
          sx={{
            fontWeight: 600,
            bgcolor: user.is_admin ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
            color: user.is_admin ? 'secondary.main' : 'grey.300',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {user.is_admin && (
          <Button
            component={RouterLink}
            to="/admin"
            variant="contained"
            size="small"
            sx={{
              textTransform: 'none',
              borderRadius: 1.5,
              px: 2,
              py: 0.6,
              bgcolor: 'secondary.main',
              color: 'common.black',
              '&:hover': { bgcolor: 'secondary.dark' },
              boxShadow: 'none',
            }}
          >
            Panel Admin
          </Button>
        )}

        <Button
          variant="outlined"
          size="small"
          onClick={logout}
          sx={{
            textTransform: 'none',
            borderRadius: 1.5,
            px: 2,
            py: 0.55,
            color: 'grey.200',
            borderColor: 'rgba(255,255,255,0.08)',
            '&:hover': { borderColor: 'rgba(255,255,255,0.14)' },
          }}
        >
          Se déconnecter
        </Button>

        <Box sx={{ ml: 'auto', color: 'grey.500', fontSize: 12 }} aria-hidden>
          {/* petit indicateur visuel facultatif */}
        </Box>
      </Box>
    </Paper>
  );
}
