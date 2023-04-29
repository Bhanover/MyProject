import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserImages.css';
import ImageModal from '../image_modal/ImageModal';

const UserImages = ({ onProfileImageUpdate, ...props }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const jwtToken = localStorage.getItem('jwtToken');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [profileImageUpdated, setProfileImageUpdated] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Agrega este estado

  useEffect(() => {
    fetchUserImages();
  }, []);

  const fetchUserImages = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/auth/${props.userId}/user-images`, {
        headers: {
          'Authorization': 'Bearer ' + jwtToken
        }
      });
  
      setImageUrls(response.data);
    } catch (error) {
      console.error('Error al establecer la foto de perfil:', error.response.data);
      alert('Error al establecer la foto de perfil. Inténtalo de nuevo.');
    }
  };

  const setProfilePicture = async (imageId) => {
    try {
      await axios.put('http://localhost:8081/api/auth/set-profile-image', null, {
        headers: {
          'Authorization': 'Bearer ' + jwtToken
        },
        params: {
          imageId: imageId
        }
      });
      alert('Foto de perfil actualizada con éxito.');
      onProfileImageUpdate(selectedImage);
      setSelectedImage(null);
      setProfileImageUpdated(true); // Agrega esta línea
    } catch (error) {
      console.error('Error al establecer la foto de perfil:', error);
      alert('Error al establecer la foto de perfil. Inténtalo de nuevo.');
    }
  };
  
  const handleOpenImageModal = (url, fileId) => { // Añade el argumento 'index'
    setSelectedFileId(fileId);
    setSelectedImage(url.url);
    setShowImageModal(true);
  };
  const handleCloseImageModal = () => {
    setSelectedImage(null);
    setSelectedFileId(null);
    setShowImageModal(false);
  };
  
  const deleteImage = async (imageId) => {
    try {
      await axios.delete(`http://localhost:8081/api/auth/user-files/${imageId}`, {
        headers: {
          'Authorization': 'Bearer ' + jwtToken
        }
      });
      fetchUserImages();
      alert('Imagen eliminada con éxito.');
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
      alert('Error al eliminar la imagen. Inténtalo de nuevo.');
    }
  }
  return (
    <div className="imgContainer">
      <h1>Mis imágenes</h1>
      <div className="gallery-container">
        {imageUrls.map((url, index) => (
          <div
            key={index}
            className="gallery-item"
          >
            <img
            src={url.url}
            alt={`Imagen del usuario ${index}`}
            onClick={() => handleOpenImageModal(url, url.imageId, index)}
            className="thumbnail"
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
    userId={props.userId}
    onDelete={deleteImage}
    onSetProfilePicture={setProfilePicture}
    selectedImageIndex={selectedImageIndex} // Agrega esta línea
  />
)}
    </div>
  );
};

export default UserImages;



/*const setProfilePicture = async (imageId) => {
  try {
    await axios.put('http://localhost:8081/api/auth/set-profile-image', null, {
      headers: {
        'Authorization': 'Bearer ' + jwtToken
      },
      params: {
        imageId: imageId
      }
    });
    alert('Foto de perfil actualizada con éxito.');
    onProfileImageUpdate(selectedImage);
    setSelectedImage(null);
  } catch (error) {
    console.error('Error al establecer la foto de perfil:', error);
    alert('Error al establecer la foto de perfil. Inténtalo de nuevo.');
  }
};

const handleOpenImageModal = (url, fileId) => {
  setSelectedFileId(fileId);
  setSelectedImage(url.url);
  setShowImageModal(true);
};

const handleCloseImageModal = () => {
  setSelectedImage(null);
  setSelectedFileId(null);
  setShowImageModal(false);
};

const deleteImage = async (imageId) => {
  try {
    await axios.delete(`http://localhost:8081/api/auth/user-files/${imageId}`, {
      headers: {
        'Authorization': 'Bearer ' + jwtToken
      }
    });
    fetchUserImages();
    alert('Imagen eliminada con éxito.');
  } catch (error) {
    console.error('Error al eliminar la imagen:', error);
    alert('Error al eliminar la imagen. Inténtalo de nuevo.');
  }
};*/
/*{selectedImage && (
  <div className="modal">
      <button className="close" onClick={handleCloseModal}>×</button>
      <button className="prev" onClick={handlePrevImage}>&lt;</button>
      <button className="next" onClick={handleNextImage}>&gt;</button>
      <img src={selectedImage} alt="Imagen seleccionada" />
      <div className="modal-buttons">
          <button onClick={handleCloseModal}>
              Cancelar
          </button>
          <button onClick={() => setProfilePicture(imageUrls[selectedIndex].imageId)}>
              Establecer como foto de perfil
          </button>
      </div>
  </div>
)}*/

 /* const handleOpenImageModal = (url, fileId) => {
    const imageIndex = content
      .filter((item) => item.contentType && item.contentType.startsWith("image/"))
      .findIndex((item) => item.id === fileId);
    setSelectedFileId(fileId);
    setSelectedImageIndex(imageIndex);
    setShowImageModal(true);
  };*/