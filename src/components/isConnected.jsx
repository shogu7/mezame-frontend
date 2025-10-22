import React from 'react';
import './user/styles/isConnected.css'
import ButtonToAdmin from '../components/Admin/buttonToAdmin'

function IsConected({ user, setUser }) {
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (!user) return <div className="is-connected"> Vous n'êtes pas connecté.</div>;

return (
    <div className="is-connected">
      <div className="user-row">
        <p>Connecté en tant que : <span className="username">{user.username}</span></p>
        <span className="admin">{user.is_admin ? 'Admin' : 'User'}</span>
      </div>
      <ButtonToAdmin />
      
      <button onClick={logout}>Se déconnecter</button>
    </div>
  );
}

export default IsConected;
