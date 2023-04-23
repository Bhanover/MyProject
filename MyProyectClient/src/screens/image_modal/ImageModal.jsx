import React from 'react';
import ReactImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import CommentFile from '../comment_file/CommentFile';
import UseUserInfo from '../user_profile/UseUserInfo';
import './ImageModal.css';

const ImageModal = ({ selectedImage, fileId, onClose, userId, onDelete }) => {
  const userInfo = UseUserInfo({ userId });

  return (
    <div className="fullscreen-modal">
      <div className="image-comment-section">
        <div className="image-section">
          <ReactImageGallery items={[{ original: selectedImage, thumbnail: selectedImage }]} showPlayButton={false} />
        </div>
        <div className="comment-section">
          <CommentFile fileId={fileId} postOwner={userInfo.username} postDescription="Descripción de la foto o video" />
        </div>
      </div>
      <button onClick={() => onDelete(fileId)}>Eliminar imagen</button>
      <button className="close" onClick={onClose}>×</button>
    </div>
  );
};

export default ImageModal;