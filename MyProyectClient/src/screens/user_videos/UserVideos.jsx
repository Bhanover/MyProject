import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./UserVideos.css";

const UserVideos = () => {
  const [videoUrls, setVideoUrls] = useState([]);
  const jwtToken = localStorage.getItem("jwtToken");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    fetchUserVideos();
  }, []);

  const fetchUserVideos = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/auth/user-videos', {
        headers: {
          'Authorization': 'Bearer ' + jwtToken
        }
      });
      setVideoUrls(response.data);
      console.log(jwtToken)
    } catch (error) {
      console.error('Error al obtener los videos del usuario:', error.response.data);
      alert('Error al obtener los videos del usuario. Inténtalo de nuevo.');
    }
  };

  const deleteVideo = async (videoId) => {
    try {
      await axios.delete(`http://localhost:8081/api/auth/user-videos/${videoId}`, {
        headers: {
          'Authorization': 'Bearer ' + jwtToken
        }
      });
      fetchUserVideos();
      alert('Video eliminado con éxito.');
    } catch (error) {
      console.error('Error al eliminar el video:', error);
      alert('Error al eliminar el video. Inténtalo de nuevo.');
    }
  };

  const handleClickVideo = (url, index) => {
    setSelectedVideo(url);
    setSelectedIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
    setSelectedIndex(null);
  };

  const handleNextVideo = () => {
    setSelectedIndex((selectedIndex + 1) % videoUrls.length);
    setSelectedVideo(videoUrls[(selectedIndex + 1) % videoUrls.length]);
  };

  const handlePrevVideo = () => {
    setSelectedIndex((selectedIndex - 1 + videoUrls.length) % videoUrls.length);
    setSelectedVideo(videoUrls[(selectedIndex - 1 + videoUrls.length) % videoUrls.length]);
  };

  return (
    <div>
      <h1>Mis videos</h1>
      {videoUrls.map((url, index) => (
        <div key={index} className="thumbnail-wrapper">
          <video 
            src={url.url} // Accede a la propiedad "url" del objeto "url"
            alt={`Video del usuario ${index}`}
            onClick={() => handleClickVideo(url.url, index)} // Pasa la URL como parámetro a la función "handleClickVideo"
            className="thumbnail"
          />
          <button onClick={() => deleteVideo(url.id)}>
            Eliminar video
          </button>
        </div>
      ))}
      {selectedVideo && (
        <div className="modal">
          <button className="close" onClick={handleCloseModal}> ×</button>
          <button className="prev" onClick={handlePrevVideo}>

          </button>
          <button className="next" onClick={handleNextVideo}>

          </button>
          <video src={selectedVideo} controls autoPlay width="500" height="400">
            Tu navegador no soporta la etiqueta <code>video</code>.
          </video>
        </div>
      )}
    </div>
  );
};

export default UserVideos;