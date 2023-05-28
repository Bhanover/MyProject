import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CommentFile from "../comment_file/CommentFile";
import "./VideoModal.css";
import Reaction from "../reaction/Reaction";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/*VideoModal recibe como props una lista de vídeos, un índice del vídeo seleccionado, 
una función para cerrar el modal y una función para refrescar los vídeos.*/
const VideoModal = ({ videos, selectedVideoIndex, onClose, onRefresh ,userId}) => {
/*Se mantiene el índice del vídeo actual (currentVideoIndex), el ID del vídeo actual (currentVideoId), 
y el índice de la opción de desplegable visible (dropdownVisibleIndex).*/
  const [currentVideoIndex, setCurrentVideoIndex] = useState(selectedVideoIndex);
  const [currentVideoId, setCurrentVideoId] = useState(videos[selectedVideoIndex]?.id || videos[selectedVideoIndex]?.videoId);
  const [dropdownVisibleIndex, setDropdownVisibleIndex] = useState(null);
  const currentUserId = localStorage.getItem("idP");
  const navigate = useNavigate(); 
  /*cambia el índice del desplegable visible cuando se hace click en las opciones de un vídeo.*/
  const handleOptionsClick = (event, index) => {
    event.preventDefault();
    event.stopPropagation();
    setDropdownVisibleIndex(index === dropdownVisibleIndex ? null : index);
  };

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  /*se encarga de eliminar un vídeo a través de una solicitud DELETE a una API.*/
  const deleteVideo = async (videoId) => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      await axios.delete(`http://localhost:8081/api/auth/user-files/${videoId}`, {
        headers: {
          'Authorization': 'Bearer ' + jwtToken
        }
      });
      onRefresh(); 

      onClose();
      alert('Video eliminado con éxito.');
    } catch (error) {
      console.error('Error al eliminar el video:', error);
      alert('Error al eliminar el video. Inténtalo de nuevo.');
    }
  };

  const handleChangeVideo = (index) => {
    setCurrentVideoIndex(index);
    setCurrentVideoId(videos[index]?.id || videos[index]?.videoId);
  
    const fromContent = window.location.pathname.includes('/content');
    const fromVideos = window.location.pathname.includes('/videos');
    const fromHome = window.location.pathname.includes('/watchV');

    if (fromContent) {
      navigate(`/profilePage/${userId}/content/${videos[index]?.id || videos[index]?.videoId}`);
    } else if (fromVideos){
      navigate(`/profilePage/${userId}/videos/${videos[index]?.id || videos[index]?.videoId}`);

    } else if (fromHome){
      navigate(`/watchV/${videos[index]?.id || videos[index]?.videoId}`);

    }
  };


  return (
    <div className="fullscreen-modalIM">
      <div className="modal-contentIM">
        <Carousel
          selectedItem={selectedVideoIndex}
          showThumbs={false}
          showStatus={false}
          showIndicators={false}
          onChange={handleChangeVideo}

        >
          {videos.map((video, index) => (
            <div key={index} className="image-comments-wrapperIM">
              <div className="video-containerIV">
                <video src={video.url} controls >
                  Tu navegador no soporta la etiqueta <code>video</code>.
                </video>
                {video.userId == currentUserId && (
                  <div className="options-iconIM">
                  <i
                    className="fa fa-ellipsis-h  "
                    onClick={(event) => handleOptionsClick(event, index)}
                  ></i>
                  </div>
                )}
                {dropdownVisibleIndex === index && (
                  <div className="options-dropdownIM">
                    <button
                  className="delete-buttonIM"
                  onClick={() => deleteVideo(currentVideoId)}
                >
                  Eliminar video
                </button>
                  </div>
                )}
              </div>
              <div className="comments-containerIM">
            <div className="reactionIM" >
              <Reaction key={currentVideoId} fileId={currentVideoId} />
            </div>
            <div className="comment-sectionIM">
            <CommentFile
            fileId={video.id ? video.id : video.videoId}
            postOwner={video.username}
            postDescription={videos[currentVideoIndex]?.description || ""}
            postImage={video.profileImage}
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

export default VideoModal;