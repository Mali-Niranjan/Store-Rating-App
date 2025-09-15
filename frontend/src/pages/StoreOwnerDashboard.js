import React, { useEffect, useState } from 'react';
import API from '../api/api';

export default function StoreOwnerDashboard(){
  const [data, setData] = useState([]);

  useEffect(()=>{ load(); }, []);

  const load = async () => {
    try {
      const res = await API.get('/stores/owner/dashboard');
      setData(res.data);
    } catch (err) { console.error(err); alert('Error loading owner data'); }
  };

  return (
    <div>
      <h2>Store Owner Dashboard</h2>
      {data.map(s => (
        <div key={s.storeId} style={{ border: '1px solid #ddd', marginBottom: 10, padding: 8 }}>
          <h3>{s.storeName} — Avg: {s.avgRating || '—'}</h3>
          <ul>
            {s.users.map(u => <li key={u.id}>{u.name} ({u.email}) — {u.rating}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}
