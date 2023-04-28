import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CommentFile.css';
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile } from '@fortawesome/free-solid-svg-icons';
import { InView } from 'react-intersection-observer';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const jwtToken = localStorage.getItem('jwtToken');

const api = axios.create({
  baseURL: 'http://localhost:8081/api/auth',
  headers: {
    Authorization: `Bearer ${jwtToken}`,
  },
});

const CommentFile = ({ fileId, postOwner, postDescription }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const [editedCommentText, setEditedCommentText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState('');
    const currentUserId = localStorage.getItem("idP");
    const [showEmojiPickerEdit, setShowEmojiPickerEdit] = useState(false);

    const handleEmojiSelect = (emoji) => {
        setSelectedEmoji(emoji.native);
        setNewComment(newComment + emoji.native);
    };

    const handleEmojiSelectEdit = (emoji) => {
      setEditedCommentText(editedCommentText + emoji.native);
    };
  
  useEffect(() => {
    api
      .get(`/files/${fileId}/comments`)
      .then((response) => setComments(response.data))
      .catch((error) => console.error(error));
  }, [fileId]);

  const handleAddComment = () => {
    api
        .post(`/files/${fileId}/comments`, newComment, {
            headers: {
                'Content-Type': 'text/plain',
            },
        })
        .then(() => api.get(`/files/${fileId}/comments`))
        .then((response) => setComments(response.data))
        .catch((error) => console.error(error));
};

const handleUpdateComment = (commentId) => {
    api
      .put(`/comments/${commentId}`, editedCommentText, {
        headers: {
          'Content-Type': 'text/plain',
        },
      })
      .then(() => api.get(`/files/${fileId}/comments`))
      .then((response) => {
        setComments(response.data);
        setEditingComment(null);
        setEditedCommentText('');
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
 return (
  <div className="comment-sectionC">
    <h2>Comments</h2>
    <div className="post-owner">{postOwner}</div>
    <div className="post-description">{postDescription}</div>
    <div className="comments-container">
      <InView>
        {({ inView, ref }) => (
          <ul ref={ref}>
            {comments.map((comment) => (
              <li key={comment.id}>
                <span className="username">{comment.username}</span> - {comment.text} -{' '}
                <span className="creation-time">{comment.creationTime}</span>
                {editingComment === comment.id ? (
                  <>
                    <input
                      type="text"
                      value={editedCommentText}
                      onChange={(e) => {
                        console.log("editedCommentText onChange");
                        setEditedCommentText(e.target.value);
                      }}
                    />

                    <button onClick={() => setShowEmojiPickerEdit(!showEmojiPickerEdit)}>
                      {showEmojiPickerEdit ? (
                        'Close Emoji Picker'
                      ) : (
                        <FontAwesomeIcon icon={faSmile} />
                      )}
                    </button>
                    {showEmojiPickerEdit && (
                      <Picker
                        onEmojiSelect={handleEmojiSelectEdit}
                        native
                        data={data}
                        style={{ position: 'absolute', zIndex: 2, maxWidth: '300px', bottom: '60px', left: '50%', transform: 'translateX(-50%)' }}
                      />
                    )}
                  </>
                ) : (
                  <span>{comment.text}</span>
                )}
                {currentUserId == comment.authorId && (
                  <button
                    className="update"
                    onClick={() =>
                      editingComment === comment.id
                        ? handleUpdateComment(comment.id)
                        : handleEditComment(comment.id, comment.text)
                    }
                  >
                    {editingComment === comment.id ? 'Save' : 'Update'}
                  </button>
                )}
                {currentUserId == comment.authorId && (
                  <button className="delete" onClick={() => handleDeleteComment(comment.id)}>
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </InView>
    </div>
    <div className="comment-input-containerC">
      <input
        type="text"
        value={newComment}
        onChange={(e) => {
          console.log("newComment onChange");
          setNewComment(e.target.value);
        }}
      />
      <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
        {showEmojiPicker ? (
          "Close Emoji Picker"
        ) : (
          <FontAwesomeIcon icon={faSmile} />
        )}
      </button>
      {showEmojiPicker && (
        <Picker
          onEmojiSelect={handleEmojiSelect}
          native
          data={data}
          style={{
            position: "absolute",
            zIndex: 2,
            maxWidth: "300px",
            bottom: "60px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      )}
     <button onClick={handleAddComment}>
  <FontAwesomeIcon icon={faPaperPlane} />
</button>
    </div>
  </div>
);
};

export default CommentFile;