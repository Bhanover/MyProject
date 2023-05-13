import React, { useEffect, useState } from "react";
import "./LeftBar.css";
import { Link, useLocation } from 'react-router-dom';
import axios from "axios";
import { useProfileImage } from "../../../ProfileImageContext";

const LeftBar = () => {
  const currentUserId = localStorage.getItem("idP");
  const jwtToken = localStorage.getItem("jwtToken");
  const [userInfo, setUserInfo] = useState({});
  const { profileImage, updateProfileImage } = useProfileImage();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/auth/user/${currentUserId}/info`, {
          headers: {
            Authorization: 'Bearer ' + jwtToken
          }
        });
        setUserInfo(response.data);
        updateProfileImage(response.data.profileImageUrl);
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error.response.data);
        alert('Error al obtener la información del usuario. Inténtalo de nuevo.');
      }
    };
    fetchUserInfo();
  }, [jwtToken, updateProfileImage]);

 

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
          <img src={userInfo.profileImageUrl || profileImage} alt="User Profile" />
        </Link>
        </div>
    </div>
  );
};

export default LeftBar;