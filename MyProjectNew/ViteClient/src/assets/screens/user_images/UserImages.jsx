import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserImages.css';
import ImageModal from '../image_modal/ImageModal';
import { useProfileImage } from "../../../ProfileImageContext";
import { useParams } from "react-router-dom";

const UserImages = ({ onProfileImageUpdate, ...props }) => {
  const { userId } = useParams();

  const [imageUrls, setImageUrls] = useState([]);
  const jwtToken = localStorage.getItem('jwtToken');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [profileImageUpdated, setProfileImageUpdated] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { updateProfileImage } = useProfileImage();

  useEffect(() => {
    fetchUserImages();
  }, []);

  const fetchUserImages = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/auth/${userId}/user-images`, {
        headers: {
          'Authorization': 'Bearer ' + jwtToken
        }
      });

      setImageUrls(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error al establecer la foto de perfil:', error.response.data);
      alert('Error al establecer la foto de perfil. Inténtalo de nuevo.');
    }
  };

  const handleOpenImageModal = (url, fileId, index) => {
    setSelectedFileId(fileId);
    setSelectedImage(url.url);
    setSelectedImageIndex(index);
    setShowImageModal(true);
    
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
    setSelectedFileId(null);
    setShowImageModal(false);
  };
  const refreshImages = () => {
    fetchUserImages();
  };
  return (
    <div className="imgContainerUI">
      <h1>Images</h1>
      <div className="gallery-containerUI">
        {imageUrls.map((url, index) => (
          <div
            key={index}
            className="gallery-itemUI"
          >
            <img
              src={url.url}
              alt={`Imagen del usuario ${index}`}
              onClick={() => handleOpenImageModal(url, url.imageId, index, url.description, url.creationTime)}
              className="thumbnailUI"
            />
          </div>
        ))}
      </div>
      {showImageModal && (
        <ImageModal
          selectedImages={imageUrls}
          selectedFileIds={imageUrls.map((image) => image.imageId)}
          fileId={selectedFileId}
          onClose={handleCloseImageModal}
          selectedImage={selectedImage}
          userId={userId}
          selectedImageIndex={selectedImageIndex}
          onProfileImageUpdate={updateProfileImage} // Agrega esta línea
          onImagesRefresh={refreshImages} // Agrega esta línea
        
        />
      )}
    </div>
  );
};

export default UserImages;