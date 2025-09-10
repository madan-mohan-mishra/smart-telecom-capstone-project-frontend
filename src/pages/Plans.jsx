import React, { useEffect, useState } from 'react';
import API from '../api';
import { jwtDecode } from 'jwt-decode';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [userPlan, setUserPlan] = useState(null);
  const [newPlan, setNewPlan] = useState({ name: '', price: '', validity: '', features: '', type: '' });
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      const userRole = decoded.role || decoded.roles?.[0];
      setRole(userRole);

      //  Get user ID from /auth/me since it's not in token
      API.get('/auth/me').then(res => {
        setUserId(res.data.id);
      });
    }

   
    API.get('/plans').then(res => setPlans(res.data));
  }, []);

  useEffect(() => {
    if (role === 'CUSTOMER' && userId) {
      API.get(`/users/plan-usage/${userId}`).then(res => {
        setUserPlan(res.data.plan);
      });
    }
  }, [role, userId]);

  const fetchPlans = () => {
    API.get('/plans').then(res => setPlans(res.data));
  };

  const addPlan = () => {
    API.post('/plans', newPlan).then(() => {
      fetchPlans();
      setNewPlan({ name: '', price: '', validity: '', features: '', type: '' });
    });
  };

  const deletePlan = (id) => {
    API.delete(`/plans/${id}`).then(fetchPlans);
  };

  const updatePlan = (planId) => {
    if (!userId) return;
    API.put(`/users/${userId}/plan/${planId}`)
      .then(() => {
        alert(' Plan updated successfully!');
        API.get(`/users/plan-usage/${userId}`).then(res => {
          setUserPlan(res.data.plan); // refresh subscribed plan
        });
      })
      .catch(() => alert(' Failed to update plan'));
  };

  return (
    <div className="center-container">
      <div>
        <h2>📱 Available Plans</h2>

       
      

        <ul>
          {plans.map(plan => (
            <li key={plan.id}>
              <b>Plan ID: {plan.id}</b> - {plan.name} - ₹{plan.price} ({plan.validity} days)<br />
              {plan.features}
              {role === 'ADMIN' && (
                <button onClick={() => deletePlan(plan.id)}>❌</button>
              )}
              {role === 'CUSTOMER' && userPlan?.id !== plan.id && (
                <button onClick={() => updatePlan(plan.id)}>📥 Subscribe</button>
              )}
              {role === 'CUSTOMER' && userPlan?.id === plan.id && (
                <button disabled>✔️ Subscribed</button>
              )}
            </li>
          ))}
        </ul>

      
        {role === 'ADMIN' && (
          <>
            <h4>Add Plan (Admin)</h4>
            <input placeholder="Name" value={newPlan.name} onChange={e => setNewPlan({ ...newPlan, name: e.target.value })} />
            <input placeholder="Price" value={newPlan.price} onChange={e => setNewPlan({ ...newPlan, price: e.target.value })} />
            <input placeholder="Validity" value={newPlan.validity} onChange={e => setNewPlan({ ...newPlan, validity: e.target.value })} />
            <input placeholder="Features" value={newPlan.features} onChange={e => setNewPlan({ ...newPlan, features: e.target.value })} />
            <input placeholder="Type" value={newPlan.type} onChange={e => setNewPlan({ ...newPlan, type: e.target.value })} />
            <button onClick={addPlan}>➕ Add</button>
          </>
        )}
          {role === 'CUSTOMER' && userPlan && (
          <div style={{ marginBottom: '1rem' }}>
            <h4>✅ Subscribed Plan</h4>
            <p><strong>Plan ID:</strong> {userPlan.id}</p>
            <p><strong>{userPlan.name}</strong> - ₹{userPlan.price} ({userPlan.validity} days)</p>
            <p>{userPlan.features}</p>
            <p>Type: {userPlan.type}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Plans;
