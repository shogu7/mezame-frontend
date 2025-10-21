import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GoBackButton from '../../components/buttons/goBackButton.jsx'
import jwtDecode from 'jwt-decode'; // get or not the page depend on "isAdmin" value
import './styles/panelAdmin.css';

const API_BASE = 'http://localhost:4000/api/';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export default function PanelAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:4000/api/user-manhwa')
      const data = await res.data.users;
      setUsers(Array.isArray(data) ? data : []);
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setError('Error to reach users.');
    } finally {
      setLoading(false);
    }
  }

  async function toggleAdmin(userId, currentIsAdmin) {
    setActionLoading(userId);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/user-manhwa/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_admin: !currentIsAdmin }),
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) throw new Error('Non autorisé');
        throw new Error(`Erreur: ${res.status}`);
      }
      setUsers(u => u.map(x => (x.user_id === userId ? { ...x, is_admin: !currentIsAdmin } : x)));
    } catch (err) {
      console.error(err);
      setError('Action impossible (promotion/démotion).');
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteUser(userId) {
    if (!window.confirm('Confirmer la suppression de cet utilisateur ?')) return;
    setActionLoading(userId);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/user-manhwa/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) throw new Error('Non autorisé');
        throw new Error(`Erreur: ${res.status}`);
      }
      setUsers(u => u.filter(x => x.user_id !== userId));
    } catch (err) {
      console.error(err);
      setError('Suppression impossible.');
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="wrapper">
      <h2 className="title">Panel Admin</h2>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div>Chargement...</div>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5">Aucun utilisateur trouvé.</td>
                </tr>
              ) : (
                users.map((u, idx) => (
                  <tr key={u.user_id}>
                    <td>{idx + 1}</td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.is_admin ? 'Oui' : 'Non'}</td>
                    <td>
                      <button
                        className="btn"
                        onClick={() => toggleAdmin(u.user_id, !!u.is_admin)}
                        disabled={actionLoading === u.user_id}
                      >
                        {actionLoading === u.user_id
                          ? '...'
                          : u.is_admin
                          ? 'Retirer admin'
                          : 'Promouvoir admin'}
                      </button>
                      <button
                        className="btn danger"
                        onClick={() => deleteUser(u.user_id)}
                        disabled={actionLoading === u.user_id}
                      >
                        {actionLoading === u.user_id ? '...' : 'Supprimer'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="footer">
            <button className="btnSecondary" onClick={loadUsers}>
              Rafraîchir
            </button>
          </div>
        </>
      )}
      <GoBackButton />
    </div>
  );
}
