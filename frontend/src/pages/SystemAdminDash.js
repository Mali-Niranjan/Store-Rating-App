import React, { useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function UsersTable({ users, onView, filter, setFilter }) {
  const filtered = users.filter(u =>
    (u.name || "").toLowerCase().includes(filter.q.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(filter.q.toLowerCase()) ||
    (u.address || "").toLowerCase().includes(filter.q.toLowerCase()) ||
    (u.role || "").toLowerCase().includes(filter.q.toLowerCase())
  );

  return (
    <div className="table-card">
      <h3>Users</h3>
      <div className="table-controls">
        <input
          placeholder="Filter by name/email/address/role"
          value={filter.q}
          onChange={e => setFilter({ ...filter, q: e.target.value })}
        />
      </div>
      <table className="simple-table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Address</th><th>Role</th><th>Action</th></tr>
        </thead>
        <tbody>
          {filtered.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.address}</td>
              <td>{u.role}</td>
              <td><button onClick={() => onView(u)}>View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StoresTable({ stores, ratings }) {
  const mapRating = (storeId) => {
    const storeRatings = ratings.filter(r => r.storeId === storeId).map(r => r.rating);
    if (!storeRatings.length) return "—";
    const avg = storeRatings.reduce((s, a) => s + a, 0) / storeRatings.length;
    return avg.toFixed(2);
  };

  return (
    <div className="table-card">
      <h3>Stores</h3>
      <table className="simple-table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Address</th><th>Rating</th></tr>
        </thead>
        <tbody>
          {stores.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.address}</td>
              <td>{mapRating(s.id)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SystemAdminDash() {
  const { user, logout, getData, addUser, addStore } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState({ q: "" });
  const [viewUser, setViewUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);

  // ✅ safe fallbacks
  const data = getData() || {};
  const users = data.users || [];
  const stores = data.stores || [];
  const ratings = data.ratings || [];

  const totals = useMemo(() => ({
    users: users.length,
    stores: stores.length,
    ratings: ratings.length
  }), [users, stores, ratings]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAddUser = (ev) => {
    ev.preventDefault();
    const form = ev.target;
    const newU = {
      name: form.name.value,
      email: form.email.value,
      password: form.password.value,
      address: form.address.value,
      role: form.role.value
    };
    addUser(newU);
    setShowAddUser(false);
    window.location.reload();
  };

  const handleAddStore = (ev) => {
    ev.preventDefault();
    const form = ev.target;
    addStore({
      name: form.name.value,
      email: form.email.value,
      address: form.address.value,
      ownerId: parseInt(form.ownerId.value || "0", 10)
    });
    setShowAddStore(false);
    window.location.reload();
  };

  return (
    <div className="dashboard-page">
      <header className="dash-header">
        <h2>System Administrator Dashboard</h2>
        <div>
          <span>{user?.name} ({user?.role})</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <section className="stats-row">
        <div className="stat-card"><h4>Total Users</h4><p>{totals.users}</p></div>
        <div className="stat-card"><h4>Total Stores</h4><p>{totals.stores}</p></div>
        <div className="stat-card"><h4>Total Ratings</h4><p>{totals.ratings}</p></div>
      </section>

      <section className="content-grid">
        <div>
          <div className="panel">
            <div className="panel-header">
              <h3>Users</h3>
              <div><button onClick={() => setShowAddUser(true)}>Add User</button></div>
            </div>
            <UsersTable users={users} onView={u => setViewUser(u)} filter={filter} setFilter={setFilter} />
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Stores</h3>
              <div><button onClick={() => setShowAddStore(true)}>Add Store</button></div>
            </div>
            <StoresTable stores={stores} ratings={ratings} />
          </div>
        </div>

        <aside className="panel aside">
          <h3>Details</h3>
          {viewUser ? (
            <div>
              <p><strong>Name:</strong> {viewUser.name}</p>
              <p><strong>Email:</strong> {viewUser.email}</p>
              <p><strong>Address:</strong> {viewUser.address}</p>
              <p><strong>Role:</strong> {viewUser.role}</p>
              <button onClick={() => setViewUser(null)}>Close</button>
            </div>
          ) : (
            <p>Select a user to see details.</p>
          )}
        </aside>
      </section>

      {/* Modals */}
      {showAddUser && (
        <div className="modal">
          <form className="modal-card" onSubmit={handleAddUser}>
            <h3>Add New User</h3>
            <label>Name</label><input name="name" required />
            <label>Email</label><input name="email" type="email" required />
            <label>Password</label><input name="password" type="password" required />
            <label>Address</label><input name="address" required />
            <label>Role</label>
            <select name="role">
              <option value="user">Normal User</option>
              <option value="admin">Admin</option>
              <option value="owner">Store Owner</option>
            </select>
            <div className="modal-actions">
              <button type="submit">Add</button>
              <button type="button" onClick={() => setShowAddUser(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {showAddStore && (
        <div className="modal">
          <form className="modal-card" onSubmit={handleAddStore}>
            <h3>Add New Store</h3>
            <label>Name</label><input name="name" required />
            <label>Email</label><input name="email" required />
            <label>Address</label><input name="address" required />
            <label>Owner</label>
            <select name="ownerId">
              <option value="">(no owner)</option>
              {users.filter(u => u.role === "owner").map(o => (
                <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
              ))}
            </select>
            <div className="modal-actions">
              <button type="submit">Add Store</button>
              <button type="button" onClick={() => setShowAddStore(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
