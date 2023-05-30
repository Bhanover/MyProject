import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentPublication from "../comment_publication/CommentPublication"
import "./PublicationList.css"
import Reaction from '../reaction/Reaction';
import { Link } from 'react-router-dom';
import { useProfileImage } from '../../../ProfileImageContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
const API_BASE_URL = 'http://localhost:8081/api/auth';
import { useParams } from "react-router-dom";
/* useParams es un hook de react-router-dom que devuelve 
los parámetros de ruta de la URL actual. 
useProfileImage es un hook personalizado para obtener la imagen de perfil del usuario.*/
const PublicationList = (props) => {
  const [publications, setPublications] = useState([]);
  const jwtToken = localStorage.getItem('jwtToken');
  const [newContent, setNewContent] = useState("");
  const [editingPublicationId, setEditingPublicationId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const { userId } = useParams();
  const { profileImage } = useProfileImage();
  const [loading, setLoading] = useState(true);

  const currentUserId = localStorage.getItem("idP");
  /* Esto se usa para controlar la visibilidad del menú desplegable de cada publicación.*/
  const handleOptionsClick = (publicationId) => {
    if (dropdownVisible === publicationId) {
      setDropdownVisible(null);
    } else {
      setDropdownVisible(publicationId);
    }
  };
  /*Se llama dentro de un useEffect para que se ejecute cuando se monta el componente.*/
  useEffect(() => {
    fetchPublications();
  }, []);
  /* Esta función se utiliza para obtener las publicaciones del servidor*/
  const fetchPublications = async () => {
    setLoading(true);
  
    try {
      const response = await axios.get(`${API_BASE_URL}/${userId}/publications`, {
        headers: { 'Authorization': 'Bearer ' + jwtToken },
      });
      /*sortedPublications sirve para ordenar por fecha de creación*/
      const sortedPublications = response.data.sort((a, b) => {
        return new Date(b.creationTime) - new Date(a.creationTime);
      });
  
      setPublications(sortedPublications);
      setLoading(false);
  
    } catch (error) {
      console.error('Error al obtener las publicaciones:', error);
      throw new Error('Error al obtener las publicaciones. Inténtalo de nuevo.');
    }
  };

  /*Esta función realiza solicitudes HTTP para crear una publicación */
  const createPublication = async (publicationDTO) => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/publication`, publicationDTO, {
        headers: { 'Authorization': 'Bearer ' + jwtToken },
      });
      // Actualiza la lista de publicaciones después de crear una nueva
      fetchPublications();
      setLoading(false);

    } catch (error) {
      console.error('Error al crear la publicación:', error);
      throw new Error('Error al crear la publicación. Inténtalo de nuevo.');
    }
  };

  /*Esta función realiza solicitudes HTTP para borrar una publicación */
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
  /*Esta función realiza solicitudes HTTP para editar una publicación */
  const updatePublication = async (publicationId, publicationDTO) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/publication/${publicationId}`, publicationDTO, {
        headers: { 'Authorization': 'Bearer ' + jwtToken },
      });
      setPublications(publications.map((publication) => publication.id === publicationId ? response.data : publication));
      fetchPublications();

    } catch (error) {
      console.error('Error al actualizar la publicación:', error);
      throw new Error('Error al actualizar la publicación. Inténtalo de nuevo.');
    }
  };

  
  return (
    <div className="publication-listPL">
        {loading ? (
      <div className="loader-container">
        <div className="loader"></div>
        </div>
      ) : (
        <>
      <h2>Publications</h2>
      {currentUserId == userId && (
    
      <div className="new-publication-formPL">
      <form onSubmit={(event) => {
          event.preventDefault();
          createPublication({ content: newContent });
          setNewContent(''); 
        }}>
          <input
           placeholder="ContenidoPL"
           value={newContent}
           onChange={(event) => setNewContent(event.target.value)}
          />
          <button type="submit">Create</button>
        </form>
        
      </div>
       )} 
      <div className="publicationsPL">
      {publications.map((publication) => (
  <div key={publication.id} className="publicationPL">
    <div className="publication-authorPL">
      <Link to={`/profilePage/${publication.userId}`}>
      <img className="profile-imagePL" src={publication.profileImageUrl || profileImage    } alt="Profile" />

      </Link>
      <p>{publication.username}</p>
    </div>
    <p>{publication.content}</p>
            
            <Reaction publicationId={publication.id} className="reactionPL" />
         
 
            <span className="publication-datePL">
            posted on {new Date(publication.creationTime).toLocaleDateString('es-ES')}
             </span>
          
             {editingPublicationId === publication.id ? (
    <form onSubmit={(event) => {
      event.preventDefault();
      updatePublication(publication.id, { content: editingContent });
      setEditingPublicationId(null);
    }}>
      
      <input
        placeholder="ContenidoPL"
        value={editingContent}
        onChange={(event) => setEditingContent(event.target.value)}
      />
          <button type="submit"><FontAwesomeIcon icon={faSave} /></button>
          <button onClick={() => setEditingPublicationId(null)}><FontAwesomeIcon icon={faTimes} /></button>
        </form>
                    
              ) : (
                                <div className="options-containerPL">          
                    {publication.userId == currentUserId && (
              <button
                className="options-buttonPL"
                onClick={() => handleOptionsClick(publication.id)}
              >
                <i className="fas fa-ellipsis-v"></i>
                {dropdownVisible === publication.id && (
                  <div className="dropdown-menuPL">
                    <div
              className="dropdown-itemPL"
              onClick={(event) => {
                event.stopPropagation();
                deletePublication(publication.id);
              }}
            >
              Delete
            </div>
            <div
              className="dropdown-itemPL"
              onClick={(event) => {
                event.stopPropagation();
                setEditingContent(publication.content);
                setEditingPublicationId(publication.id);
              }}
            >
              Update post
            </div>
                  </div>
                )}
              </button>
            )}
            </div>
          )}
            <CommentPublication publicationId={publication.id} userId={userId} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PublicationList;
