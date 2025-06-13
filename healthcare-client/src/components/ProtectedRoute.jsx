import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ role, children }) {
  const { user, token } = useSelector((state) => state.auth);

  if (!token || !user || (role && user.role !== role)) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
