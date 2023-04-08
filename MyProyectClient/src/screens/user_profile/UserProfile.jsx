
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
    const [userInfo, setUserInfo] = useState({});
    const jwtToken = localStorage.getItem('jwtToken');
  
    useEffect(() => {
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get('http://localhost:8081/api/auth/user/info', {
            headers: {
              Authorization: 'Bearer ' + jwtToken
            }
          });
          setUserInfo(response.data);
        } catch (error) {
          console.error('Error al obtener la información del usuario:', error.response.data);
          alert('Error al obtener la información del usuario. Inténtalo de nuevo.');
        }
      };
      fetchUserInfo();
    }, [jwtToken]);
  
    return (
      <div>
        <h1>Información del usuario</h1>
        <p>ID: {userInfo.id}</p>
        <p>Nombre de usuario: {userInfo.username}</p>
        <p>Correo electrónico: {userInfo.email}</p>
        {userInfo.profileImage ? (
          <img src={userInfo.profileImage} alt="Imagen de perfil" />
        ) : (
          <p>No hay imagen de perfil</p>
        )}
      </div>
    );
  };
export default UserProfile;