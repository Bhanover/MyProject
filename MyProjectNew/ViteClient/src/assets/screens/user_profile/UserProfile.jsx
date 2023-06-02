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
  /*Se obtiene los datos del usuario*/
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

        updateProfileImage(response.data.profileImageUrl); 
      })
      
      .catch((error) => {
        console.error(error);
      });
  }, [userId, profileImage]);
  /*handleProfileImageClick muestra las imágenes del usuario si se hace clic 
  en la imagen de perfil del usuario actual,
   en caso contrario muestra la imagen de perfil del usuario seleccionado.*/
  const handleProfileImageClick = () => {
    if (currentUserId === userId) {
      setShowUserImages(true);
    } else {
      setSelectedImage(userInfo.profileImageUrl); 
    }
  };
  /*handleCloseImageModal y handleCloseModal cierran los modales de imagen y de imágenes del usuario*/
  const handleCloseImageModal = () => {
    setSelectedImage(null);
  };

  const handleCloseModal = () => {
    setShowUserImages(false);
  };
  /*handleContainerClick detiene la propagación del evento de clic para evitar 
  que los clics en el contenedor del modal cierren el modal.*/
  const handleContainerClick = (event) => {
    event.stopPropagation();
  };
  /*handleFriendRequestSent se utiliza para actualizar
   el estado cuando se envía una solicitud de amistad.*/
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
          src={userInfo.profileImageUrl || profileImage} 
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
                <button className="close-buttonUP" onClick={handleCloseImageModal}>X</button> 
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
              <div className="gallery-wrapper-containerUP"> 
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