import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserProfile.css"
import defaultAvatar from "./images/defaultAvatar.jpg";
import UserImages from "../user_images/UserImages";
function UserProfile() {
  const [userInfo, setUserInfo] = useState({});
  const [showUserImages, setShowUserImages] = useState(false);
  const handleProfileImageUpdate = (newProfileImageUrl) => {
    setUserInfo({
      ...userInfo,
      profileImage: newProfileImageUrl,
    });
  };
  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");

    axios
      .get("http://localhost:8081/api/auth/user/info", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then((response) => {
        setUserInfo(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleProfileImageClick = () => {
    setShowUserImages(true);
  };

  const handleCloseModal = () => {
    setShowUserImages(false);
  };

  const handleContainerClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="user-profile">
      
      <div className="profile-image-container">
        <img
          src={userInfo.profileImage || defaultAvatar}
          alt="Profile"
          className="profile-image"
          onClick={handleProfileImageClick}
        />
      </div>
      <div className="user-info">
        <p>ID: {userInfo.id}</p>
        <p>Username: {userInfo.username}</p>
        <p>Email: {userInfo.email}</p>
      </div>
      {showUserImages && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={handleContainerClick}>
            <div className="modal-close" onClick={handleCloseModal}>
              &times;
            </div>
            <UserImages onProfileImageUpdate={handleProfileImageUpdate} />
          </div>
        </div>
      )}
    </div>
  );
}


export default UserProfile;