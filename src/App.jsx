import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Plans from './pages/Plans';
import Usage from './pages/Usage';
import Billing from './pages/Billing';
import AdminPanel from './pages/AdminPanel';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();
  const location = useLocation();

  let role = null;
  let isAuthenticated = false;

  try {
    if (token) {
      const decoded = jwtDecode(token);
      console.log("Decoded JWT:", decoded);
      role = decoded.role || decoded.roles?.[0];
      console.log(" Extracted Role:", role);
      isAuthenticated = true;
    }
  } catch (err) {
    console.error(" Invalid token:", err.message);
    localStorage.removeItem('token');
  }

  return (
    <>
      {/* Show Admin Panel button only for ADMIN and not on login/register page */}
      {role === 'ADMIN' && location.pathname !== '/login' && location.pathname !== '/register' && (
        <div style={{ padding: '10px' }}>
          <button onClick={() => navigate("/admin")}>Admin Panel</button>
        </div>
      )}

      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/plans" element={isAuthenticated ? <Plans /> : <Navigate to="/login" />} />
        <Route path="/usage" element={isAuthenticated ? <Usage /> : <Navigate to="/login" />} />
        <Route path="/billing" element={isAuthenticated ? <Billing /> : <Navigate to="/login" />} />
        <Route path="/admin" element={role === 'ADMIN' ? <AdminPanel /> : <Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
};

export default App;
