import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../user_images/UserImages.css";
import VideoModal from '../video_modal/VideoModal';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const UserVideos = (props) => {
  const [videoUrls, setVideoUrls] = useState([]);
  const jwtToken = localStorage.getItem("jwtToken");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [videosToDisplay, setVideosToDisplay] = useState([]);

  useEffect(() => {
    fetchUserVideos();
  }, []);

  const fetchUserVideos = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/auth/${props.userId}/user-videos`, {
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

  useEffect(() => {
    setVideosToDisplay(videoUrls.slice(0, 3));
  }, [videoUrls]);

  const handleScroll = (e) => {
    const bottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;
    if (bottom) {
      const nextVideos = videoUrls.slice(
        videosToDisplay.length,
        videosToDisplay.length + 3
      );
      if (nextVideos.length > 0) {
        setVideosToDisplay((prevVideos) => [...prevVideos, ...nextVideos]);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const deleteVideo = async (videoId) => {
    try {
        await axios.delete(`http://localhost:8081/api/auth/user-files/${videoId}`, {
            headers: {
                'Authorization': 'Bearer ' + jwtToken
            }
        });
        fetchUserVideos(); // Vuelve a cargar los videos del usuario
        alert('Video eliminado con éxito.');
    } catch (error) {
        console.error('Error al eliminar el video:', error);
        alert('Error al eliminar el video. Inténtalo de nuevo.');
    }
  };
  const handleClickVideo = (url, videoId, index) => {
    setSelectedVideo({ url, videoId }); // Modifica la función
    setSelectedIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
    setSelectedIndex(null);
  };


/*
<button onClick={() => onDelete(fileId)}>
  Eliminar video
</button>*/
return (
  <div>
    <h1>Mis videos</h1>
    <div className="gallery-container">
      {videosToDisplay.map((url, index) => (
        <div key={index} className="gallery-item">
          <video
            src={url.url}
            alt={`Video del usuario ${index}`}
            onClick={() => handleClickVideo(url.url, url.videoId, index)}
            className="thumbnail"
            controls={false}
          />
          <button onClick={() => deleteVideo(url.videoId)}>
            Eliminar video
          </button>
          <div className="image-description">
            {url.description}
          </div>
        </div>
      ))}
    </div>
    {selectedVideo && (
      <VideoModal
        videos={videoUrls}
        selectedVideoIndex={selectedIndex}
        onClose={handleCloseModal}
        userId={props.userId}
        onDelete={deleteVideo}
      />
    )}
  </div>
);
};

export default UserVideos;