import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./../App.css"; // ✅ Use the CSS we wrote earlier

function getUser() {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
}

export default function Navbar() {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h1>🏪 Store Rating</h1>
      <ul>
        <li><Link to="/">Stores</Link></li>

        {!user && (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}

        {user && user.role === "admin" && (
          <li><Link to="/admin">Admin Dashboard</Link></li>
        )}

        {user && user.role === "owner" && (
          <li><Link to="/owner">Owner Dashboard</Link></li>
        )}

        {user && (
          <>
            <li><Link to="/update-password">Update Password</Link></li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
