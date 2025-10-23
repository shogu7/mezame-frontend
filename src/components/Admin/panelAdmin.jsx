import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GoBackButton from '../../components/buttons/goBackButton.jsx';
// import jwtDecode from 'jwt-decode'; // get or not the page depend on "isAdmin" value
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
      const res = await axios.get(`${API_BASE}admin/users`, {
        headers: getAuthHeaders(),
      });
      const data = res.data && res.data.users ? res.data.users : [];
      setUsers(Array.isArray(data) ? data : []);
      console.log('users loaded', res.data);
    } catch (err) {
      console.error(err);
      setError('Impossible de récupérer les utilisateurs.');
    } finally {
      setLoading(false);
    }
  }

  async function toggleAdmin(userId, currentIsAdmin) {
    setActionLoading(userId);
    setError(null);
    try {
      const res = await axios.put(
        `${API_BASE}admin/toggle-admin/${userId}`,
        {},
        { headers: getAuthHeaders() }
      );
      const newIsAdmin = res.data && typeof res.data.is_admin === 'boolean'
        ? res.data.is_admin
        : !currentIsAdmin; 
      setUsers(u => u.map(x => (x.user_id === userId ? { ...x, is_admin: newIsAdmin } : x)));
    } catch (err) {
      console.error(err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setError('Non autorisé.');
      } else {
        setError('Action impossible (promotion/démotion).');
      }
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteUser(userId) {
    if (!window.confirm('Confirmer la suppression de cet utilisateur ?')) return;
    setActionLoading(userId);
    setError(null);
    try {
      const res = await axios.delete(`${API_BASE}admin/user/${userId}`, {
        headers: getAuthHeaders(),
      });
      if (res.status === 200 || res.status === 204 || (res.data && res.data.ok)) {
        setUsers(u => u.filter(x => x.user_id !== userId));
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      console.error(err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setError('Non autorisé.');
      } else {
        setError('Suppression impossible.');
      }
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
