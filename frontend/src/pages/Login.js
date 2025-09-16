// frontend/src/pages/Login.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API, { loginAPI } from "../api/api";
import "../styles/Login.css";
import { useAuth } from "../auth/AuthContext"; // <-- updated

const roleColors = {
  admin: "#e0c3fc",
  user: "#8ec5fc",
  owner: "#fcd142",
};

const roleShadows = {
  admin: "rgba(224,195,252,0.25)",
  user: "rgba(142,197,252,0.25)",
  owner: "rgba(252,209,66,0.18)",
};

// quick seeded credentials (matches backend seed from earlier instructions)
// - password: "123456"
const seededUsers = [
  { role: "admin", email: "admin@demo.com", password: "123456" },
  { role: "user", email: "user@demo.com", password: "123456" },
  { role: "owner", email: "owner@demo.com", password: "123456" },
];

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // <-- updated
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginRole, setLoginRole] = useState(null);
  const [anim, setAnim] = useState(false);
  const [loading, setLoading] = useState(false);

  // quick helper: choose role login for testing
  const quickLogin = (role) => {
    setLoginRole(role);
    const u = seededUsers.find((x) => x.role === role);
    if (u) {
      setEmail(u.email);
      setPassword(u.password);
      setAnim(true);
      setTimeout(() => setAnim(false), 800);
    } else {
      alert("No user with that role seeded.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginAPI({ email: email.trim(), password });

      const { msg, user, token } = res.data;

      if (!token) {
        alert(msg || "Login failed");
        setLoading(false);
        return;
      }

      // persist token & user
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // update AuthContext
      setUser(user);

      // set default auth header
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // redirect by role
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "owner") navigate("/store-owner");
      else navigate("/user");
    } catch (err) {
      const msg =
        err?.response?.data?.msg || err?.response?.data?.message || err.message || "Login failed";
      alert(msg);
    } finally {
      setLoading(false);
    }
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
          border: loginRole ? `2px solid ${roleColors[loginRole]}` : "2px solid #eee",
          transition: "border 0.4s, box-shadow 0.5s",
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
            autoComplete="email"
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-anim"
            autoComplete="current-password"
          />

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            className="signup-btn"
            onClick={() => navigate("/signup")}
            disabled={loading}
          >
            Signup for New User
          </button>
        </form>

        <div className="role-card-list">
          <div className="role-card admin" onClick={() => quickLogin("admin")}>
            <span className="role-icon">🛡️</span>
            <div className="role-name">Admin</div>
          </div>
          <div className="role-card user" onClick={() => quickLogin("user")}>
            <span className="role-icon">👤</span>
            <div className="role-name">User</div>
          </div>
          <div className="role-card owner" onClick={() => quickLogin("owner")}>
            <span className="role-icon">🏪</span>
            <div className="role-name">Store Owner</div>
          </div>
        </div>

        <div className="toggle-link" style={{ marginTop: 10 }}>
          <small>
            Use a card above, then Login, to auto-fill and animate entry for each role.
          </small>
        </div>
      </div>
    </div>
  );
}
