import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/auth';

const CommentPublication = ({ publicationId, jwtToken }) => {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedCommentId, setEditedCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState('');

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
      console.error(`Error al obtener los comentarios de la publicación ${publicationId}:`, error);
      // Lanzar el error para que sea capturado por el ErrorBoundary
      throw new Error(`Error al obtener los comentarios de la publicación ${publicationId}. Inténtalo de nuevo.`);
    }
  };

  const handleCreateComment = async () => {
    try {
      const commentText = newCommentText.trim();
      if (commentText.length === 0) {
        return;
      }
      const response = await axios.post(
        `${API_BASE_URL}/publications/${publicationId}/comments`,
        commentText,
        {
          headers: { 'Authorization': 'Bearer ' + jwtToken },
        }
      );
      console.log(response.status, response.data);
      setComments([...comments, response.data]);
      fetchComments(); // Agregar esta línea
      setNewCommentText('');
    } catch (error) {
      console.error(`Error al crear el comentario en la publicación ${publicationId}:`, error);
      // Lanzar el error para que sea capturado por el ErrorBoundary
      throw new Error(`Error al crear el comentario en la public`);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${API_BASE_URL}/comments/${commentId}`, {
        headers: { 'Authorization': 'Bearer ' + jwtToken },
      });
      // Actualizar la lista de comentarios después de borrar
      fetchComments();
    } catch (error) {
      console.error(`Error al borrar el comentario ${commentId}:`, error);
      // Lanzar el error para que sea capturado por el ErrorBoundary
      throw new Error(`Error al borrar el comentario ${commentId}`);
    }
  };

  const handleEditComment = (commentId, currentCommentText) => {
    setEditedCommentId(commentId);
    setEditedCommentText(currentCommentText);
    setIsEditing(true);
  };
  
  const handleSaveEditComment = async () => {
    try {
      const updatedCommentText = editedCommentText.trim();
      if (updatedCommentText.length === 0) {
        return;
      }
      await axios.put(
        `${API_BASE_URL}/comments/${editedCommentId}`,
        updatedCommentText,
        {
          headers: { 'Authorization': 'Bearer ' + jwtToken },
        }
      );
      // Actualizar el comentario modificado en la lista de comentarios
      setComments(
        comments.map((comment) => {
          if (comment.id === editedCommentId) {
            comment.text = updatedCommentText;
          }
          return comment;
        })
      );
      setIsEditing(false);
    } catch (error) {
      console.error(
        `Error al actualizar el comentario ${editedCommentId}:`,
        error
      );
      // Lanzar el error para que sea capturado por el ErrorBoundary
      throw new Error(`Error al actualizar el comentario ${editedCommentId}.`);
    }
  };
  
  const handleCancelEditComment = () => {
    setIsEditing(false);
  };

  return (
    <div className='comments-section'>
      <h3>Comentarios</h3>
      <div className='new-comment'>
        <input
          type='text'
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder='Escribe tu comentario'
        />
        <button onClick={handleCreateComment}>Comentar</button>
      </div>
      <div className='comments-list'>
        {comments.length === 0 && <p>No hay comentarios aún.</p>}
        {comments.map((comment) => (
          <div key={comment.id} className='comment'>
            <p>
              <strong>{comment.authorUsername}: </strong>
              {comment.text}
            </p>
            <div key={comment.id} className='comment'>
              {isEditing && editedCommentId === comment.id ? (
                <>
                  <input
                  type='text'
                    value={editedCommentText}
                    onChange={(e) => setEditedCommentText(e.target.value)}
                  />
                  <button onClick={handleSaveEditComment}>Guardar</button>
                  <button onClick={handleCancelEditComment}>Cancelar</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleDeleteComment(comment.id)}>
                    Borrar
                  </button>
                  <button
                    onClick={() => handleEditComment(comment.id, comment.text)}
                  >
                    Editar
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
              }  

export default CommentPublication;