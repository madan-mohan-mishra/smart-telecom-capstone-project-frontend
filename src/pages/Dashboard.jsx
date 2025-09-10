import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => (
  <div className="center-container">
  <div>
    <h2>Dashboard</h2>
    <ul>
      <li><Link to="/profile">Profile</Link></li>
      <li><Link to="/plans">Plans</Link></li>
      <li><Link to="/usage">Usage</Link></li>
      <li><Link to="/billing">Billing</Link></li>
      <li><Link to="/admin">Admin Panel</Link></li>
    </ul>
  </div>
  </div>
);
export default Dashboard;