import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Register({ setUser }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await axios.post('http://localhost:4000/api/auth/register', {
        username, email, password
      });
      setMessage({ type: 'success', text: `Compte créé ! ID: ${res.data.user_id}` });
      setUsername(''); 
      setEmail(''); 
      setPassword('');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Erreur' });
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
        bgcolor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(6px)',
        color: 'common.white',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5
      }}
    >
      <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: 600, color: 'secondary.main' }}>
        Créer un compte
      </Typography>

      <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <TextField
          label="Nom d'utilisateur"
          variant="outlined"
          fullWidth
          size="small"
          value={username}
          onChange={e => setUsername(e.target.value)}
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
        />

        <TextField
          label="Email"
          variant="outlined"
          type="email"
          fullWidth
          size="small"
          value={email}
          onChange={e => setEmail(e.target.value)}
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
          {loading ? <CircularProgress size={20} color="inherit" /> : 'S\'inscrire'}
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