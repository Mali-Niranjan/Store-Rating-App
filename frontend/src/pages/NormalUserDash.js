// src/pages/NormalUserDash.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/Dashboard.css";

export default function NormalUserDash() {
  const { user, logout, addRating, updatePassword } = useAuth();
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [editingPass, setEditingPass] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc"); // asc | desc
  const [editingRating, setEditingRating] = useState(null);
  const [newRating, setNewRating] = useState("");

  // ✅ Fetch stores & ratings from backend
  const fetchData = async () => {
    try {
      const storeRes = await API.get("/stores"); // adjust endpoint if different
      const ratingRes = await API.get("/ratings"); // adjust endpoint if different
      setStores(storeRes.data);
      setRatings(ratingRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Enrich store data
  const enriched = stores
    .map((s) => {
      const all = ratings.filter((r) => r.storeId === s.id);
      const avg = all.length
        ? (all.reduce((a, b) => a + b.rating, 0) / all.length).toFixed(2)
        : "—";
      const my = ratings.find((r) => r.storeId === s.id && r.userId === user.id);
      return { ...s, avg, myRating: my ? my.rating : null };
    })
    .filter(
      (s) =>
        s.name.toLowerCase().includes(q.toLowerCase()) ||
        s.address.toLowerCase().includes(q.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === "address") {
        return sortOrder === "asc"
          ? a.address.localeCompare(b.address)
          : b.address.localeCompare(a.address);
      } else if (sortField === "avg") {
        return sortOrder === "asc"
          ? parseFloat(a.avg) - parseFloat(b.avg)
          : parseFloat(b.avg) - parseFloat(a.avg);
      }
      return 0;
    });

  // ✅ Submit rating
  const handleSubmitRating = async (storeId, rating) => {
    if (!rating) return;
    try {
      await addRating(user.id, storeId, parseInt(rating, 10));
      await fetchData(); // refresh data
    } catch (err) {
      console.error("Error adding rating:", err);
    }
    setEditingRating(null);
    setNewRating("");
  };

  // ✅ Change password
  const handleChangePass = async (ev) => {
    ev.preventDefault();
    if (newPass.length < 4) return alert("Password too short");
    try {
      await updatePassword(user.id, newPass);
      alert("Password updated");
    } catch (err) {
      console.error("Error updating password:", err);
      alert("Error updating password");
    }
    setEditingPass(false);
  };

  // ✅ Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ Sorting toggle
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dash-header">
        <h2>Welcome, {user.name}</h2>
        <div>
          <button onClick={() => setEditingPass(true)}>Change Password</button>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Profile */}
      <section className="panel">
        <h3>Your Profile</h3>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Address:</strong> {user.address}
        </p>
      </section>

      {/* Stores */}
      <section className="panel">
        <div className="panel-header">
          <h3>Stores</h3>
          <div className="filters">
            <input
              placeholder="Search stores by name or address"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <div className="sort-controls">
              <label>Sort by: </label>
              <select
                value={sortField}
                onChange={(e) => toggleSort(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="address">Address</option>
                <option value="avg">Rating</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                {sortOrder === "asc" ? "Ascending ↑" : "Descending ↓"}
              </button>
            </div>
          </div>
        </div>

        <table className="simple-table">
          <thead>
            <tr>
              <th>Store</th>
              <th>Address</th>
              <th>Overall Rating</th>
              <th>Your Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {enriched.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.address}</td>
                <td>{s.avg}</td>
                <td>{s.myRating ?? "—"}</td>
                <td>
                  {editingRating === s.id ? (
                    <div className="update-box">
                      <select
                        value={newRating}
                        onChange={(e) => setNewRating(e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                      <button
                        onClick={() => handleSubmitRating(s.id, newRating)}
                      >
                        Save
                      </button>
                      <button onClick={() => setEditingRating(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button onClick={() => setEditingRating(s.id)}>
                        {s.myRating ? "Update" : "Rate"}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Change password modal */}
      {editingPass && (
        <div className="modal">
          <form className="modal-card" onSubmit={handleChangePass}>
            <h3>Update Password</h3>
            <label>New password</label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              required
            />
            <div className="modal-actions">
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditingPass(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
