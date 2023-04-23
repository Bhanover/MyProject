import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './UserImages.css';
import ImageModal from '../image_modal/ImageModal';
import { InView } from 'react-intersection-observer';

const UserImages = ({ onProfileImageUpdate, ...props }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const jwtToken = localStorage.getItem('jwtToken');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 16;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);

  useEffect(() => {
    fetchUserImages();
  }, [currentPage]);

  const fetchUserImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8081/api/auth/${props.userId}/user-images`, {
        headers: {
          'Authorization': 'Bearer ' + jwtToken
        },
        params: {
          page: currentPage - 1,
          size: imagesPerPage
        }
      });
  
      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setImageUrls((prevImages) => {
          const uniqueImages = response.data.filter(
            (newImage) => !prevImages.some((prevImage) => prevImage.url === newImage.url)
          );
          return [...prevImages, ...uniqueImages];
        });
        setHasMore(true);
      }
    } catch (error) {
      console.error('Error al establecer la foto de perfil:', error.response.data);
      alert('Error al establecer la foto de perfil. Inténtalo de nuevo.');
    }
    setLoading(false);
  };

  const handleObserver = useCallback(
    (inView) => {
      if (inView && hasMore && !loading) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    },
    [hasMore, loading]
  );

    const totalPages = Math.ceil(imageUrls.length / imagesPerPage);
    const imagesToDisplay = imageUrls.slice((currentPage - 1) * imagesPerPage, currentPage * imagesPerPage);


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
        // Actualiza la imagen de perfil y cierra el modal
        alert('Foto de perfil actualizada con éxito.');
        onProfileImageUpdate(selectedImage); // Llamar al callback
        setSelectedImage(null);
        setSelectedIndex(null);
      } catch (error) {
        console.error('Error al establecer la foto de perfil:', error);
        alert('Error al establecer la foto de perfil. Inténtalo de nuevo.');
      }
    };

    const handleClickImage = (url, index) => {
        setSelectedImage(url.url);
        setSelectedIndex(index);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
        setSelectedIndex(null);
    };

    const handleNextImage = () => {
        setSelectedIndex((selectedIndex + 1) % imageUrls.length);
        setSelectedImage(imageUrls[(selectedIndex + 1) % imageUrls.length].url);
    };

    const handlePrevImage = () => {
        setSelectedIndex((selectedIndex - 1 + imageUrls.length) % imageUrls.length);
        setSelectedImage(imageUrls[(selectedIndex - 1 + imageUrls.length) % imageUrls.length].url);
    };
    
const handleOpenImageModal = (url, fileId) => {
  console.log("File ID en handleOpenImageModal: ", fileId);
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
      fetchUserImages(); // Vuelve a cargar las imágenes del usuario
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
        <div key={index} className="gallery-item">
          <img
            src={url.url}
            alt={`Imagen del usuario ${index}`}
            onClick={() => handleOpenImageModal(url, url.imageId)}
            className="thumbnail"
          />
        </div>
      ))}
      {hasMore && (
        <InView as="div" onChange={handleObserver} threshold={1}>
          <div className="loading">Cargando...</div>
        </InView>
      )}
    </div>
    {showImageModal && (
     <ImageModal
     selectedImage={selectedImage}
     fileId={selectedFileId}
     onClose={handleCloseImageModal}
     userId={props.userId}
     onDelete={deleteImage}
   />
    )}
  </div>
);
};

export default UserImages;

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