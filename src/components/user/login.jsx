import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import {
  Box,
  TextField,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress
} from '@mui/material';

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
          sx={{ mb: 1.5 }}
        />

        <TextField
          label="Mot de passe"
          variant="outlined"
          fullWidth
          size="small"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          sx={{ mb: 1 }}
        />

        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={showPassword}
              onChange={() => setShowPassword(s => !s)}
            />
          }
          label={<Typography variant="body2">Afficher le mot de passe</Typography>}
          sx={{ mb: 1.5, ml: 0 }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ py: 1, borderRadius: 2, mb: 1 }}
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