import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./UserImages.css";

const UserImages = ({ onProfileImageUpdate }) => {
    const [imageUrls, setImageUrls] = useState([]);
    const jwtToken = localStorage.getItem("jwtToken");
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const imagesPerPage = 16; // 4 filas de imágenes (4 imágenes por fila)

    useEffect(() => {
        fetchUserImages();
    }, []);
    
    const fetchUserImages = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/auth/user-images', {
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
    const handlePageClick = (newPage) => {
        setCurrentPage(newPage);
    };

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

    return (
        <div className='imgContainer'>
        <h1>Mis imágenes</h1>
        <div className="gallery-container">
          {imagesToDisplay.map((url, index) => (
            <div key={index} className="gallery-item">
              <img
                src={url.url}
                alt={`Imagen del usuario ${index}`}
                onClick={() => handleClickImage(url, index)}
                className="thumbnail"
              />
            </div>
          ))}
            {selectedImage && (
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
            )}
         </div>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`page-number${index + 1 === currentPage ? " active" : ""}`}
              onClick={() => handlePageClick(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        </div>
    );
}

export default UserImages;