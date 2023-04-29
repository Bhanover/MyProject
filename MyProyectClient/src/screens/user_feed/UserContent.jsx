import React, { useState, useEffect } from "react";
import axios from "axios";

const UserContent = ({ userId }) => {
  const [content, setContent] = useState([]);
  const jwtToken = localStorage.getItem('jwtToken');
  const idP = localStorage.getItem('idP');
  const [updatedContent, setUpdatedContent] = useState('');
  const [editing, setEditing] = useState(null);
  const [comments, setComments] = useState({});

 
 
  useEffect(() => {
    fetchUserContent();
  }, [userId]);
  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
    },
  };
  const fetchUserContent = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/auth/${userId}/content`);
      setContent(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching user content", error);
    }
  };

  const updatePublication = async (publicationId, updatedContent) => {
    try {
      await axios.put(`http://localhost:8081/api/auth/publication/${publicationId}`, { content: updatedContent }, axiosConfig);
      fetchUserContent();
    } catch (error) {
      console.error("Error updating publication", error);
    }
  };
  
  const deletePublication = async (publicationId) => {
    try {
      await axios.delete(`http://localhost:8081/api/auth/publication/${publicationId}`, axiosConfig);
      fetchUserContent();
    } catch (error) {
      console.error("Error deleting publication", error);
    }
  };
  
  const deleteFile = async (fileId) => {
    try {
      await axios.delete(`http://localhost:8081/api/auth/user-files/${fileId}`, axiosConfig);
      fetchUserContent();
    } catch (error) {
      console.error("Error deleting file", error);
    }
  };

  const addCommentToPublication = async (publicationId, commentText) => {
    try {
      await axios.post(`http://localhost:8081/api/auth/publications/${publicationId}/comments`, { commentText }, axiosConfig);
      fetchUserContent();
    } catch (error) {
      console.error("Error adding comment to publication", error);
    }
  };
  const fetchCommentsForPublication = async (publicationId) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/auth/publications/${publicationId}/comments`,
        axiosConfig
      );
      setComments((prevComments) => ({
        ...prevComments,
        [publicationId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching comments for publication", error);
    }
  };

  useEffect(() => {
    content.forEach((item) => {
      if (item.entityType === "publication") {
        fetchCommentsForPublication(item.id);
      }
    });
  }, [content]);

  const handleEditButtonClick = (publicationId) => {
    setEditing(publicationId);
  };
  
  const handleSaveButtonClick = (publicationId) => {
    updatePublication(publicationId, updatedContent);
    setEditing(null);
  };
  return (
    <div>
      <h2>User Content</h2>
      <ul>
        {content.map((item) => (
          <li key={item.id}>
            {item.contentType && item.contentType.startsWith("image/") && (
              <>
                <img
                  src={item.url}
                  alt={item.filename}
                  style={{ width: "200px" }}
                />
                <button onClick={() => deleteFile(item.id)}>Eliminar imagen</button>
              </>
            )}
            {item.contentType && item.contentType.startsWith("video/") && (
              <>
                <video
                  src={item.url}
                  alt={item.filename}
                  style={{ width: "200px" }}
                  controls
                />
                <button onClick={() => deleteFile(item.id)}>Eliminar video</button>
              </>
            )}
           {item.entityType === "publication" && (
        <div>
          
          <h3>Esto es una publicacion {item.content}</h3>
          {item.description && <p>{item.description}</p>}
          <h4>Comentarios:</h4>
          {comments[item.id] &&
            comments[item.id].map((comment) => (
              <div key={comment.id}>
                <p>
                  <strong>{comment.authorUsername}:</strong> {comment.text}
                </p>
              </div>
            ))}
          {editing === item.id && (
            <input
              type="text"
              defaultValue={item.content}
              onChange={(e) => setUpdatedContent(e.target.value)}
              placeholder="Actualizar contenido"
            />
          )}
          {editing === item.id ? (
            <button onClick={() => handleSaveButtonClick(item.id)}>Guardar</button>
          ) : (
            <button onClick={() => handleEditButtonClick(item.id)}>Editar publicación</button>
          )}
          <button onClick={() => deletePublication(item.id)}>Eliminar publicación</button>
          
          <form
          onSubmit={(e) => {
            e.preventDefault();
            addCommentToPublication(item.id, e.target.commentText.value);
          }}
        >
          <input
            type="text"
            name="commentText"
            placeholder="Escribir un comentario..."
          />
          <button type="submit">Enviar comentario</button>
        </form>
      </div>
    )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserContent;