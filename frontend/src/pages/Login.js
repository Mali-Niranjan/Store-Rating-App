// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api"; // Axios instance
import { useAuth } from "../auth/AuthContext"; // ✅ use AuthContext
import "../styles/Login.css";

const roleColors = { admin: "#e0c3fc", user: "#8ec5fc", owner: "#fcd142" };
const roleShadows = {
  admin: "rgba(224,195,252,0.25)",
  user: "rgba(142,197,252,0.25)",
  owner: "rgba(252,209,66,0.18)",
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // ✅ use login() from context

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginRole, setLoginRole] = useState(null);
  const [anim, setAnim] = useState(false);
  const [loading, setLoading] = useState(false);

  // Page user tried to visit before being redirected to login
  const from = location.state?.from?.pathname || null;

  const performLogin = async (emailInput, passwordInput) => {
    try {
      setLoading(true);
      const res = await API.post("/auth/login", {
        email: emailInput,
        password: passwordInput,
      });

      // ✅ Save in AuthContext + localStorage
      login(res.data.user, res.data.token);

      const userRole = res.data.user.role;

      // Redirect logic
      if (from) {
        navigate(from, { replace: true });
      } else {
        if (userRole === "admin") navigate("/admin");
        else if (userRole === "owner") navigate("/store-owner");
        else navigate("/user");
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loginRole) {
      alert("Please select a role before logging in.");
      return;
    }
    performLogin(email, password);
  };

  const selectRole = (role) => {
    setLoginRole(role);
    setAnim(true);
    setTimeout(() => setAnim(false), 800);
  };

  return (
    <div
      className="login-bg"
      style={{
        background: loginRole
          ? `linear-gradient(120deg, ${roleColors[loginRole]}, #fff 80%)`
          : "linear-gradient(120deg, #e0c3fc, #8ec5fc 80%)",
      }}
    >
      <div
        className={`login-container ${anim ? "role-anim" : ""}`}
        style={{
          boxShadow: loginRole
            ? `0px 8px 24px ${roleShadows[loginRole]}`
            : "0px 8px 24px rgba(0, 0, 0, 0.10)",
          border: loginRole
            ? `2px solid ${roleColors[loginRole]}`
            : "2px solid #eee",
        }}
      >
        <h2 className="role-header">
          Login to StoreRank
          {loginRole && (
            <span className={`role-badge role-${loginRole}`}>
              {loginRole === "admin"
                ? "System Admin"
                : loginRole === "owner"
                ? "Store Owner"
                : "User"}
            </span>
          )}
        </h2>

        <form onSubmit={handleSubmit} className="form-container">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-anim"
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-anim"
          />

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            className="signup-btn"
            onClick={() => navigate("/signup")}
          >
            Signup for New User
          </button>
        </form>

        <div className="role-card-list">
          <div className="role-card admin" onClick={() => selectRole("admin")}>
            <span className="role-icon">🛡️</span>
            <div className="role-name">Admin</div>
          </div>
          <div className="role-card user" onClick={() => selectRole("user")}>
            <span className="role-icon">👤</span>
            <div className="role-name">User</div>
          </div>
          <div className="role-card owner" onClick={() => selectRole("owner")}>
            <span className="role-icon">🏪</span>
            <div className="role-name">Store Owner</div>
          </div>
        </div>
      </div>
    </div>
  );
}
