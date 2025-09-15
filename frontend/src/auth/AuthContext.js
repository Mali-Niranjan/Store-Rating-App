// src/auth/AuthContext.js
import React, { createContext, useContext, useState } from "react";
import API from "../api/api"; // adjust path to your axios/fetch setup

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    // example API login
    const res = await API.post("/auth/login", { email, password });
    setUser(res.data.user);
    localStorage.setItem("token", res.data.token);
    return res.data.user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const updatePassword = async (userId, newPass) => {
    await API.put(`/users/${userId}/password`, { password: newPass });
  };

  // ✅ The missing piece!
  const getData = async () => {
    try {
      const [usersRes, storesRes, ratingsRes] = await Promise.all([
        API.get("/users"),
        API.get("/stores"),
        API.get("/ratings"),
      ]);

      return {
        users: usersRes.data || [],
        stores: storesRes.data || [],
        ratings: ratingsRes.data || [],
      };
    } catch (err) {
      console.error("Error fetching data:", err);
      return { users: [], stores: [], ratings: [] };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updatePassword, getData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
