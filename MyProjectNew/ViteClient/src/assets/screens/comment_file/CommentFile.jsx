import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CommentFile.css';
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useProfileImage } from "../../../ProfileImageContext";

 

const CommentFile = ({ fileId, postOwner, postDescription,postImage }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const [editedCommentText, setEditedCommentText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState('');
    const currentUserId = localStorage.getItem("idP");
    const [showEmojiPickerEdit, setShowEmojiPickerEdit] = useState(false);
    const [dropdownCommentId, setDropdownCommentId] = useState(null);
    const { profileImage } = useProfileImage();
    const [showCancelButton, setShowCancelButton] = useState(false);
    const jwtToken = localStorage.getItem('jwtToken');

    const api = axios.create({
      baseURL: 'http://localhost:8081/api/auth',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    const toggleDropdown = (commentId) => {
      
      if (dropdownCommentId === commentId) {
        setDropdownCommentId(null);
      } else {
        setDropdownCommentId(commentId);
      }
    };
  
    const handleEmojiSelect = (emoji) => {
        setSelectedEmoji(emoji.native);
        setNewComment(newComment + emoji.native);
    };

    const handleEmojiSelectEdit = (emoji) => {
      setEditedCommentText(editedCommentText + emoji.native);
    };
  
    const fetchComments = async () => {
      try {
        const response = await api.get(`/files/${fileId}/comments`);
        setComments(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error al obtener los comentarios:', error);
      }
    };
    useEffect(() => {
      fetchComments();
    }, [fileId]);
    const handleAddComment = (e) => {
  e.preventDefault(); 
  api
    .post(`/files/${fileId}/comments`, newComment, {
      headers: {
        'Content-Type': 'text/plain',
      },
    })
    .then(() => {
      fetchComments(); // Reemplaza la llamada a api.get con fetchComments
      setNewComment(''); // Agrega esta línea para vaciar el input después de enviar un comentario
    })
    .catch((error) => console.error(error));
};
    const handleUpdateComment = (commentId) => {
      api
        .put(`/comments/${commentId}`, editedCommentText, {
          headers: {
            'Content-Type': 'text/plain',
          },
        })
        .then(() => {
          fetchComments(); // Reemplaza la llamada a api.get con fetchComments
          setEditingComment(null); // Agrega esta línea para ocultar el panel de edición después de actualizar el comentario
        })
        .catch((error) => console.error(error));
    };
  const handleEditComment = (commentId, commentText) => {
    // Buscar el comentario a editar
    const comment = comments.find((c) => c.id === commentId);
  
    if (comment.authorId == currentUserId) {
      // Si el autor del comentario es el usuario actual, permitir la edición
      setEditingComment(commentId);
      setEditedCommentText(commentText);
    } else {
      // Si el autor del comentario no es el usuario actual, mostrar un mensaje de error
      console.log('comment.authorId:', comment.authorId, 'currentUserId:', currentUserId);
      console.log('No estás autorizado para editar este comentario');
    }
  };

  const handleDeleteComment = (commentId) => {
    // Buscar el comentario a eliminar
    const comment = comments.find((c) => c.id === commentId);
  
    if (comment.authorId == currentUserId) {
      // Si el autor del comentario es el usuario actual, permitir la eliminación
      api
        .delete(`/comments/${commentId}`)
        .then(() => api.get(`/files/${fileId}/comments`))
        .then((response) => setComments(response.data))
        .catch((error) => console.error(error));
    } else {
      // Si el autor del comentario no es el usuario actual, mostrar un mensaje de error
      console.log('No estás autorizado para eliminar este comentario');
    }
  };
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
  };
  return (
    <div className="comment-sectionCF">
      <div className="comment-infoCF">
      <h2>Comentarios</h2>
      <img className="postImageCF" src={profileImage || postImage}  alt="Profile" />

      <div className="post-ownerCF">{postOwner}
       </div>
      <div className="post-descriptionCF">{postDescription}</div>
      </div>
      <div className="comments-containerCF">
        
        <ul>
          {comments.map((comment) => (
            
            <li key={comment.id}>
              <div className='infoUserCF'> 
              <img className="profile-imageCF" src={ comment.authorProfileImage  || profileImage } alt="Profile" />
              <p className="profile-usernameCF">{comment.authorUsername}</p>
              </div>
              {editingComment === comment.id ? (
                <>
                  <input
                    type="text"
                    value={editedCommentText}
                    onChange={(e) => {
                      setEditedCommentText(e.target.value);
                    }}
                  />
                <div className="emoji-picker-container">
              <button onClick={() => setShowEmojiPickerEdit(!showEmojiPickerEdit)}>
                {showEmojiPickerEdit ? "X" : <FontAwesomeIcon icon={faSmile} />}
              </button>
            </div>

                  {showEmojiPickerEdit && (
                  <div className='pickerContainerCF'>                                
                <Picker
                  onEmojiSelect={handleEmojiSelectEdit}
                  native
                  data={data}
                  className="emoji-picker" 
                />
                </div>
              )}

                </>
              ) : (
                <>
                  <p className="creation-textCF">{comment.text}</p> {' '}
                  <p className="creation-timeCF">Comentado el {formatDate(comment.createdAt)}</p>
                </>
              )}
              {currentUserId == comment.authorId && (
                <>
                  <i
                  className="fa fa-ellipsis-h dropdown-toggle"
                  onClick={() => toggleDropdown(comment.id)}
                  onMouseDown={(e) => e.preventDefault()}

                ></i>
                  {dropdownCommentId === comment.id && (
                    <div className='optionsContainerCF'
                    >
                      <button
                        className="updateCF"
                        onClick={() =>
                          editingComment === comment.id
                            ? handleUpdateComment(comment.id)
                            : handleEditComment(comment.id, comment.text)
                        }
                      >
                        {editingComment === comment.id ? 'Guardar' : 'Editar Comentario'}
                      </button>
                      {editingComment === comment.id && (
                  <button
                  className="cancelCF"
                    onClick={() => {
                      setShowCancelButton(false);
                      setEditingComment(null);
                    }}
                  >
                    Cancelar
                  </button>
                )}
                      <button
                        className="deleteCF"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        Eliminar Comentario
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
        
      </div>
      <div className="comment-input-containerCF">

      <form
        onSubmit={handleAddComment} // Agregue el método handleAddComment al evento onSubmit del formulario
      >
         <input
          placeholder="Escribe tu comentario"

          type="text"
          value={newComment}
          onChange={(e) => {
            setNewComment(e.target.value);
          }}
        />
        <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          {showEmojiPicker ? (
            "X"
          ) : (
            <FontAwesomeIcon icon={faSmile} />
          )}
        </button>
        {showEmojiPicker && (
          <div className='pickerContainer-commentsCF'> 
        <Picker
          onEmojiSelect={handleEmojiSelect}
          native
          data={data}
          />
          </div>
      )}
        <button type="submit"> {/* Cambie el tipo del botón a "submit" */}
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
        </form>
    </div>
  </div>
);
};

export default CommentFile;