import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentPublication from "../comment_publication/CommentPublication"
import "./PublicationList.css"
const API_BASE_URL = 'http://localhost:8081/api/auth';

const PublicationList = (props) => {
  const [publications, setPublications] = useState([]);
  const jwtToken = localStorage.getItem('jwtToken');
  const [userId,setUserId] =  useState("");
  const [newContent, setNewContent] = useState("");
  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${props.userId}/publications`, {
        headers: { 'Authorization': 'Bearer ' + jwtToken },
      });
      setPublications(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error al obtener las publicaciones:', error);
      throw new Error('Error al obtener las publicaciones. Inténtalo de nuevo.');
    }
  };

  const createPublication = async (publicationDTO) => {
    try {
      await axios.post(`${API_BASE_URL}/publication`, publicationDTO, {
        headers: { 'Authorization': 'Bearer ' + jwtToken },
      });
      // Actualiza la lista de publicaciones después de crear una nueva
      fetchPublications();
    } catch (error) {
      console.error('Error al crear la publicación:', error);
      throw new Error('Error al crear la publicación. Inténtalo de nuevo.');
    }
  };

  
  const deletePublication = async (publicationId) => {
    try {
      await axios.delete(`${API_BASE_URL}/publication/${publicationId}`, {
        headers: { 'Authorization': 'Bearer ' + jwtToken },
      });
      setPublications(publications.filter((publication) => publication.id !== publicationId));
    } catch (error) {
      console.error('Error al eliminar la publicación:', error);
      throw new Error('Error al eliminar la publicación. Inténtalo de nuevo.');
    }
  };

  const updatePublication = async (publicationId, publicationDTO) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/publication/${publicationId}`, publicationDTO, {
        headers: { 'Authorization': 'Bearer ' + jwtToken },
      });
      setPublications(publications.map((publication) => publication.id === publicationId ? response.data : publication));
    } catch (error) {
      console.error('Error al actualizar la publicación:', error);
      throw new Error('Error al actualizar la publicación. Inténtalo de nuevo.');
    }
  };
  return (
    <div className="publication-listPL">
      <h2>Lista de Publicaciones</h2>
      
      <div className="new-publication-form">
        <h3>Crear nueva publicación</h3>
        <form onSubmit={(event) => {
          event.preventDefault();
          createPublication({ content: newContent });
        }}>
          <input
           placeholder="Contenido"
           value={newContent}
           onChange={(event) => setNewContent(event.target.value)}
          />
          <button type="submit">Crear</button>
        </form>
      </div>
      <div className="publicationsPL">
        {publications.map((publication) => (
          <div key={publication.id} className="publicationPL">
            <h3>{publication.title}</h3>
            <p>{publication.content}</p>
            <span className="publication-datePL">
              Publicado el {new Date(publication.creationTime).toLocaleDateString('es-ES')}
            </span>
            <button onClick={() => deletePublication(publication.id)}>Eliminar</button>
            <button onClick={() => updatePublication(publication.id, {/* Aquí van los datos actualizados de la publicación */})}>Actualizar</button>

            <CommentPublication publicationId={publication.id} userId={props.userId} />
          </div>
          
        ))}
      </div>
    </div>
  );
};

export default PublicationList;
