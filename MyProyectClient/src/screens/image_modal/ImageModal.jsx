import React from 'react';
import CommentFile from '../comment_file/CommentFile';
import UseUserInfo from '../user_profile/UseUserInfo';
const ImageModal = ({ selectedImage, fileId, onClose, userId , onDelete }) => {

  const userInfo = UseUserInfo({ userId });
  console.log(fileId);
  return (
    <div className="modal">
      <button onClick={() => onDelete(fileId)}>
  Eliminar imagen
</button>
      <button className="close" onClick={onClose}>×</button>
      <div className="image-and-comment-container">
        <div className="image-container">
          <img src={selectedImage} alt="Imagen seleccionada" />
        </div>
        <div className="comment-container">
        <CommentFile fileId={fileId} postOwner={userInfo.username} postDescription="Descripción de la foto o video" />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
