import React, { useEffect, useState } from 'react';
import PanelAdmin from './panelAdmin.jsx'
import { jwtDecode } from 'jwt-decode';

function AdminSection() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = jwtDecode(token);
        setIsAdmin(payload.is_admin === 1 || payload.isAdmin === true);
      } catch (err) {
        console.error('Token invalide', err);
        setIsAdmin(false);
      }
    }
  }, []);

  if (!isAdmin) {
    return <div>Vous n'avez pas accès à cette section.</div>;
  }

return <PanelAdmin />; // if its ok then load panel admin

}

export default AdminSection;