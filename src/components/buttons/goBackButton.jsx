import React from 'react';
import { useNavigate } from 'react-router-dom';

function GoBackButton() {
    const navigate = useNavigate();

    const goToAdmin = () => {
        navigate('/Accueil');
    };

  return (
    <div>
      <button onClick={goToAdmin} type="button"> Back </button>
    </div>
  );
}

export default GoBackButton;
