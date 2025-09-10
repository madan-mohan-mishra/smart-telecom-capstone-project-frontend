import React, { useEffect, useState } from 'react';
import API from '../api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    API.get('/auth/me').then(res => {
      const userId = res.data.id;
      API.get(`/users/${userId}`).then(res => setUser(res.data));
    });
  }, []);

  const handleUpdate = () => {
    API.put('/users/update', user).then(() => {
      alert('Updated!');
      setEditing(false);
    });
  };

  return user ? (
    <div className="center-container">
      <h2>👤 Profile</h2>
      {editing ? (
        <>
          <input value={user.username} onChange={e => setUser({ ...user, username: e.target.value })} />
          <input value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} />
          <input value={user.phone} onChange={e => setUser({ ...user, phone: e.target.value })} />
          <button onClick={handleUpdate}>Save</button>
        </>
      ) : (
        <>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          <p>Role: {user.role}</p>
          <button onClick={() => setEditing(true)}>Edit</button>
        </>
      )}
    </div>
  ) : (
    <div className="center-container"><p>Loading...</p></div>
  );
};

export default Profile;
