import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export default function Login({ setUser }) { // gettin instance of the user 
  const [identifier, setIdentifier] = useState(''); // defined as email or username
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // state to show or not the password

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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        {/* email/username part */}
        <input
          placeholder="Email or Username"
          type="text"
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
        />
        {/* password part */}
        <input
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          /> Show Password
        </label>
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}