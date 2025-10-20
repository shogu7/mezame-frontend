import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', { identifier, password });
      setMessage(`Logged in! Token: ${res.data.token}`);
      localStorage.setItem('token', res.data.token);
      console.log({ identifier, password });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error');
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