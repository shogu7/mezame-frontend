import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
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
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" align="center" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
        Créer un compte
      </Typography>

      <Box component="form" onSubmit={handleRegister}>
        <TextField
          label="Nom d'utilisateur"
          variant="outlined"
          fullWidth
          size="small"
          value={username}
          onChange={e => setUsername(e.target.value)}
          sx={{ mb: 1.5 }}
        />

        <TextField
          label="Email"
          variant="outlined"
          type="email"
          fullWidth
          size="small"
          value={email}
          onChange={e => setEmail(e.target.value)}
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
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(s => !s)}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </InputAdornment>
            )
          }}
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
          {loading ? <CircularProgress size={20} color="inherit" /> : 'S\'inscrire'}
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