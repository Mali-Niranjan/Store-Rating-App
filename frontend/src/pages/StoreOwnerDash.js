// src/pages/StoreOwnerDash.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/StoreOwnerDash.css";

export default function StoreOwnerDash() {
  const { user, logout, getData, updatePassword } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState({ stores: [], ratings: [], users: [] });
  const [editingPass, setEditingPass] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Fetch data from context
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getData();
        setData(result);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    fetchData();
  }, [getData]);

  const stores = data?.stores || [];
  const ratings = data?.ratings || [];
  const users = data?.users || [];

  const myStore = stores.find((s) => s.ownerId === user?.id);

  const myRatings = myStore
    ? ratings
        .filter((r) => r.storeId === myStore.id)
        .map((r) => {
          const u = users.find((x) => x.id === r.userId);
          return {
            ...r,
            userName: u?.name ?? r.userId,
            userEmail: u?.email ?? "—",
          };
        })
    : [];

  const avg = myRatings.length
    ? (
        myRatings.reduce((sum, r) => sum + r.rating, 0) / myRatings.length
      ).toFixed(2)
    : "—";

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Password change
  const handleChangePass = (ev) => {
    ev.preventDefault();
    if (newPass.length < 4) return alert("Password must be at least 4 characters");
    updatePassword(user.id, newPass);
    alert("Password updated successfully!");
    setEditingPass(false);
    setNewPass("");
  };

  // Sorting toggle
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedRatings = [...myRatings].sort((a, b) => {
    if (sortField === "name") {
      return sortOrder === "asc"
        ? a.userName.localeCompare(b.userName)
        : b.userName.localeCompare(a.userName);
    } else if (sortField === "email") {
      return sortOrder === "asc"
        ? a.userEmail.localeCompare(b.userEmail)
        : b.userEmail.localeCompare(a.userEmail);
    } else if (sortField === "rating") {
      return sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating;
    }
    return 0;
  });

  return (
    <div className="owner-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h2>Store Owner Dashboard</h2>
        <div>
          <button onClick={() => setEditingPass(true)}>Change Password</button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Store Info */}
      <section className="rating-summary">
        <div className="rating-card">
          <h3>My Store</h3>
          {myStore ? (
            <>
              <p>
                <strong>Name:</strong> {myStore.name}
              </p>
              <p>
                <strong>Address:</strong> {myStore.address}
              </p>
              <span className="rating-value">{avg}</span>
              <p>Average Rating</p>
            </>
          ) : (
            <p>No store assigned. Contact Admin.</p>
          )}
        </div>
      </section>

      {/* Ratings Table */}
      <section className="data-section">
        <div className="data-header">
          <h2>User Ratings</h2>
          <div className="sort-controls">
            <label>Sort by: </label>
            <select
              value={sortField}
              onChange={(e) => toggleSort(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="rating">Rating</option>
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

        {sortedRatings.length ? (
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {sortedRatings.map((r) => (
                <tr key={`${r.userId}-${r.storeId}`}>
                  <td>{r.userName}</td>
                  <td>{r.userEmail}</td>
                  <td>{r.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No ratings yet.</p>
        )}
      </section>

      {/* Password Modal */}
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
