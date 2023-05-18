import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CommentFile from "../comment_file/CommentFile";
import "./VideoModal.css";
import Reaction from "../reaction/Reaction";
import axios from 'axios';
/*VideoModal recibe como props una lista de vídeos, un índice del vídeo seleccionado, 
una función para cerrar el modal y una función para refrescar los vídeos.*/
const VideoModal = ({ videos, selectedVideoIndex, onClose, onRefresh }) => {
/*Se mantiene el índice del vídeo actual (currentVideoIndex), el ID del vídeo actual (currentVideoId), 
y el índice de la opción de desplegable visible (dropdownVisibleIndex).*/
  const [currentVideoIndex, setCurrentVideoIndex] = useState(selectedVideoIndex);
  const [currentVideoId, setCurrentVideoId] = useState(videos[selectedVideoIndex]?.id || videos[selectedVideoIndex]?.videoId);
  const [dropdownVisibleIndex, setDropdownVisibleIndex] = useState(null);
  const currentUserId = localStorage.getItem("idP");
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
      onRefresh(); // Agrega esta línea

      onClose();
      alert('Video eliminado con éxito.');
    } catch (error) {
      console.error('Error al eliminar el video:', error);
      alert('Error al eliminar el video. Inténtalo de nuevo.');
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
          onChange={index => {
            setCurrentVideoIndex(index);
            setCurrentVideoId(videos[index]?.id || videos[index]?.videoId);
            
          }}
        >
          {videos.map((video, index) => (
            <div key={index} className="image-comments-wrapperIM">
              <div className="video-containerIV">
                <video src={video.url} controls >
                  Tu navegador no soporta la etiqueta <code>video</code>.
                </video>
                {video.userId == currentUserId && (
                  <i
                    className="fa fa-ellipsis-h options-iconIM"
                    onClick={(event) => handleOptionsClick(event, index)}
                  ></i>
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
            postDescription={videos[currentVideoIndex]?.description || "Description of the photo or video"}
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