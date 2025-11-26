import React from 'react';
import { Box, Button, Chip, Typography, Paper, Avatar, Divider, Fade } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import VerifiedIcon from '@mui/icons-material/Verified';

export default function IsConnected({ user, setUser }) {
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (!user) {
    return (
      <Fade in timeout={600}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            maxWidth: 480,
            mx: 'auto',
            bgcolor: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
            textAlign: 'center',
          }}
        >
          <PersonIcon sx={{ fontSize: 48, color: 'grey.600', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'grey.300', mb: 1 }}>
            Non connecté
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.500' }}>
            Connectez-vous pour accéder à votre compte
          </Typography>
        </Paper>
      </Fade>
    );
  }

  return (
    <Fade in timeout={600}>
      <Paper
        elevation={0}
        sx={{
          maxWidth: 480,
          mx: 'auto',
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'rgba(255,255,255,0.15)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          },
        }}
        aria-label="Informations du compte"
      >
        <Box
          sx={{
            background: user.is_admin
              ? 'linear-gradient(135deg, rgba(39, 176, 176, 0.3) 0%, rgba(39, 176, 176, 0.3) 100%)'
              : 'linear-gradient(135deg, rgba(33, 150, 243, 0.15) 0%, rrgba(39, 176, 176, 0.3) 100%)',
            p: 3,
            pb: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              transform: 'translate(30%, -30%)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, position: 'relative', zIndex: 1 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: user.is_admin ? 'secondary.main' : 'primary.main',
                fontSize: 28,
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
              }}
            >
              {user.username.charAt(0).toUpperCase()}
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'common.white' }}>
                  {user.username}
                </Typography>
                {user.is_admin && (
                  <VerifiedIcon sx={{ fontSize: 20, color: 'secondary.main' }} />
                )}
              </Box>

              <Chip
                icon={user.is_admin ? <AdminPanelSettingsIcon sx={{ fontSize: 16 }} /> : undefined}
                label={user.is_admin ? 'Administrateur' : 'Utilisateur'}
                size="small"
                sx={{
                  height: 24,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  bgcolor: user.is_admin ? 'rgba(39, 176, 176, 0.3)' : 'rgba(255,255,255,0.1)',
                  color: user.is_admin ? 'secondary.light' : 'grey.200',
                  border: '1px solid',
                  borderColor: user.is_admin ? 'rgba(39, 174, 176, 0.3)' : 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(8px)',
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Contenu principal */}
        <Box sx={{ p: 3 }}>
          <Typography variant="caption" sx={{ color: 'grey.500', textTransform: 'uppercase', letterSpacing: 1 }}>
            Actions rapides
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
            {user.is_admin && (
              <Button
                component={RouterLink}
                to="/admin"
                variant="contained"
                fullWidth
                startIcon={<AdminPanelSettingsIcon />}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  py: 1.25,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  bgcolor: 'secondary.main',
                  color: 'common.black',
                  boxShadow: '0 4px 12px rgba(39, 167, 176, 0.3)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'secondary.dark',
                    boxShadow: '0 6px 16px rgba(39, 158, 176, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Panel d'administration
              </Button>
            )}

            <Button
              variant="outlined"
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={logout}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                py: 1.25,
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'grey.200',
                borderColor: 'rgba(255,255,255,0.12)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.25)',
                  bgcolor: 'rgba(255,255,255,0.05)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Se déconnecter
            </Button>
          </Box>

          <Divider sx={{ my: 2.5, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'grey.500', display: 'block' }}>
                Dernière connexion
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.300', fontWeight: 500 }}>
                Aujourd'hui
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" sx={{ color: 'grey.500', display: 'block' }}>
                Statut
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: '#4caf50',
                    boxShadow: '0 0 8px rgba(76, 175, 80, 0.6)',
                  }}
                />
                <Typography variant="body2" sx={{ color: 'grey.300', fontWeight: 500 }}>
                  Actif
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Fade>
  );
}