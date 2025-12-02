import React from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/context/authContext';

import { useProfileEdit } from './hooks/useProfileEdit'; 
import ProfileFormUI from './components/ProfileFormUI'; 

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading } = useAuth(); 
  
  const {
    loading: hookLoading,
    error,
    successOpen,
    setSuccessOpen,
    ...uiProps 
  } = useProfileEdit(authUser);
  
  if (authLoading) return (
    <Box sx={{ 
      display:'flex', 
      justifyContent:'center', 
      alignItems: 'center',
      minHeight: '100vh',
      bgcolor: '#000'
    }}>
      <CircularProgress sx={{ color: '#fff' }} />
    </Box>
  );

  if (hookLoading) return (
    <Box sx={{ 
      display:'flex', 
      justifyContent:'center', 
      alignItems: 'center',
      minHeight: '100vh',
      bgcolor: '#000'
    }}>
      <CircularProgress sx={{ color: '#fff' }} />
    </Box>
  );

  if (!authUser) return (
    <Box sx={{ 
      maxWidth: 400, 
      mx:'auto', 
      mt: 8, 
      px: 2, 
      color: '#fff', 
      bgcolor: '#000', 
      minHeight: '100vh' 
    }}>
      <Typography variant="h6" textAlign="center" mb={3} sx={{ fontWeight: 300 }}>
        You need to be logged in
      </Typography>
      <Button 
        fullWidth
        variant="contained" 
        onClick={() => navigate('/login')}
        sx={{ 
          bgcolor: '#fff', 
          color: '#000',
          py: 1.5,
          fontWeight: 500,
          '&:hover': { bgcolor: '#e0e0e0' }
        }}
      >
        Go to Login
      </Button>
    </Box>
  );

  return (
    <Box sx={{ 
      bgcolor: '#000', 
      minHeight: '100vh', 
      display: 'flex',
      alignItems: 'center',
      py: 6 
    }}>
      <ProfileFormUI
        error={error} 
        {...uiProps}
      />

      <Snackbar 
        open={successOpen} 
        autoHideDuration={3000} 
        onClose={() => setSuccessOpen(false)} 
        anchorOrigin={{ vertical:'bottom', horizontal:'center' }}
      >
        <Alert 
          onClose={() => setSuccessOpen(false)} 
          severity="success" 
          sx={{ 
            width:'100%', 
            bgcolor: '#fff',
            color: '#000',
            borderRadius: 1,
            '& .MuiAlert-icon': { color: '#2e7d32' }
          }}
        >
          Profile updated successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}