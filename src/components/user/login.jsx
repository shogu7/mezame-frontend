import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress
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
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        bgcolor: 'background.default'
      }}
    >
      <Card sx={{ width: { xs: '100%', sm: 420 }, borderRadius: 3, boxShadow: 6 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" align="center" color="primary" gutterBottom>
            Connexion
          </Typography>

          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
            <TextField
              label="Email ou pseudo"
              variant="outlined"
              fullWidth
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'background.paper' }
              }}
            />

            <TextField
              label="Mot de passe"
              variant="outlined"
              fullWidth
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'background.paper' }
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={showPassword}
                  onChange={() => setShowPassword(s => !s)}
                />
              }
              label="Afficher le mot de passe"
              sx={{ mb: 2, color: 'text.secondary' }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ py: 1.4, borderRadius: 2 }}
            >
              {loading ? <CircularProgress size={20} /> : 'Se connecter'}
            </Button>

            {message && (
              <Alert severity={message.type} sx={{ mt: 2 }}>
                {message.text}
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}