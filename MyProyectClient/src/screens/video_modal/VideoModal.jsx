import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CommentFile from "../comment_file/CommentFile";
import UseUserInfo from "../user_profile/UseUserInfo";
import "./VideoModal.css";
import Reaction from "../reaction/Reaction";
const VideoModal = ({ videos, selectedVideoIndex, onClose, userId, onDelete }) => {
  const userInfo = UseUserInfo({ userId });
  const [currentVideoIndex, setCurrentVideoIndex] = useState(selectedVideoIndex);
  const [currentVideoId, setCurrentVideoId] = useState(videos[selectedVideoIndex]?.id || videos[selectedVideoIndex]?.videoId);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleOptionsClick = (event) => {
    event.preventDefault(); // Añade esta línea para prevenir el comportamiento predeterminado del navegador
    event.stopPropagation(); // Añade esta línea para detener la propagación del evento
    setDropdownVisible(!dropdownVisible);
  };

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  return (
    <div className="fullscreen-modalV">
      <div className="modal-contentV">
        <Carousel
          selectedItem={selectedVideoIndex}
          showThumbs={false}
          showStatus={false}
          showIndicators={false}
          onChange={index => {
            setCurrentVideoIndex(index);
            setCurrentVideoId(videos[index]?.id || videos[index]?.videoId);
          }}
        >
          {videos.map((video, index) => (
            <div key={index} className="video-comments-wrapperV">
              <div className="video-containerV">
                <video src={video.url} controls width="100%">
                  Tu navegador no soporta la etiqueta <code>video</code>.
                </video>
       <i
  className="fa fa-ellipsis-h options-iconM"
  onClick={(event) => handleOptionsClick(event)}
></i>                 {dropdownVisible && (
                  <div className="options-dropdownV">
                    <button
                      className="delete-buttonV"
                      onClick={() => onDelete(currentVideoId)}
                    >
                      Eliminar video
                    </button>
                  </div>
                )}
              </div>
              <div className="comments-containerV">
              <Reaction key={currentVideoId} fileId={currentVideoId} />

                <div className="comment-sectionV">
                  <CommentFile
                    fileId={video.id ? video.id : video.videoId}
                    postOwner={video.username}
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
/*     <button className="delete-buttonV" onClick={() => onDelete(video.videoId)}>Eliminar video</button>*/
