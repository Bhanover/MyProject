import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CommentFile from "../comment_file/CommentFile";
import "./ImageModal.css";
import Reaction from "../reaction/Reaction";
import axios from 'axios';
import { useProfileImage } from "../../../ProfileImageContext";
import { useNavigate } from 'react-router-dom';

const ImageModal = ({
  selectedImages,
  selectedFileIds,
  fileId,
  onClose,
  userId,
  selectedImageIndex,
  onProfileImageUpdate, 
  onImagesRefresh,
}) => {
  
  const [currentImageIndex, setCurrentImageIndex] = useState(selectedImageIndex);
  const [currentFileId, setCurrentFileId] = useState(fileId);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const jwtToken = localStorage.getItem('jwtToken');
  const { updateProfileImage } = useProfileImage();
  const currentUserId = localStorage.getItem("idP");
  const navigate = useNavigate();

 /*Las funciones handleOptionsClick, deleteImage, y 
  setProfilePicture manejan la lógica para mostrar las opciones de imagen, eliminar una imagen
   y establecer una imagen como la imagen de perfil.*/
  const handleOptionsClick = (event) => {
    event.preventDefault();
    setDropdownVisible(!dropdownVisible);
  };
  
  const deleteImage = async (imageId) => {
    try {
      await axios.delete(`http://localhost:8081/api/auth/user-files/${imageId}`, {
        headers: {
          'Authorization': 'Bearer ' + jwtToken
        }
      });
      onImagesRefresh(); 
      onClose();
      alert('Imagen eliminada con éxito.');
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
      alert('Error al eliminar la imagen. Inténtalo de nuevo.');
    }
  }
  const setProfilePicture = async (imageId) => {
    try {
      const response = await axios.put('http://localhost:8081/api/auth/set-profile-image', null, {
        headers: {
          'Authorization': 'Bearer ' + jwtToken
        },
        params: {
          imageId: imageId
        }
      });
      const imageUrl = response.data.url;
      alert('Foto de perfil actualizada con éxito.');
      onProfileImageUpdate(imageUrl);
      onClose();

      return imageUrl; 
    } catch (error) {
      console.error('Error al establecer la foto de perfil:', error);
      alert('Error al establecer la foto de perfil. Inténtalo de nuevo.');
    }
  };
  
const handleSetProfilePicture = async () => {
  try {
    const imageUrl = await setProfilePicture(currentFileId);
    onProfileImageUpdate(imageUrl);
    onImagesRefresh();
  } catch (error) {
    console.error("Error al establecer la foto de perfil:", error);
    alert("Error al establecer la foto de perfil. Inténtalo de nuevo.");
  }
};

/*Este useEffect evita el desplazamiento cuando el modal está abierto.*/
  useEffect(() => {
  // Agrega la clase "no-scroll" al body cuando se monta el componente
  document.body.classList.add('no-scroll');

  // Elimina la clase "no-scroll" del body cuando se desmonta el componente
  return () => {
    document.body.classList.remove('no-scroll');
  };
}, []);
useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      
      document.body.classList.remove("modal-open");
      
    };
  }, []);
  const handleChangeImage = (index) => {
    setCurrentImageIndex(index);
    setCurrentFileId(selectedFileIds[index]);

    const fromContent = window.location.pathname.includes('/content');
    const fromImages = window.location.pathname.includes(`/images`);
    const fromHome = window.location.pathname.includes('/photo');

    if (fromHome) {
      navigate(`/photo/${selectedFileIds[index]}`);
    } else if (fromContent) {
      navigate(`/profilePage/${userId}/content/${selectedFileIds[index]}`);
    } else if (fromImages) {
      navigate(`/profilePage/${userId}/images/${selectedFileIds[index]}`);
    }
  };

  return (
    <div className="fullscreen-modalIM">
      <div className="modal-contentIM">
        <Carousel
          selectedItem={selectedImageIndex}
          showThumbs={false}
          showStatus={false}
          showIndicators={false}
          onChange={handleChangeImage}
        >
         {selectedImages.map((image, index) => (
          <div key={index} className="image-comments-wrapperIM">
            <div className="image-containerIM">
              {image.userId == currentUserId && (
                <div className="options-iconIM"> 
                <i
                  className="fa fa-ellipsis-h  "
                  onClick={(event) => handleOptionsClick(event)}
                ></i>
                </div>
              )}
              {dropdownVisible && (
                  <div className="options-dropdownIM">
                    <button
                      className="delete-buttonIM"
                      onClick={() => deleteImage(currentFileId)}
                    >
                      Delete Image
                    </button>
                    <button className="set-profile-pictureIM" onClick={handleSetProfilePicture}>
                     Set as profile picture

                    </button>
                  </div>
                )}
                <img src={image.url} alt="" />
              </div>
              
              <div className="comments-containerIM">
               <div className="reactionIM" >
                  <Reaction key={currentFileId} fileId={currentFileId} />
                </div>
                <div className="comment-sectionIM">
                  <CommentFile
                    fileId={currentFileId}
                    postOwner={image.username}
                    postDescription={
                      selectedImages.find((image) => image.id == currentFileId || image.imageId == currentFileId)?.description || "description of the photo or video"
                      ?.description || ""
                    }
                    postImage={image.profileImage}
                  />
                </div>
              </div>
              
            </div>
          ))}
        </Carousel>
        <button className="closeIM" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default ImageModal;

