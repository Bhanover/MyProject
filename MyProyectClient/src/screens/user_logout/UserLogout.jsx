import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import axios from 'axios';

const UserLogout = () => {
    const jwtToken = localStorage.getItem("jwtToken");
    const idP = localStorage.getItem("idP");
    const navigate = useNavigate();
  
    useEffect(() => {
      const logout = async () => {
        try {
          await axios.post('http://localhost:8081/api/auth/signout', {}, {
            headers: {
              Authorization: `Bearer ${jwtToken}`
            }
          });
  
          // Elimina las credenciales almacenadas y redirige al usuario
          localStorage.removeItem('idP');
          localStorage.removeItem('jwtToken');
          navigate('/login');
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
        }
      };
  
      logout();
    }, [jwtToken, navigate]);
  
    return (
      <div>
        <h2>Cerrando sesión...</h2>
      </div>
    );
  };
  
  export default UserLogout;
  