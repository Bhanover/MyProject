import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./CommentPublication.css";
import { Link } from 'react-router-dom';
import { useProfileImage } from '../../../ProfileImageContext';

const API_BASE_URL = 'http://localhost:8081/api/auth';

const CommentPublication = ({ publicationId }) => {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const jwtToken = localStorage.getItem('jwtToken');
  const currentUserId = localStorage.getItem("idP");
  const [editingComment, setEditingComment] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [profileMenuCommentId, setProfileMenuCommentId] = useState(null);
  const { profileImage } = useProfileImage();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/publications/${publicationId}/comments`, {
        headers: { 'Authorization': 'Bearer ' + jwtToken },
      });
      setComments(response.data);
    } catch (error) {
      console.error('Error al obtener las publicaciones:', error);
      throw new Error('Error al obtener las publicaciones. Inténtalo de nuevo.');
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
        { ...response.data },
      ]);
      setNewCommentText("");
      fetchComments();
    } catch (error) {
      console.error("Error al crear el comentario:", error);
      throw new Error("Error al crear el comentario. Inténtalo de nuevo.");
    }
  };

  const handleUpdateComment = async (commentId, updatedText) => {
    try {
      await axios.put(`${API_BASE_URL}/comments/${commentId}`, updatedText, {
        headers: { 'Authorization': 'Bearer ' + jwtToken,
        'Content-Type': 'text/plain',
      },
        
      });

      setComments(
        comments.map((comment) =>
          comment.id === commentId ? { ...comment, updatedText } : comment
        )
      );
      fetchComments();

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

  const toggleProfileMenu = (e, commentId) => {
    e.stopPropagation();
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
                src={profileImage || comment.authorProfileImage}
                alt="Profile"
              />

                </Link>
                <p className='usernameCP'>{comment.authorUsername}</p>
              </div>
              <div className="comment-contentCP">
                {editingComment === comment.id ? (
                   <form
                   onSubmit={(e) => {
                     e.preventDefault();
                     handleUpdateComment(comment.id, editingCommentText);
                     setEditingComment(null);
                   }}
                 >
                   <input
                     type="text"
                     value={editingCommentText}
                     onChange={(e) => setEditingCommentText(e.target.value)}
                   />
                   <button type="submit">Guardar</button>
                   <button
                     type="button"
                     onClick={() => {
                       setEditingComment(null);
                     }}
                   >
                     Cancelar
                   </button>
                 </form>
                ) : (
                  <p className='commentTextCP'>{comment.text}</p>
                )}
                <span className="comment-dateCP">
                  Comentado el {formatDate(comment.createdAt)}
                </span>
              </div>
              {comment.authorId == currentUserId && (
                <div className="comment-optionsCP">
                 <button
                    className="options-buttonCP"
                    onClick={(e) => toggleProfileMenu(e, comment.id)}
                  >
                    <i className="fa fa-ellipsis-h dropdown-toggle"></i>
                </button>
                      {profileMenuCommentId === comment.id && (
                    <div
                      className={`dropdown-menuCP ${
                        profileMenuCommentId === comment.id ? "show" : ""
                      }`}
                    >
                    
                        <>
                          <div
                            className="dropdown-itemCP"
                            onClick={() => {
                              setEditingComment(comment.id);
                              setEditingCommentText(comment.text);
                            }}
                          >
                            Editar Comentario
                          </div>
                          <div
                            className="dropdown-itemCP"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            Eliminar Comentario
                          </div> 
                          
                        </>
                    
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

