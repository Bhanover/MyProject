import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CommentFile from "../comment_file/CommentFile";
import UseUserInfo from "../user_profile/UseUserInfo";
import "./ImageModal.css";

const ImageModal = ({
  selectedImages,
  selectedFileIds,
  fileId,
  onClose,
  userId,
  onDelete,
  onSetProfilePicture,
  selectedImageIndex,
}) => {
  console.log('selectedImages:', selectedImages);
  console.log('selectedFileIds:', selectedFileIds);
  console.log('fileId:', fileId);
  console.log('selectedImageIndex:', selectedImageIndex);
  const userInfo = UseUserInfo({ userId });
  const [currentImageIndex, setCurrentImageIndex] = useState(selectedImageIndex);
  const [currentFileId, setCurrentFileId] = useState(fileId);

  const handleSetProfilePicture = () => {
    onSetProfilePicture(currentFileId);
    onClose();
  };

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  return (
    <div className="fullscreen-modalM">
      <div className="modal-contentM">
        <Carousel
          selectedItem={selectedImageIndex}
          showThumbs={false}
          showStatus={false}
          showIndicators={false}
          onChange={index => {
            setCurrentImageIndex(index);
            setCurrentFileId(selectedFileIds[index]);
          }}
        >
          {selectedImages.map((image, index) => (
            <div key={index} className="image-comments-wrapperM">
              <div className="image-containerM">
                <img src={image.url} alt="" />
                <button
                  className="delete-buttonM"
                  onClick={() => onDelete(currentFileId)}
                >
                  Eliminar imagen
                </button>
              </div>
              <div className="comments-containerM">
                <div className="comment-sectionM">
                  <CommentFile
                    fileId={currentFileId}
                    postOwner={userInfo.username}
                    postDescription="Descripción de la foto o video"
                  />
                </div>
              </div>
            </div>
          ))}
        </Carousel>
        <button className="closeM" onClick={onClose}>
          ×
        </button>
        <button className="set-profile-pictureM" onClick={handleSetProfilePicture}>
          Establecer como foto de perfil
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
