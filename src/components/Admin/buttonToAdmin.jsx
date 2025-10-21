import React from 'react';
import { useNavigate } from 'react-router-dom';

function ButtonToAdmin() {
    const navigate = useNavigate();

    const goToAdmin = () => {
        navigate('/adminpanel');
    };

  return (
    <div>
      <h1>Admin Part </h1>
      <button onClick={goToAdmin} type="button">Admin Panel</button>
    </div>
  );
}

export default ButtonToAdmin;
