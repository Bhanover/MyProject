import React from 'react';
import { Navigate } from 'react-router-dom';

function isAuthenticated() {
  const token = localStorage.getItem("jwtToken");
  return token !== null;
}

function ProtectedRoute({ component: Component, ...rest }) {
  return isAuthenticated() ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/loginPage" replace />
  );
}

export default ProtectedRoute;