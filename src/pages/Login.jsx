import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { username, password });

     
      localStorage.setItem('token', res.data);
      setToken(res.data);

      
      navigate('/dashboard');
    } catch (err) {
      alert('Invalid credentials');
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="center-container">
      <form onSubmit={handleLogin}>
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
