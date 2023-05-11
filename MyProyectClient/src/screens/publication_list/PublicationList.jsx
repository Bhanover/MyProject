import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentPublication from "../comment_publication/CommentPublication"
import "./PublicationList.css"
import Reaction from '../reaction/Reaction';
import { Link } from 'react-router-dom';
const API_BASE_URL = 'http://localhost:8081/api/auth';

const PublicationList = (props) => {
  const [publications, setPublications] = useState([]);
  const jwtToken = localStorage.getItem('jwtToken');
  const [userId,setUserId] =  useState("");
  const [newContent, setNewContent] = useState("");
  const [editingPublicationId, setEditingPublicationId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleOptionsClick = (event) => {
    event.preventDefault(); // Añade esta línea para prevenir el comportamiento predeterminado del navegador
    setDropdownVisible(!dropdownVisible);
  };
  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${props.userId}/publications`, {
      headers: { 'Authorization': 'Bearer ' + jwtToken },
    });
    
    const fetchedPublications = await Promise.all(
      response.data.map(async (publication) => {
        const authorResponse = await axios.get(`${API_BASE_URL}/user/${publication.userId}/info`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });

        return {
          ...publication,
          authorProfileImage: authorResponse.data.profileImage,
        };
      })
    );

    setPublications(fetchedPublications);
    console.log(fetchedPublications);
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
      <form onSubmit={(event) => {
  event.preventDefault();
  createPublication({ content: newContent });
  setNewContent(''); // Agrega esta línea para limpiar el contenido del input
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
    <div className="publication-authorPL">
      <Link to={`/profilePage/${publication.userId}`}>
        <img
          className="profile-imagePL"
          src={publication.authorProfileImage}
          alt="Profile"
        />
      </Link>
    </div>
    <p>{publication.content}</p>
            <div className="reactionPL">
            <Reaction publicationId={publication.id}  />
            </div>
 
            <span className="publication-datePL">
              Publicado el {new Date(publication.creationTime).toLocaleDateString('es-ES')}
             </span>
          
            {editingPublicationId === publication.id ? (
              <form onSubmit={(event) => {
                event.preventDefault();
                updatePublication(publication.id, { content: editingContent });
                setEditingPublicationId(null);
              }}>
                
                <input
                  placeholder="Contenido"
                  value={editingContent}
                  onChange={(event) => setEditingContent(event.target.value)}
                />
                <button type="submit">Guardar</button>
                <button onClick={() => setEditingPublicationId(null)}>Cancelar</button>
              </form>
              
            ) : (
              <div className="options-container">          
  <button className="options-button"  onClick={(event) => handleOptionsClick(event)}>
    <i className="fas fa-ellipsis-v"></i>
    <div className="dropdown-menu">
      <div
        className="dropdown-item"
        onClick={() => deletePublication(publication.id)}
      >
        Eliminar
      </div>
      <div
        className="dropdown-item"
        onClick={() => {
          setEditingContent(publication.content);
          setEditingPublicationId(publication.id);
        }}
      >
        Actualizar
      </div>
    </div>
  </button>
</div>
            )}
            <CommentPublication publicationId={publication.id} userId={props.userId} />
 
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicationList;
