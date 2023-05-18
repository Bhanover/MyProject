import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Reaction.css"
/*: El componente Reaction acepta fileId y publicationId como props*/
const Reaction = ({ fileId, publicationId }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const jwtToken = localStorage.getItem('jwtToken');
  
  useEffect(() => {
    fetchReactions();
  }, []);
  /* Esta función realiza solicitudes HTTP GET a la API para
   obtener el número de "me gusta" y "no me gusta" para la publicación o el archivo especificado. */
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
          /*likeCount y dislikeCount representan el número de "me gusta" y "no me gusta" */
      setLikeCount(likeResponse.data);
      setDislikeCount(dislikeResponse.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener reacciones:', error);
      setLoading(false);
      alert('Error al obtener reacciones. Inténtalo de nuevo.');
    }
  };
  /*Esta función acepta un tipo de reacción ("LIKE" o "DISLIKE") y realiza una solicitud HTTP POST*/
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
