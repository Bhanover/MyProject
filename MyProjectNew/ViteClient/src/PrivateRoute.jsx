import React from 'react';
import { Navigate } from 'react-router-dom';
/*isAuthenticated: Esta es una función verifica si un usuario está autenticado o no*/
function isAuthenticated() {
  const token = localStorage.getItem("jwtToken");
  /*. Si el token no es nulo, asume que el usuario está autenticado y devuelve true. En caso contrario, devuelve false.*/
  return token !== null;
}
/* Si el usuario no está autenticado, redirige al usuario a la página de inicio de sesión utilizando el componente Navigate*/
function ProtectedRoute({ component: Component, ...rest }) {
  return isAuthenticated() ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/loginPage" replace />
  );
}

export default ProtectedRoute;