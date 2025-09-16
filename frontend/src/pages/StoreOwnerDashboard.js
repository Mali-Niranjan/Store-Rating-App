import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import "../styles/Dashboard.css"; // optional: keep styling consistent

export default function StoreOwnerDashboard() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  // Fetch owner dashboard data
  const load = async () => {
    try {
      const res = await API.get('/stores/owner/dashboard');
      setData(res.data || []);
    } catch (err) {
      console.error(err);
      alert('Error loading owner data');
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="dashboard-page">
      <header className="dash-header">
        <h2>Store Owner Dashboard</h2>
        <div>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </header>

      {data.length === 0 && <p>No store data available.</p>}

      {data.map(s => (
        <div key={s.storeId} className="panel" style={{ marginBottom: 10 }}>
          <h3>{s.storeName} — Avg: {s.avgRating || '—'}</h3>
          <ul>
            {s.users.map(u => (
              <li key={u.id}>
                {u.name} ({u.email}) — {u.rating}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
