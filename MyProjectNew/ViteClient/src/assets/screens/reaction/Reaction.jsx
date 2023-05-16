import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Reaction.css"

const Reaction = ({ fileId, publicationId }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const jwtToken = localStorage.getItem('jwtToken');
  
  useEffect(() => {
    fetchReactions();
  }, []);

  const fetchReactions = async () => {
    try {
      setLoading(true);
      
      const likeResponse = fileId
        ? await axios.get(`http://localhost:8081/api/auth/count/LIKE/file/${fileId}`, {
            headers: {
              'Authorization': 'Bearer ' + jwtToken,
            },
          })
        : await axios.get(`http://localhost:8081/api/auth/count/LIKE/publication/${publicationId}`, {
            headers: {
              'Authorization': 'Bearer ' + jwtToken,
            },
          });

      const dislikeResponse = fileId
        ? await axios.get(`http://localhost:8081/api/auth/count/DISLIKE/file/${fileId}`, {
            headers: {
              'Authorization': 'Bearer ' + jwtToken,
            },
          })
        : await axios.get(`http://localhost:8081/api/auth/count/DISLIKE/publication/${publicationId}`, {
            headers: {
              'Authorization': 'Bearer ' + jwtToken,
            },
          });

      setLikeCount(likeResponse.data);
      setDislikeCount(dislikeResponse.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener reacciones:', error);
      setLoading(false);
      alert('Error al obtener reacciones. Inténtalo de nuevo.');
    }
  };

  const handleReaction = async (type) => {
    try {
      await axios.post(`http://localhost:8081/api/auth/${type === 'LIKE' ? 'like' : 'dislike'}`, null, {
        headers: {
          'Authorization': 'Bearer ' + jwtToken,
        },
        params: {
          fileId: fileId,
          publicationId: publicationId,
        },
      });

      fetchReactions();
    } catch (error) {
      console.error('Error al procesar la reacción:', error);
      alert('Error al procesar la reacción. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="reaction-container">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <>
          <button className="like-button" onClick={() => handleReaction('LIKE')}>
            <i className="fa fa-thumbs-up" aria-hidden="true"></i> 
          </button>
          <span>{likeCount}</span>
          <button className="dislike-button" onClick={() => handleReaction('DISLIKE')}>
            <i className="fa fa-thumbs-down" aria-hidden="true"></i> 
          </button>
          <span>{dislikeCount}</span>
        </>
      )}
    </div>
  );
};

export default Reaction;
