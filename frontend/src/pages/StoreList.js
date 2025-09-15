import React, { useEffect, useState } from 'react';
import API from '../api/api';
import StoreCard from '../components/StoreCard';

export default function StoreList(){
  const [stores,setStores]=useState([]);
  const [q,setQ]=useState('');
  const [loading,setLoading]=useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await API.get('/stores', { params: { q } });
      setStores(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ load(); }, []);

  const onSearch = () => load();

  const onRated = (storeId, r) => {
    setStores(prev => prev.map(s => s.id===storeId ? { ...s, myRating: r } : s));
  };

  return (
    <div>
      <h2>Stores</h2>
      <div>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name or address" />
        <button onClick={onSearch}>Search</button>
      </div>
      {loading ? <div>Loading...</div> : stores.map(s => <StoreCard key={s.id} store={s} onRated={onRated} />)}
    </div>
  );
}
