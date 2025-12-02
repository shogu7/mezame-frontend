import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import PanelAdminTabs from '../tab/TabAdminPanel';

export default function AdminSection() {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAdmin(false);
      return;
    }

    try {
      const payload = jwtDecode(token);
      const adminFlag = payload?.is_admin === 1 || payload?.isAdmin === true || payload?.role === 'admin';
      setIsAdmin(Boolean(adminFlag));
    } catch (err) {
      console.error('Token invalide', err);
      setIsAdmin(false);
    }
  }, []);

  if (isAdmin === null) {
    return <div>Vérification du rôle administrateur…</div>;
  }

  if (!isAdmin) {
    return <div>Vous n'avez pas accès à cette section.</div>;
  }

  return <PanelAdminTabs />;
}
