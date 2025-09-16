// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "./AuthContext";

// export default function ProtectedRoute({ children, allowedRoles = [] }) {
//   const { user } = useAuth();
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }
//   if (allowedRoles.length && !allowedRoles.includes(user.role)) {
//     // unauthorized -> send to their dashboard
//     if (user.role === "admin") return <Navigate to="/admin" replace />;
//     if (user.role === "owner") return <Navigate to="/store-owner" replace />;
//     return <Navigate to="/user" replace />;
//   }
//   return children;
// }

// src/auth/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}
