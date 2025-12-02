import React from 'react';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Button
      variant="outlined"
      startIcon={<ArrowBackIcon />}
      onClick={handleBack}
      sx={{
        textTransform: 'none',
        color: 'text.primary',
        borderColor: 'rgba(255,255,255,0.2)',
        '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(0,0,0,0.04)' },
        mb: 3,
      }}
    >
      Back
    </Button>
  );
}

// change icm, same logic for 2 buttons, ill fusion it in an single component.