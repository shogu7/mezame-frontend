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
      color="primary"
      sx={{
        textTransform: 'none',
        borderRadius: 2,
        px: 2,
        py: 0.5,
      }}
    >
      {children || 'Go back'}
    </Button>
  );
}