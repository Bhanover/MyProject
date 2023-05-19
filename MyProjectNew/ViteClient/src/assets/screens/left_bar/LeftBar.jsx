import React, { useEffect, useState } from "react";
import "./LeftBar.css";
import { Link, useLocation } from 'react-router-dom';
import axios from "axios";
import { useProfileImage } from "../../../ProfileImageContext";
import { useNavigate } from "react-router-dom";

const LeftBar = () => {
  const currentUserId = localStorage.getItem("idP");
  const jwtToken = localStorage.getItem("jwtToken");
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  /*Aqui se obtienen del hook useProfileImage.*/
  const { profileImage, updateProfileImage } = useProfileImage();
  /*location es la ubicación actual en la aplicación.*/
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!jwtToken || !currentUserId) {
      navigate('/loginPage');
      return;
    }
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/auth/user/${currentUserId}/info`, {
          headers: {
            Authorization: 'Bearer ' + jwtToken
          }
        });
        setUserInfo(response.data);
        updateProfileImage(response.data.profileImageUrl);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error.response.data);
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [jwtToken, updateProfileImage, currentUserId, navigate]);
  /*Esta función determina si una ruta específica está activa comparándola con la ubicación actual.*/
  const isActive = (path) => {
    if (path === '/' && location.pathname.startsWith(`/profilePage/${currentUserId}`)) {
      return false;
    }
    return location.pathname.startsWith(path);
  };
  return (
    <div className="icon-containerLB">
      <Link to={`/`} className={isActive('/') ? 'active' : ''}>
        <i className="fa fa-home icon" aria-hidden="true"></i>
      </Link>
      <div>
        <Link to={`/profilePage/${currentUserId}`} className={isActive(`/profilePage/${currentUserId}`) ? 'active' : ''}>
          {loading ? <div className="spinner"></div> : <img src={userInfo.profileImageUrl || profileImage} alt="User Profile" />}
        </Link>
      </div>
    </div>
  );
};

export default LeftBar;