import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserImages.css';
import ImageModal from '../image_modal/ImageModal';
import { useProfileImage } from "../../../ProfileImageContext";
import { useParams, useNavigate } from "react-router-dom";

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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchUserImages();
  }, []);
  /* fetchUserImages se utiliza para mostrar una galería de imágenes subidas por el usuario.*/
  const fetchUserImages = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:8081/api/auth/${userId}/user-images`, {
        headers: {
          'Authorization': 'Bearer ' + jwtToken
        }
      });
      /*sortedImages Se utiliza para ordenar las imagenes por la fecha de creacion*/
      const sortedImages = response.data.sort((a, b) => new Date(b.creationTime) - new Date(a.creationTime));

      setImageUrls(sortedImages);
      setLoading(false);

    } catch (error) {
      console.error('Error al establecer la foto de perfil:', error.response.data);
      alert('Error al establecer la foto de perfil. Inténtalo de nuevo.');
    }
  };
  const clearUrl = () => {
    navigate(`/profilePage/${userId}/images`);
  };
  /*Las funciones handleOpenImageModal y handleCloseImageModal 
  se utilizan para abrir y cerrar el modal de imagen respectivamente.*/
  const handleOpenImageModal = (url, fileId, index) => {
    setSelectedFileId(fileId);
    setSelectedImage(url.url);
    setSelectedImageIndex(index);
    setShowImageModal(true);

    navigate(`/profilePage/${userId}/images/${fileId}`);
  };
  const handleCloseImageModal = () => {
    setSelectedImage(null);
    setSelectedFileId(null);
    setShowImageModal(false);
    clearUrl()
  };
  /*El método refreshImages llama a fetchUserImages, permitiendo recargar las imágenes.*/
  const refreshImages = () => {
    fetchUserImages();
  };
  return (
    <div className="imgContainerUI">
      {loading ? (
      <div className="loader-container">
        <div className="loader"></div>
        </div>
      ) : (
        <>
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
          onProfileImageUpdate={updateProfileImage}
          onImagesRefresh={refreshImages} 
        
        />
        )}
        </>
    )}
    </div>
  );
    }

export default UserImages;