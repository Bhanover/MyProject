import React from "react";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CommentFile from '../comment_file/CommentFile';
import UseUserInfo from '../user_profile/UseUserInfo';
import "./VideoModal.css"

const VideoModal = ({
  videos,
  selectedVideoIndex,
  onClose,
  userId,
  onDelete,
}) => {
  const userInfo = UseUserInfo({ userId });

  return (
    <div className="fullscreen-modalV">
      <div className="modal-content">
        <Carousel
          selectedItem={selectedVideoIndex}
          showThumbs={false}
          showStatus={false}
          showIndicators={false}
        >
          {videos.map((video, index) => (
            <div key={index} className="video-comments-wrapper">
              <div className="video-container">
                <video src={video.url} controls width="100%" height="400">
                  Tu navegador no soporta la etiqueta <code>video</code>.
                </video>
                <button className="delete-button" onClick={() => onDelete(video.videoId)}>Eliminar video</button>
              </div>
              <div className="comments-container">
                <div className="comment-sectionV">
                  <CommentFile
                    fileId={video.videoId}
                    postOwner={userInfo.username}
                    postDescription="Descripción del video"
                  />
                </div>
              </div>
            </div>
          ))}
        </Carousel>
        <button className="closeV" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default VideoModal;