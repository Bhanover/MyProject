import React, { useState } from "react";
import ReactImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import CommentFile from '../comment_file/CommentFile';
import UseUserInfo from '../user_profile/UseUserInfo';
import './ImageModal.css';

const ImageModal = ({
  selectedImages,
  selectedFileIds,
  fileId,
  onClose,
  userId,
  onDelete,
  onSetProfilePicture,
  selectedImageIndex, // Agrega esta línea
}) => {
  const userInfo = UseUserInfo({ userId });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentFileId, setCurrentFileId] = useState(fileId); // Agrega este estado

  const handleSetProfilePicture = () => {
    onSetProfilePicture(currentFileId); // Reemplaza fileId con currentFileId
    onClose();
  };
  const handleSlide = (currentIndex) => {
    setCurrentImageIndex(currentIndex);
    setCurrentFileId(selectedFileIds[currentIndex]);
  };
  // Convierte selectedImages a un array de objetos compatibles con ReactImageGallery
  const galleryImages = selectedImages.map((image) => ({
    original: image.url,
    thumbnail: image.url,
  }));
  return (
    <div className="fullscreen-modalM">
      <div className="image-comment-sectionM">
        <div className="image-sectionM">
        <ReactImageGallery
        items={galleryImages}
        showPlayButton={false}
        startIndex={selectedImageIndex} // Reemplaza 'currentImageIndex' con 'selectedImageIndex'
        onThumbnailClick={(event, index) => setCurrentImageIndex(index)}
        onSlide={handleSlide}
      />
          <div className="button-containerM">
            <button onClick={() => onDelete(currentFileId)}>Eliminar imagen</button>
            <button onClick={handleSetProfilePicture}>
              Establecer como foto de perfil
            </button>
            <button className="close" onClick={onClose}>
        ×
      </button>
          </div>
        </div>
        <div className="comment-sectionM">
          <CommentFile
            fileId={currentFileId} // Reemplaza fileId con currentFileId
            postOwner={userInfo.username}
            postDescription="Descripción de la foto o video"
          />
        </div>
      </div>
     
    </div>
  );
  
};


export default ImageModal;