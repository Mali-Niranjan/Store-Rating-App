import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api/api"; // make sure your API base URL is correct
import "../styles/Dashboard.css";

export default function NormalUserDash() {
  const { user, setUser } = useAuth(); // get user and setUser from context
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [data, setData] = useState({ stores: [], ratings: [] });
  const [editingPass, setEditingPass] = useState(false);
  const [newPass, setNewPass] = useState("");

  // Fetch data from backend
  const getData = async () => {
    try {
      const res = await API.get("/user/data"); // adjust endpoint
      setData(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const addRating = async (userId, storeId, rating) => {
    try {
      await API.post("/user/rating", { userId, storeId, rating });
      await getData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteRating = async (userId, storeId) => {
    try {
      await API.delete(`/user/rating/${userId}/${storeId}`);
      await getData();
    } catch (err) {
      console.error(err);
    }
  };

  const updatePassword = async (userId, password) => {
    try {
      await API.put(`/user/${userId}/password`, { password });
      // optionally update local user state
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    getData();
  }, []);

  const stores = data.stores || [];
  const ratings = data.ratings || [];

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
    );

  const handleSubmitRating = (storeId, rating) => {
    addRating(user.id, storeId, parseInt(rating, 10));
  };

  const handleChangePass = async (ev) => {
    ev.preventDefault();
    if (newPass.length < 4) return alert("Password too short");
    await updatePassword(user.id, newPass);
    alert("Password updated");
    setEditingPass(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
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

      <section className="panel">
        <div className="panel-header">
          <h3>Stores</h3>
          <div>
            <input
              placeholder="Search stores by name or address"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
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
                  <select
                    defaultValue={s.myRating ?? ""}
                    onChange={(e) => handleSubmitRating(s.id, e.target.value)}
                  >
                    <option value="">Rate</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  {s.myRating && (
                    <button
                      onClick={() => {
                        deleteRating(user.id, s.id);
                      }}
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

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
