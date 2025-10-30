import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function GoBackButton({ to, children }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
    else navigate(-1);
  };

  return (
  <Button
    onClick={handleClick}
    variant="outlined"
    startIcon={<ArrowBackIcon />}
    sx={{
      textTransform: 'none',
      borderRadius: 2,
      px: 2,
      py: 0.5,
      color: '#9C27B0',       
      borderColor: 'rgba(168,218,220,0.3)', 
      '&:hover': {
        backgroundColor: 'rgba(59, 46, 61, 0.1)',
        borderColor: '#7c25afff',
      }
    }}
  >
    {children || 'Go back'}
  </Button>
  );
}