import React, { useEffect, useState } from 'react';
import API from '../api';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState({
    id: '',
    username: '',
    email: '',
    phone: '',
    role: 'CUSTOMER',
    planId: ''
  });

  const fetchUsers = () => {
    API.get('/users').then(res => setUsers(res.data));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = (id) => {
    API.delete(`/users/${id}`).then(fetchUsers);
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setForm(user);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    API.put('/users/update', form).then(() => {
      setEditingUser(null);
      setForm({ id: '', username: '', email: '', phone: '', role: 'CUSTOMER', planId: '' });
      fetchUsers();
    });
  };

  return (
    <div className="center-container">
    <div>
      <h2>🛠️ Admin Panel</h2>

      {editingUser && (
        <form onSubmit={handleSubmit}>
          <input placeholder="ID" value={form.id} disabled />
          <input
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="CUSTOMER">Customer</option>
            <option value="ADMIN">Admin</option>
          </select>
          <input
            placeholder="Plan ID"
            value={form.planId}
            onChange={(e) => setForm({ ...form, planId: e.target.value })}
          />
          <button type="submit">Update User</button>
        </form>
      )}

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} - {user.email} - {user.role}
            <button onClick={() => handleEdit(user)}>✏️</button>
            <button onClick={() => deleteUser(user.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default AdminPanel;
