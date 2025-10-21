import { useEffect, useState } from 'react';
import axios from 'axios';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:4000/api/user-manhwa') 
      .then(res => {
        if (res.data.ok) setUsers(res.data.users);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!users.length) return <p>No users found.</p>;

  return (
    <div>
      <h2>All Users</h2>
      <ul>
        {users.map(u => (
          <li key={u.user_id}>
            <strong>{u.username}</strong> ({u.email})
          </li>
        ))}
      </ul>
    </div>
  );
}
