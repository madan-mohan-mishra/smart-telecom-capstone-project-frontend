import React, { useEffect, useState } from 'react';
import API from '../api';
import { jwtDecode } from 'jwt-decode';

const Usage = () => {
  const [logs, setLogs] = useState([]);
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      const userRole = decoded.role || decoded.roles?.[0];
      setRole(userRole);

      
      API.get('/auth/me').then(res => {
        const id = res.data.id;

        if (userRole === 'ADMIN') {
          API.get('/usage').then(res => setLogs(res.data));
        } else {
          API.get(`/usage/${id}`).then(res => setLogs(res.data));
        }
      });
    }
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="center-container">
      <div>
        <h2>📊 Usage Logs</h2>
        <ul>
          {logs.map((log, idx) => (
            <li key={idx}>
              {role === 'ADMIN' && <b>User ID: {log.userId} | </b>}
              {formatDate(log.timestamp)} - 
              📶 {log.dataUsed.toFixed(2)}MB, 📞 {log.callDuration}s, ✉️ {log.smsCount}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Usage;
