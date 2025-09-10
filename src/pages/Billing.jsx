import React, { useEffect, useState } from 'react';
import API from '../api';

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [userId, setUserId] = useState(null);
  const [generatedBill, setGeneratedBill] = useState(null);
  const [role, setRole] = useState(null);
  const [inputUserId, setInputUserId] = useState("");

  useEffect(() => {
    API.get('/auth/me').then(res => {
      const { id, role } = res.data;
      setUserId(id);
      setRole(role);

      if (role === 'ADMIN') {
        API.get('/billing/history').then(res => setBills(res.data));
      } else {
        API.get(`/billing/history/${id}`).then(res => setBills(res.data));
      }
    });
  }, []);

  const generateBill = () => {
    const idToGenerate = role === 'ADMIN' ? inputUserId : userId;
    if (!idToGenerate) {
      alert("Please enter a user ID");
      return;
    }

    API.post(`/billing/generate/${idToGenerate}`).then(res => {
      setGeneratedBill(res.data);
    });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  return (
    <div className="center-container">
      <div>
        <h2>💳 Billing History</h2>

        {role === 'ADMIN' && (
          <div>
            <input
              type="number"
              placeholder="Enter User ID"
              value={inputUserId}
              onChange={(e) => setInputUserId(e.target.value)}
            />
          </div>
        )}

        <button onClick={generateBill}>Generate Bill</button>

        {generatedBill && (
          <div style={{ marginTop: '1rem' }}>
            <h3>📄 Generated Bill</h3>
            <p><strong>Bill ID:</strong> {generatedBill.id}</p>
            <p><strong>Total:</strong> ₹{generatedBill.totalBill.toFixed(2)}</p>
            <p><strong>Date:</strong> {formatDate(generatedBill.generatedAt)}</p>
          </div>
        )}

        <ul>
          <ul>
            {bills.map((bill) => (
              <li key={bill.id}>
                🧾 User ID: {bill.userId} | ₹{bill.totalBill.toFixed(2)} - {formatDate(bill.generatedAt)}
              </li>
            ))}
          </ul>

        </ul>
      </div>
    </div>
  );
};

export default Billing;
