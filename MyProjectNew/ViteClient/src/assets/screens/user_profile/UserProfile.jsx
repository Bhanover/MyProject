import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserProfile.css";

import UserImages from "../user_images/UserImages";
import { useProfileImage } from "../../../ProfileImageContext";
import Friendship from "../friendship/Friendship";

const UserProfile = ({ userId }) => {
  const [userInfo, setUserInfo] = useState({});
  const [showUserImages, setShowUserImages] = useState(false);
  const currentUserId = localStorage.getItem("idP");
  const [selectedImage, setSelectedImage] = useState(null);
  const { profileImage, updateProfileImage } = useProfileImage();
  const isOwnProfile = userId === currentUserId;
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  
  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
  
    axios
      .get(`http://localhost:8081/api/auth/user/${userId}/info`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
       .then((response) => {
        setUserInfo(response.data);
        console.log(response.data);

        updateProfileImage(response.data.profileImageUrl); // Cambiar a userInfo.profileImageUrl
      })
      
      .catch((error) => {
        console.error(error);
      });
  }, [userId, updateProfileImage]);

  const handleProfileImageClick = () => {
    if (currentUserId === userId) {
      setShowUserImages(true);
    } else {
      setSelectedImage(userInfo.profileImageUrl); // Cambiar a userInfo.profileImageUrl
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
  const handleFriendRequestSent = () => {
    setFriendRequestSent(true);
  };
 
  return (
    <div className="user-profileUP">

      {!isOwnProfile && (
        <Friendship
          friendId={userId}
          updateFriends={handleFriendRequestSent}
          disabled={friendRequestSent}
        />
      )}
      <div className="profile-image-containerUP">
      <img
          src={userInfo.profileImageUrl || profileImage}  // Cambiar a userInfo.profileImageUrl
          alt="Profile"
          className="profile-imageUP"
          onClick={handleProfileImageClick}
        />
          </div>
      <div className="user-infoUP">
        <p>{userInfo.username}</p>
        <p>{userInfo.email}</p>
      </div>
      {selectedImage && (
  <div className="modalUP" onClick={handleCloseImageModal}>
    <div className="modal-contentUP" onClick={handleContainerClick}>
      <div className="large-profile-image-container">
        <img
          src={selectedImage}
          alt="Profile"
          className="large-profile-imageUP"
        />
        <button className="close-buttonUP" onClick={handleCloseImageModal}>X</button> {/* Nuevo botón */}
      </div>
    </div>
  </div>
)}
      
{showUserImages && (
  <div className="modalUP" onClick={handleCloseModal}>
    <div className="modal-contentUP" onClick={handleContainerClick}>
      <div className="modal-closeUP" onClick={handleCloseModal}>
        &times;
      </div>
      <div className="gallery-wrapper-containerUP"> {/* Agrega este contenedor */}
        <div className="gallery-wrapperUP">
          <UserImages userId={userId} />
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default UserProfile;