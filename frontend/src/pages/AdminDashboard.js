// src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { FaUsers, FaStore, FaStar } from "react-icons/fa";
import API from "../api/api";

export default function AdminDashboard() {
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [ratings, setRatings] = useState([]);

  // Filters
  const [storeFilter, setStoreFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");

  // ✅ Fetch data from backend
  const fetchData = async () => {
    try {
      const [storeRes, userRes, ratingRes] = await Promise.all([
        API.get("/stores"),   // adjust endpoint
        API.get("/users"),    // adjust endpoint
        API.get("/ratings"),  // adjust endpoint
      ]);
      setStores(storeRes.data);
      setUsers(userRes.data);
      setRatings(ratingRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Metrics
  const totalUsers = users.length;
  const totalStores = stores.length;
  const totalRatings = ratings.length;

  // ✅ Calculate average rating for each store
  const storesWithAvg = stores.map((store) => {
    const storeRatings = ratings.filter((r) => r.storeId === store.id);
    const avgRating = storeRatings.length
      ? (
          storeRatings.reduce((sum, r) => sum + r.rating, 0) /
          storeRatings.length
        ).toFixed(2)
      : "—";
    return { ...store, avgRating };
  });

  // ✅ Add store owner ratings to user list
  const usersWithRatings = users.map((u) => {
    if (u.role === "Store Owner") {
      const ownerRatings = ratings.filter((r) => r.storeId === u.storeId);
      const avgRating = ownerRatings.length
        ? (
            ownerRatings.reduce((sum, r) => sum + r.rating, 0) /
            ownerRatings.length
          ).toFixed(2)
        : "—";
      return { ...u, rating: avgRating };
    }
    return { ...u, rating: "-" };
  });

  return (
    <div className="admin-dashboard">
      <h1>System Administrator Dashboard</h1>

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
            {storesWithAvg
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
            {usersWithRatings
              .filter((u) =>
                u.name.toLowerCase().includes(userFilter.toLowerCase())
              )
              .map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td>{user.role}</td>
                  <td>{user.rating}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
