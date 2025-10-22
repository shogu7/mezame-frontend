import { useState } from 'react';
import axios from 'axios';
import './styles/log_sign.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/auth/register', {
        username, email, password
      });
      setMessage(`User created! ID: ${res.data.user_id}`);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error');
    }
  };

  return (
    <form className="form-container" onSubmit={handleRegister}>
      <h2>Register</h2>
      <input 
        placeholder="Username" 
        value={username} 
        onChange={e => setUsername(e.target.value)} 
      />
      <input 
        placeholder="Email" 
        type="email" 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
      />
      <input 
        placeholder="Password" 
        type="password" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
      />
      <button type="submit">Register</button>
      <p>{message}</p>
    </form>
  );
}
