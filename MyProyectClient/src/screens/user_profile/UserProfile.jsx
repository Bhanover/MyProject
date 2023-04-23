import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserProfile.css"
import defaultAvatar from "./images/defaultAvatar.jpg";
import UserImages from "../user_images/UserImages";

function UserProfile(props) {
  const [userInfo, setUserInfo] = useState({});
  const [showUserImages, setShowUserImages] = useState(false);
  const currentUserId = localStorage.getItem("idP");
  const [selectedImage, setSelectedImage] = useState(null);


  const handleProfileImageUpdate = (newProfileImageUrl) => {
    setUserInfo({
      ...userInfo,
      profileImage: newProfileImageUrl,
    });
  };
  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");

    axios
      .get(`http://localhost:8081/api/auth/user/${props.userId}/info`, {
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
  }, [props.userId]);

  const handleProfileImageClick = () => {
    if (currentUserId === props.userId) {
      setShowUserImages(true);
    } else {
      setSelectedImage(userInfo.profileImage || defaultAvatar);
    }
  };
  const handleCloseImageModal = () => {
    setSelectedImage(null);
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
      {selectedImage && (
  <div className="modal" onClick={handleCloseImageModal}>
    <div className="modal-content" onClick={handleContainerClick}>
      <img src={selectedImage} alt="Profile" className="large-profile-image" />
    </div>
  </div>
)}
      {showUserImages && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={handleContainerClick}>
            <div className="modal-close" onClick={handleCloseModal}>
              &times;
            </div>
            <div className="gallery-wrapper">
              <UserImages onProfileImageUpdate={handleProfileImageUpdate} userId={props.userId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;