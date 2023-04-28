import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentPublication from "../comment_publication/CommentPublication"
import "./PublicationList.css"
const API_BASE_URL = 'http://localhost:8081/api/auth';

const PublicationList = (props) => {
  const [publications, setPublications] = useState([]);
  const jwtToken = localStorage.getItem('jwtToken');
  const [userId,setUserId] =  useState("");

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
      throw new Error('Error al obtener las publicaciones. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="publication-listPL">
      <h2>Lista de Publicaciones</h2>
      <div className="publicationsPL">
        {publications.map((publication) => (
          <div key={publication.id} className="publicationPL">
            <h3>{publication.title}</h3>
            <p>{publication.content}</p>
            <span className="publication-datePL">
              Publicado el {new Date(publication.creationTime).toLocaleDateString('es-ES')}
            </span>
            <CommentPublication publicationId={publication.id} userId={props.userId} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicationList;
