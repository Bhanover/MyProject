import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./CommentPublication.css"
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8081/api/auth';

const CommentPublication = ({ publicationId, userId}) => {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [userInfo,setUserInfo ] = useState("");
  const jwtToken = localStorage.getItem('jwtToken');
  const currentUserId = localStorage.getItem("idP");
  const [editingComment, setEditingComment] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [profileMenuCommentId, setProfileMenuCommentId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/user/${currentUserId}/info`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      })
      .then((response) => {
        setUserInfo(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error(error);
        throw new Error('Error al obtener la información del usuario. Inténtalo de nuevo.');
      });
  }, []);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/publications/${publicationId}/comments`, {
        headers: { 'Authorization': 'Bearer ' + jwtToken },
      });
      console.log(response.data)
      const fetchedComments = await Promise.all(
        response.data.map(async (comment) => {
          const authorResponse = await axios.get(`${API_BASE_URL}/user/${comment.authorId}/info`, {
            headers: { Authorization: `Bearer ${jwtToken}` },
          });
  
          return {
            ...comment,
            authorProfileImage: authorResponse.data.profileImage,
          };
        })
      );
  
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error al obtener los comentarios:', error);
      throw new Error('Error al obtener los comentarios. Inténtalo de nuevo.');
    }
  };

  const handleCreateComment = async () => {
    
    try {
      const response = await axios.post(
  `${API_BASE_URL}/publications/${publicationId}/comments`,
  { commentText: newCommentText },
  {
    headers: { Authorization: "Bearer " + jwtToken },
  }
);
      setComments([
        ...comments,
        { ...response.data, authorProfileImage: userInfo.profileImage },
      ]);
      setNewCommentText("");
    } catch (error) {
      console.error("Error al crear el comentario:", error);
      throw new Error("Error al crear el comentario. Inténtalo de nuevo.");
    }
  };

  const handleUpdateComment = async (commentId, updatedText) => {
    
    try {
      await axios.put(`${API_BASE_URL}/comments/${commentId}`, { commentText: updatedText }, {
        headers: { 'Authorization': 'Bearer ' + jwtToken },
      });
      
      setComments(
        comments.map((comment) =>
          comment.id === commentId ? { ...comment, text: updatedText } : comment
        )
      );
    } catch (error) {
      console.error('Error al actualizar el comentario:', error);
      throw new Error('Error al actualizar el comentario. Inténtalo de nuevo.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${API_BASE_URL}/comments/${commentId}`, {
        headers: { 'Authorization': 'Bearer ' + jwtToken },
      });
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Error al eliminar el comentario:', error);
      throw new Error('Error al eliminar el comentario. Inténtalo de nuevo.');
    }
  };
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
  };
  const toggleProfileMenu = (commentId) => {
    if (profileMenuCommentId === commentId) {
      setProfileMenuCommentId(null);
    } else {
      setProfileMenuCommentId(commentId);
    }
  };
  const closeProfileMenu = () => {
    setProfileMenuCommentId(null);
  };
  return (
    <div className="comments-sectionCP" onClick={closeProfileMenu}>
      <h2>Comentarios</h2>
      <div className="comments-listCP">
        <ul>
          {comments.map((comment) => (
            <li key={comment.id} className="commentCP">
              <div className="comment-userCP">
                <Link to={`/profilePage/${comment.authorId}`}>
                  <img
                    className="profile-imageCP"
                    src={comment.authorProfileImage}
                    alt="Profile"
                  />
                </Link>
                <p>{comment.authorUsername}</p>
              </div>
              <div className="comment-contentCP">
                {editingComment === comment.id ? (
                  <form onSubmit={(e) => {
  e.preventDefault();
  handleUpdateComment(comment.id, editingCommentText);
  setEditingComment(null); // Agrega esta línea
}}>

                    <input
                      type="text"
                      value={editingCommentText}
                      onChange={(e) => setEditingCommentText(e.target.value)}
                    />
                    <button type="submit">Guardar</button>
                  </form>
                ) : (
                  <p>{comment.text}</p>
                )}
                <span className="comment-dateCP">
                  Comentado el {formatDate(comment.createdAt)}
                </span>
              </div>
              {comment.authorId == currentUserId && (
                <div className="comment-optionsCP">
                  <button
                    className="options-buttonCP"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleProfileMenu(comment.id);
                    }}
                  >
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                  {profileMenuCommentId === comment.id && (
                    <div
                      className={`dropdown-menuCP ${
                        profileMenuCommentId === comment.id ? "show" : ""
                      }`}
                    >
                      {editingComment === comment.id ? (
                        <>
                          <div
                            className="dropdown-itemCP"
                            onClick={() =>
                              handleUpdateComment(comment.id, editingCommentText)
                            }
                          >
                            Guardar
                          </div>
                          <div
                            className="dropdown-itemCP"
                            onClick={() => setEditingComment(null)}
                          >
                            Cancelar
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className="dropdown-itemCP"
                            onClick={() => {
                              setEditingComment(comment.id);
                              setEditingCommentText(comment.text);
                            }}
                          >
                            Editar
                          </div>
                          <div
                            className="dropdown-itemCP"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            Eliminar
                          </div>
                          <Link
                            className="dropdown-itemCP"
                            to={`/profilePage/${comment.authorId}`}
                          >
                            Ver perfil
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="new-commentCP">
        <form onSubmit={(e) => {
          e.preventDefault();
          handleCreateComment();
        }}>
          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Escribe tu comentario"
          />
          <button type="submit">Comentar</button>
        </form>
      </div>
    </div>
  );
};

export default CommentPublication;