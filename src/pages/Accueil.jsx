import React, { useEffect, useState } from 'react';
import Register from '../components/user/register.jsx';
import Login from '../components/user/login.jsx';
import ManhwaList from '../components/display/manhwa.jsx';
import CurrentUser from '../components/display/currentUser.jsx';
import ButtonToAdmin from '../components/Admin/buttonToAdmin.jsx';
import { jwtDecode } from 'jwt-decode';
import IsConected from '../components/isConnected.jsx';
import './styles/Acceuil.css';

function Accueil() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

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

          {!user && (
        <div className="forms-wrapper">
          <div className="form-stack">
            {showRegister ? <Register setUser={setUser} /> : <Login setUser={setUser} />}
            <div className="alt-action">
              {showRegister ? (
                <>
                  Déjà inscrit ?&nbsp;
                  <button type="button" className="alt-link" onClick={() => setShowRegister(false)}>
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Pas de compte ?&nbsp;
                  <button type="button" className="alt-link" onClick={() => setShowRegister(true)}>
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}


      <IsConected user={user} setUser={setUser} />

      {user && user.is_admin === 1 && <ButtonToAdmin />}

      <ManhwaList />
      <CurrentUser />
    </div>
  );
}

export default Accueil;
