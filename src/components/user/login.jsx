import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './styles/log_sign.css';

export default function Login({ setUser }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', { identifier, password });
      localStorage.setItem('token', res.data.token);
      const payload = jwtDecode(res.data.token);
      setUser(payload);
      setMessage(`Connecté en tant que ${payload.username}`);
    } catch (err) {
      console.error(err.response);
      setMessage(err.response?.data?.message || 'Erreur');
    }
  };

  return (
    <form className="form-container" onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        placeholder="Email or Username"
        type="text"
        value={identifier}
        onChange={e => setIdentifier(e.target.value)}
      />
      <input
        placeholder="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <label className="show-password">
        <input
          type="checkbox"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
        />
        <span className="slider"></span>
        Show Password
      </label>
      <button type="submit">Login</button>
      <p>{message}</p>
    </form>
  );
}
