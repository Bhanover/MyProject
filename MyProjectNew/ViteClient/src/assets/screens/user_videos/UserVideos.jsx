import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../user_images/UserImages.css";
import VideoModal from '../video_modal/VideoModal';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./UserVideos.css"
import { useParams, useNavigate } from "react-router-dom";

const UserVideos = (props) => {
  const [videoUrls, setVideoUrls] = useState([]);
  const jwtToken = localStorage.getItem("jwtToken");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /*    fetchUserVideos se utiliza para mostrar una galería de videos subidos por el usuario.*/
  useEffect(() => {
    fetchUserVideos();
  }, []);

  const fetchUserVideos = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:8081/api/auth/${ userId }/user-videos`, {
        headers: {
          'Authorization': 'Bearer ' + jwtToken
        }
      });
      /*sortedVideos Se utiliza para ordenar las imagenes por la fecha de creacion*/

      const sortedVideos = response.data.sort((a, b) => new Date(b.creationTime) - new Date(a.creationTime));

      setVideoUrls(sortedVideos);
      console.log(sortedVideos);
      setLoading(false);

    } catch (error) {
      console.error('Error al obtener los videos del usuario:', error.response.data);
      alert('Error al obtener los videos del usuario. Inténtalo de nuevo.');
    }
  };
  /*El método refreshVideos llama a fetchUserVideos, permitiendo recargar los videos.*/
  const refreshVideos = () => {
    fetchUserVideos();
  };
  const clearUrl = () => {
    navigate(`/profilePage/${userId}/videos`);
  };
  /*La función handleClickVideo se utiliza para establecer el video seleccionado y el índice
   seleccionado, que se usan para mostrar el video en un modal.*/
  const handleClickVideo = (url, videoId, index, description) => {
    setSelectedVideo({ url, videoId, description });
    setSelectedIndex(index);
    navigate(`/profilePage/${userId}/videos/${videoId}`);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
    setSelectedIndex(null);
    clearUrl();
  };

  return (
    <div className='imgContainerUI'>
       {loading ? (
      <div className="loader-container">
        <div className="loader"></div>
        </div>
      ) : (
                  <>
                <h1>Videos</h1>
                <div className="gallery-containerUI">
                {videoUrls.map((video, index) => (
            <div key={index} className="gallery-itemUI">
              <video
                src={video.url}
                alt={`Video del usuario ${index}`}
                onClick={() => handleClickVideo(video.url, video.videoId, index, video.description)}
                className="thumbnailUI"
                controls={false}
              />
            </div>
          ))}
                </div>
                {selectedVideo && (
            <VideoModal
              videos={videoUrls}
              selectedVideo={selectedVideo}
              selectedVideoIndex={selectedIndex}
              onClose={handleCloseModal}
              userId={userId}
              onRefresh={refreshVideos} 
            />
          )}
                  </>
              )}
              </div>
        );
    }

export default UserVideos;