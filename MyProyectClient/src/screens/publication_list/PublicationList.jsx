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
  const [lastPublicationRef, setLastPublicationRef] = useState(null);
  const [publicationsToDisplay, setPublicationsToDisplay] = useState([]);

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${props.userId}/publications`, {
        headers: { 'Authorization': 'Bearer ' + jwtToken },
      });
      setPublications(response.data);
      setPublicationsToDisplay(response.data.slice(0, 5));
    } catch (error) {
      console.error('Error al obtener las publicaciones:', error);
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
      throw new Error(`Error al obtener los comentarios de la publicación ${publicationId}`)}}

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
  };

  useEffect(() => {
    if (!lastPublicationRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting) {
          const nextPublications = publications.slice(
            publicationsToDisplay.length,
            publicationsToDisplay.length + 5
            );
            if (nextPublications.length > 0) {
            setPublicationsToDisplay((prevPublications) => [
            ...prevPublications,
            ...nextPublications,
            ]);
            }
            }
            },
            { threshold: 1.0 }
            );
            observer.observe(lastPublicationRef);

return () => {
  observer.disconnect();
};}, [lastPublicationRef, publications]);

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
{publicationsToDisplay.map((publication, index) => (
<li key={publication.id} ref={index === publicationsToDisplay.length - 1 ? setLastPublicationRef : null}>
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