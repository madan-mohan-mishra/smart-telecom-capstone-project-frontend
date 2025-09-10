import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [user, setUser] = useState({
    id: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    role: 'CUSTOMER',
    planId: ''
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/auth/register', {
      ...user,
      id: parseInt(user.id),
      planId: parseInt(user.planId)
    });
    alert('Registered!');
    navigate('/login');
  };

  return (
    <div className="center-container">
    <form onSubmit={handleSubmit}>
      <input placeholder="ID" value={user.id} onChange={e => setUser({ ...user, id: e.target.value })} />
      <input placeholder="Username" value={user.username} onChange={e => setUser({ ...user, username: e.target.value })} />
      <input placeholder="Email" value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} />
      <input placeholder="Phone" value={user.phone} onChange={e => setUser({ ...user, phone: e.target.value })} />
      <input placeholder="Password" type="password" value={user.password} onChange={e => setUser({ ...user, password: e.target.value })} />
      <select value={user.role} onChange={e => setUser({ ...user, role: e.target.value })}>
        <option value="CUSTOMER">Customer</option>
        <option value="ADMIN">Admin</option>
      </select>
      <input placeholder="Plan ID" value={user.planId} onChange={e => setUser({ ...user, planId: e.target.value })} />
      <button type="submit">Register</button>
    </form>
    </div>
  );
};

export default Register;
