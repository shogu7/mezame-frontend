import { useEffect, useState } from 'react';
import axios from 'axios';
import '../display/styles/currentUser.css'

const API_BASE = process.env.REACT_APP_API_BASE
  ? `${process.env.REACT_APP_API_BASE}/api/`
  : 'http://localhost:4000/api/';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE}user-manhwa`)
      .then(res => {
        if (res.data.ok) setUsers(res.data.users);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading">Loading...</p>;
  if (!users.length) return <p className="loading">No users found.</p>;

  return (
    <div className="users-list-container">
      <h2>All Users</h2>
      <ul className="users-list">
        {users.map(u => (
          <li key={u.user_id} className="user-item">
            <span className="username">{u.username}</span>
            <span className="email">{u.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}