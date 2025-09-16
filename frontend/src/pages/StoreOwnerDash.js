import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

export default function StoreOwnerDash() {
  const { user, logout, getData, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(getData());
  const [editingPass, setEditingPass] = useState(false);
  const [newPass, setNewPass] = useState("");

  useEffect(()=> setData(getData()), []);

  const stores = data.stores || [];
  const ratings = data.ratings || [];
  const myStore = stores.find(s => s.ownerId === user.id);

  const myRatings = myStore ? ratings.filter(r => r.storeId === myStore.id) : [];

  const avg = myRatings.length ? (myRatings.reduce((a,b)=>a+b.rating,0)/myRatings.length).toFixed(2) : "—";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChangePass = (ev) => {
    ev.preventDefault();
    if (newPass.length < 4) return alert("Password too short");
    updatePassword(user.id, newPass);
    alert("Password updated");
    setEditingPass(false);
  };

  return (
    <div className="dashboard-page">
      <header className="dash-header">
        <h2>Store Owner Dashboard</h2>
        <div>
          <button onClick={() => setEditingPass(true)}>Change Password</button>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <section className="panel">
        <h3>My Store</h3>
        {myStore ? (
          <>
            <p><strong>Name:</strong> {myStore.name}</p>
            <p><strong>Address:</strong> {myStore.address}</p>
            <p><strong>Average Rating:</strong> {avg}</p>
          </>
        ) : <p>No store assigned to you. Ask admin to assign.</p>}
      </section>

      <section className="panel">
        <h3>Ratings</h3>
        {myRatings.length ? (
          <table className="simple-table">
            <thead><tr><th>User</th><th>Rating</th></tr></thead>
            <tbody>
              {myRatings.map(r => {
                const u = data.users.find(x => x.id === r.userId);
                return <tr key={`${r.userId}-${r.storeId}`}><td>{u?.name ?? r.userId}</td><td>{r.rating}</td></tr>;
              })}
            </tbody>
          </table>
        ) : <p>No ratings yet.</p>}
      </section>

      {editingPass && (
        <div className="modal">
          <form className="modal-card" onSubmit={handleChangePass}>
            <h3>Update Password</h3>
            <label>New password</label>
            <input type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} required />
            <div className="modal-actions">
              <button type="submit">Save</button>
              <button type="button" onClick={()=>setEditingPass(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
