import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../shared/context/authContext';
import axios from 'axios';
import {
  Box,
  TextField,
  Typography,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Login() {
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', { identifier, password });
      
      console.log('✅ Login success, token:', res.data.token);
      
      // Utiliser loginWithToken du contexte pour mettre à jour user
      loginWithToken(res.data.token);
      
      setMessage({ type: 'success', text: `Connexion réussie !` });
      
      // Rediriger vers la page d'origine ou vers home
      const from = location.state?.from || '/';
      console.log('🚀 Redirecting to:', from);
      
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
      
    } catch (err) {
      console.error('❌ Login error:', err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur de connexion' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        maxWidth: 400,
        margin: '0 auto',
        bgcolor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(6px)',
        color: 'common.white',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5
      }}
    >
      <Typography variant="h6" align="center" sx={{ fontWeight: 600, color: 'secondary.main' }}>
        Connexion
      </Typography>

      <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <TextField
          label="Email ou pseudo"
          variant="outlined"
          fullWidth
          size="small"
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
          sx={{
            '& .MuiInputLabel-root': { color: 'grey.400' },
            '& .MuiInputLabel-root.Mui-focused': { color: 'secondary.main' },
            '& .MuiOutlinedInput-root': {
              color: 'common.white',
              backgroundColor: 'rgba(255,255,255,0.05)',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.05)' },
              '&:hover fieldset': { borderColor: 'secondary.main' },
              '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
              borderRadius: 1.5
            }
          }}
        />

        <TextField
          label="Mot de passe"
          variant="outlined"
          fullWidth
          size="small"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          sx={{
            '& .MuiInputLabel-root': { color: 'grey.400' },
            '& .MuiInputLabel-root.Mui-focused': { color: 'secondary.main' },
            '& .MuiOutlinedInput-root': {
              color: 'common.white',
              backgroundColor: 'rgba(255,255,255,0.05)',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
              '&:hover fieldset': { borderColor: 'secondary.main' },
              '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
              borderRadius: 1.5
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(s => !s)}
                  edge="end"
                  size="small"
                  sx={{ color: 'secondary.main' }}
                >
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            py: 0.8,
            borderRadius: 1.5,
            backgroundColor: 'secondary.main',
            color: 'common.black',
            fontWeight: 600,
            '&:hover': { backgroundColor: 'secondary.dark', boxShadow: '0 4px 12px rgba(0,180,216,0.4)' },
            '&:disabled': { backgroundColor: 'rgba(0,180,216,0.3)', color: 'rgba(255,255,255,0.5)' },
            transition: 'all 0.3s ease'
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Se connecter'}
        </Button>

        {message && (
          <Alert severity={message.type} sx={{ mt: 1, py: 0.5, bgcolor: 'rgba(255,255,255,0.05)', color: 'common.white', borderColor: 'rgba(255,255,255,0.08)' }}>
            {message.text}
          </Alert>
        )}
      </Box>
    </Paper>
  );
}