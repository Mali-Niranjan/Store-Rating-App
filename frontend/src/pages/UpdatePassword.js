import React, { useState } from 'react';
import API from '../api/api';

export default function UpdatePassword(){
  const [password,setPassword]=useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.put('/users/me/password', { password });
      alert('Password updated');
    } catch (err) { alert(err?.response?.data?.message || 'Error'); }
  };

  return (
    <form onSubmit={submit}>
      <h2>Update Password</h2>
      <div><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="New password" /></div>
      <button type="submit">Update</button>
    </form>
  );
}
