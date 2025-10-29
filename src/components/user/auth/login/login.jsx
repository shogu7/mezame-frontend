import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import {
  Box,
  TextField,
  Typography,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Login({ setUser }) {
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
      localStorage.setItem('token', res.data.token);
      const payload = jwtDecode(res.data.token);
      setUser(payload);
      setMessage({ type: 'success', text: `Connecté en tant que ${payload.username}` });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" align="center" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
        Connexion
      </Typography>

      <Box component="form" onSubmit={handleLogin}>
        <TextField
          label="Email ou pseudo"
          variant="outlined"
          fullWidth
          size="small"
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
          sx={{ 
            mb: 1.5,
            '& .MuiInputLabel-root': { color: '#a8dadc' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#00b4d8' },
            '& .MuiOutlinedInput-root': {
              color: '#ffffff',
              '& fieldset': { borderColor: 'rgba(168, 218, 220, 0.3)' },
              '&:hover fieldset': { borderColor: '#a8dadc' },
              '&.Mui-focused fieldset': { borderColor: '#00b4d8' }
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
            mb: 1,
            '& .MuiInputLabel-root': { color: '#a8dadc' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#00b4d8' },
            '& .MuiOutlinedInput-root': {
              color: '#ffffff',
              '& fieldset': { borderColor: 'rgba(168, 218, 220, 0.3)' },
              '&:hover fieldset': { borderColor: '#a8dadc' },
              '&.Mui-focused fieldset': { borderColor: '#00b4d8' }
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(s => !s)}
                  edge="end"
                  size="small"
                  sx={{ color: '#a8dadc' }}
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
            py: 1, 
            borderRadius: 2, 
            mb: 1,
            backgroundColor: '#00b4d8',
            color: '#ffffff',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#0096c7',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0, 180, 216, 0.4)'
            },
            '&:disabled': {
              backgroundColor: 'rgba(0, 180, 216, 0.3)',
              color: 'rgba(255, 255, 255, 0.5)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Se connecter'}
        </Button>

        {message && (
          <Alert severity={message.type} sx={{ mt: 1, py: 0.5 }}>
            {message.text}
          </Alert>
        )}
      </Box>
    </Box>
  );
}