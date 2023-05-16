import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../user_images/UserImages.css";
import VideoModal from '../video_modal/VideoModal';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./UserVideos.css"
import { useParams } from "react-router-dom";

const UserVideos = (props) => {
  const [videoUrls, setVideoUrls] = useState([]);
  const jwtToken = localStorage.getItem("jwtToken");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);

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
      setVideoUrls(response.data);
      console.log(response.data)
      setLoading(false);

    } catch (error) {
      console.error('Error al obtener los videos del usuario:', error.response.data);
      alert('Error al obtener los videos del usuario. Inténtalo de nuevo.');
    }
  };
  const refreshVideos = () => {
    fetchUserVideos();
  };

  const handleClickVideo = (url, videoId, index) => {
    setSelectedVideo({ url, videoId });
    setSelectedIndex(index);
    
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
    setSelectedIndex(null);
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
        {videoUrls.map((url, index) => (
          <div key={index} className="gallery-itemUI">
            <video
              src={url.url}
              alt={`Video del usuario ${index}`}
              onClick={() => handleClickVideo(url.url, url.videoId, index)}
              className="thumbnailUI"
              controls={false}
            />
           
          </div>
        ))}
      </div>
      {selectedVideo && (
        <VideoModal
          videos={videoUrls}
          selectedVideoIndex={selectedIndex}
          onClose={handleCloseModal}
          userId={ userId }
          onRefresh={refreshVideos} // Agrega esta línea

        />
        )}
        </>
    )}
    </div>
  );
    }

export default UserVideos;