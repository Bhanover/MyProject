import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./UserImages.css";

const UserImages = () => {
    const [imageUrls, setImageUrls] = useState([]);
    const jwtToken = localStorage.getItem("jwtToken");
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [visibleButtonsIndex, setVisibleButtonsIndex] = useState(null);

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
            console.log(response.data)
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
        } catch (error) {
            console.error('Error al establecer la foto de perfil:', error);
            alert('Error al establecer la foto de perfil. Inténtalo de nuevo.');
        }
    };

    const deleteImage = async (imageId) => {
        try {
            console.log('imageId:', imageId); 
            await axios.delete(`http://localhost:8081/api/auth/user-images/${imageId}`, {
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
    };

    const handleClickImage = (url, index) => {
        setSelectedImage(url);
        setSelectedIndex(index);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
        setSelectedIndex(null);
    };

    const handleNextImage = () => {
        setSelectedIndex((selectedIndex + 1) % imageUrls.length);
        setSelectedImage(imageUrls[(selectedIndex + 1) % imageUrls.length]);
    };

    const handlePrevImage = () => {
        setSelectedIndex((selectedIndex - 1 + imageUrls.length) % imageUrls.length);
        setSelectedImage(imageUrls[(selectedIndex - 1 + imageUrls.length) % imageUrls.length]);
    };

    const toggleActionButtons = (index) => {
        setVisibleButtonsIndex(visibleButtonsIndex === index ? null : index);
    };

   
        return (
            <div>
                <h1>Mis imágenes</h1>
                {imageUrls.map((url, index) => (
                    <div key={index} className="thumbnail-wrapper">
                        <img
                            src={url.url}
                            alt={`Imagen del usuario ${index}`}
                            onClick={() => handleClickImage(url.url, index)}
                            className="thumbnail"
                        />
                        <div className="circle" onClick={() => toggleActionButtons(index)}></div>
                        <div className={`action-buttons ${visibleButtonsIndex === index ? 'visible' : 'hidden'}`}>
                            <button onClick={() => deleteImage(url.imageId)}>
                                Eliminar imagen
                            </button>
                            <button onClick={() => setProfilePicture(url.imageId)}>
                                Establecer como foto de perfil
                            </button>
                        </div>
                    </div>
                ))}
                {selectedImage && (
                    <div className="modal">
                        <button className="close" onClick={handleCloseModal}>×</button>
                        <button className="prev" onClick={handlePrevImage}></button>
                        <button className="next" onClick={handleNextImage}></button>
                        <img src={selectedImage} alt="Imagen seleccionada" />
                        <button onClick={() => setProfilePicture(imageUrls[selectedIndex].imageId)}>
                            Establecer como foto de perfil
                        </button>
                    </div>
                )}
            </div>
        );}

export default UserImages;