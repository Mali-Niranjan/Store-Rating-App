import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { FaUsers, FaStore, FaStar } from "react-icons/fa";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api/api"; // make sure API points to your backend

export default function AdminDashboard() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);

  const [storeFilter, setStoreFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");

  // Fetch admin dashboard data
  const getData = async () => {
    try {
      const res = await API.get("/admin/data"); // adjust endpoint
      setStores(res.data.stores || []);
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    getData();
  }, []);

  // Metrics
  const totalUsers = users.length;
  const totalStores = stores.length;
  const totalRatings = stores.reduce(
    (sum, s) => sum + Math.round(s.avgRating || 0),
    0
  );

  return (
    <div className="admin-dashboard">
      <header className="dash-header">
        <h1>System Administrator Dashboard</h1>
        <div>
          <button className="btn-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* Metrics */}
      <div className="metrics">
        <div className="metric-card">
          <FaUsers size={30} color="#2d6cdf" />
          <h3>{totalUsers}</h3>
          <p>Total Users</p>
        </div>
        <div className="metric-card">
          <FaStore size={30} color="#43a047" />
          <h3>{totalStores}</h3>
          <p>Total Stores</p>
        </div>
        <div className="metric-card">
          <FaStar size={30} color="#ff9800" />
          <h3>{totalRatings}</h3>
          <p>Total Ratings</p>
        </div>
      </div>

      {/* Stores List */}
      <div className="list-section">
        <h2>Stores</h2>
        <input
          type="text"
          placeholder="Filter stores..."
          value={storeFilter}
          onChange={(e) => setStoreFilter(e.target.value)}
        />
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Average Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores
              .filter((s) =>
                s.name.toLowerCase().includes(storeFilter.toLowerCase())
              )
              .map((store) => (
                <tr key={store.id}>
                  <td>{store.name}</td>
                  <td>{store.email}</td>
                  <td>{store.address}</td>
                  <td>{store.avgRating}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Users List */}
      <div className="list-section">
        <h2>Users</h2>
        <input
          type="text"
          placeholder="Filter users..."
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
        />
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Role</th>
              <th>Rating (if Store Owner)</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((u) =>
                u.name.toLowerCase().includes(userFilter.toLowerCase())
              )
              .map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td>{user.role}</td>
                  <td>{user.role === "Store Owner" ? user.rating : "-"}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
