import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ErrorBoundary } from 'react-error-boundary';
import CommentPublication from '../comment_publication/CommentPublication';
import './PublicationList.css';

const API_BASE_URL = 'http://localhost:8081/api/auth';

const PublicationList = (props) => {
  const [publications, setPublications] = useState([]);
  const [newPublicationText, setNewPublicationText] = useState('');
  const jwtToken = localStorage.getItem('jwtToken');
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${props.userId}/publications`, {
        headers: { 'Authorization': 'Bearer ' + jwtToken },
      });
      setPublications(response.data);
    } catch (error) {
      console.error('Error al obtener las publicaciones:', error);
      // Lanzar el error para que sea capturado por el ErrorBoundary
      throw new Error('Error al obtener las publicaciones. Inténtalo de nuevo.');
    }
  };

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken');

    axios
      .get(`http://localhost:8081/api/auth/user/${props.userId}/info`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then((response) => {
        setUserInfo(response.data);
      })
      .catch((error) => {
        console.error(error);
        // Lanzar el error para que sea capturado por el ErrorBoundary
        throw new Error('Error al obtener la información del usuario. Inténtalo de nuevo.');
      });
  }, []);

  const handleCreatePublication = async () => {
    try {
      const publicationDTO = { content: newPublicationText };
      const response = await axios.post(`${API_BASE_URL}/publication`, publicationDTO, {
        headers: { Authorization: 'Bearer ' + jwtToken },
      });
      console.log(response.status, response.data);
      setPublications([...publications, response.data]);
      setNewPublicationText('');
    } catch (error) {
      console.error('Error al crear la publicación:', error);
      // Lanzar el error para que sea capturado por el ErrorBoundary
      throw new Error('Error al crear la publicación. Inténtalo de nuevo.');
    }
  };

  const fetchComments = async (publicationId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/publications/${publicationId}/comments`, {
        headers: { 'Authorization': 'Bearer ' + jwtToken },
      });
      return response.data;
    } catch (error) {
      console.error(`Error al obtener los comentarios de la publicación ${publicationId}:`, error);
      // Lanzar el error para que sea capturado por el ErrorBoundary
      throw new Error(`Error al obtener los comentarios de la publicación ${publicationId}`)}}

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
  };

  return (
    <div className='publicationM'>
      <h1>Publicaciones</h1>
      <div className='new-publication'>
        <input
          type='text'
          value={newPublicationText}
          onChange={(e) => setNewPublicationText(e.target.value)}
          placeholder='Escribe tu nueva publicación'
        />
        <button onClick={handleCreatePublication}>Crear Publicación</button>
      </div>
      <div className='publications-list'>
        <ul>
          {publications.map((publication) => (
            <li key={publication.id}>
              <div className='publication-user'>
                <img src={userInfo.profileImage} alt='Profile' />
              </div>
              <p>{userInfo.username}</p>
              <p>{publication.content}</p>
              <span className='publication-date'>
                Publicado el {formatDate(publication.creationTime)}
              </span>
              <CommentPublication publicationId={publication.id} jwtToken={jwtToken} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PublicationList;