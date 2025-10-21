// Accueil.jsx
import React, { useEffect, useState } from 'react';
import Register from '../components/user/register.jsx';
import Login from '../components/user/login.jsx';
import ManhwaList from '../components/display/manhwa.jsx';
import CurrentUser from '../components/display/currentUser.jsx';
import ButtonToAdmin from '../components/Admin/buttonToAdmin.jsx';
import { jwtDecode } from 'jwt-decode';
import IsConected from '../components/isConnected.jsx';

function Accueil() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = jwtDecode(token);
        setUser(payload);
      } catch {
        setUser(null);
      }
    }
  }, []);

  return (
    <div>
      <h1>Mezame Frontend</h1>

      <IsConected user={user} setUser={setUser} />

      {!user && (
        <>
          <Register setUser={setUser} />
          <Login setUser={setUser} />
        </>
      )}

      {user && user.is_admin === 1 && <ButtonToAdmin />}

      <ManhwaList />
      <CurrentUser />
    </div>
  );
}

export default Accueil;
