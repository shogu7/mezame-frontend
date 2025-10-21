import React from 'react';

function IsConected({ user, setUser }) {
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (!user) return <div>Vous n'êtes pas connecté.</div>;

  return (
    <div>
      <p>Connecté en tant que : {user.username}</p>
      <p>Admin : {user.is_admin ? 'Oui' : 'Non'}</p>
      <button onClick={logout}>Se déconnecter</button>
    </div>
  );
}

export default IsConected;
