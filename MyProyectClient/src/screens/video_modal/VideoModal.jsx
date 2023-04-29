import React, { useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CommentFile from "../comment_file/CommentFile";
import UseUserInfo from "../user_profile/UseUserInfo";
import "./VideoModal.css";

const VideoModal = ({ videos, selectedVideoIndex, onClose, userId, onDelete }) => {
  const userInfo = UseUserInfo({ userId });
  console.log('selectedVideoIndex:', selectedVideoIndex);
  console.log('videos:', videos);
  console.log('userId:',userId);
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
        >
          {videos.map((video, index) => (
            <div key={index} className="video-comments-wrapperV">
              <div className="video-containerV">
                <video src={video.url} controls width="100%">
                  Tu navegador no soporta la etiqueta <code>video</code>.
                </video>
                 <button className="delete-buttonV" onClick={() => onDelete(video.id ? video.id : video.videoId)}>Eliminar video</button>

              </div>
              {console.log("video.videoId----->",video.id)}
              <div className="comments-containerV">
                <div className="comment-sectionV">
                  <CommentFile
                      fileId={video.id ? video.id : video.videoId}

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
/*     <button className="delete-buttonV" onClick={() => onDelete(video.videoId)}>Eliminar video</button>*/
