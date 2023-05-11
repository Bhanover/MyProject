import React, { useState, useEffect } from "react";
import axios from "axios";
import ImageModal from "../image_modal/ImageModal";
import VideoModal from "../video_modal/VideoModal";
import "./UserContent.css"
import CommentPublication from "../comment_publication/CommentPublication";
const UserContent = ({ userId }) => {
  const [content, setContent] = useState([]);
  const jwtToken = localStorage.getItem('jwtToken');
  const idP = localStorage.getItem('idP');
  const [updatedContent, setUpdatedContent] = useState('');
  const [editing, setEditing] = useState(null);
  const [comments, setComments] = useState({});
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [showOptions, setShowOptions] = useState({});
  const handleOptionsClick = (itemId) => {
    setShowOptions((prevState) => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }));
  };
  const handleOpenVideoModal = (url, fileId) => {

    const videoIndex = content
      .filter((item) => item.contentType && item.contentType.startsWith("video/"))
      .findIndex((item) => item.id === fileId);
    setSelectedFileId(fileId);
    setSelectedVideoIndex(videoIndex);
    setShowVideoModal(true);
  };
  const handleOpenImageModal = (url, fileId) => {
    const imageIndex = content
      .filter((item) => item.contentType && item.contentType.startsWith("image/"))
      .findIndex((item) => item.id === fileId);
    setSelectedFileId(fileId);
    setSelectedImageIndex(imageIndex);
    setShowImageModal(true);
  };
  const handleCloseImageModal = () => {
    setSelectedFileId(null);
    setShowImageModal(false);
  };
  useEffect(() => {
    fetchUserContent();
  }, [userId]);
  const handleFormSubmit = (e, publicationId) => {
    e.preventDefault();
    handleSaveButtonClick(publicationId);
  };

  const setProfilePicture = async (imageId) => {
    try {
      await axios.put('http://localhost:8081/api/auth/set-profile-image', null, {
        headers: {
          'Authorization': 'Bearer ' + jwtToken
        },
        params: {
          imageId: imageId
        }
      });
      alert('Foto de perfil actualizada con éxito.');
      setShowImageModal(false);
    } catch (error) {
      console.error('Error al establecer la foto de perfil:', error);
      alert('Error al establecer la foto de perfil. Inténtalo de nuevo.');
    }
  };
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
    setUpdatedContent(""); 
  };
  return (
    <div className="usercontent-containerCT">
      <h2>User Content</h2>
      <ul className="usercontent-listCT">
        {content.map((item, index) => (
          <li key={item.id} className="usercontent-itemCT">
            {/* Añade el ícono de opciones */}
            <i
              className="fas fa-ellipsis-v"
              onClick={() => handleOptionsClick(item.id)}
            ></i>
  
            {/* Envuelve las opciones en un div y controla su visibilidad con el estado showOptions */}
            {showOptions[item.id] && (
              <div className="options-container">
                {item.entityType === "publication" && (
                  <>
                    <button onClick={() => deletePublication(item.id)}>Eliminar</button>
                    <button onClick={() => handleEditButtonClick(item.id)}>Editar publicación</button>
                  </>
                )}
                {(item.contentType && item.contentType.startsWith("image/")) ||
                (item.contentType && item.contentType.startsWith("video/")) ? (
                  <button onClick={() => deleteFile(item.id)}>Eliminar</button>
                ) : null}
              </div>
            )}
  
            {item.contentType && item.contentType.startsWith("image/") && (
              <div className="usercontent-image-containerCT">
                <p className="usercontent-descriptionCT">{item.description}</p>
                <img
                  src={item.url}
                  alt={item.filename}
                  className="usercontent-imageCT"
                  onClick={() => handleOpenImageModal(item.url, item.id)}
                />
              </div>
            )}
            {item.contentType && item.contentType.startsWith("video/") && (
              <div className="usercontent-video-containerCT">
                <video
                  src={item.url}
                  alt={item.filename}
                  className="usercontent-videoCT"
                  controls={false}
                  onClick={() => handleOpenVideoModal(item.url, item.id)}
                />
                {showVideoModal && (
                  <VideoModal
                    videos={content.filter(
                      (item) =>
                        item.contentType && item.contentType.startsWith("video/")
                    )}
                    selectedVideoIndex={selectedVideoIndex}
                    onClose={() => setShowVideoModal(false)}
                    userId={userId}
                    onDelete={(fileId) => {
                      deleteFile(fileId);
                      setShowVideoModal(false);
                    }}
                  />
                )}
              </div>
            )}
              {item.entityType === "publication" && (
              <div className="usercontent-publication-containerCP">
                <h3>{item.title}</h3>
                <p>{item.content}</p>
                <span className="usercontent-publication-dateCP">
                  Publicado el {new Date(item.creationTime).toLocaleDateString("es-ES")}
                </span>
                {editing === item.id && (
                  <form onSubmit={(e) => handleFormSubmit(e, item.id)}>
                    <input
                      type="text"
                      value={updatedContent}
                      className="usercontent-edit-inputCP"
                      onChange={(e) => setUpdatedContent(e.target.value)}
                      placeholder="Actualizar contenido"
                      
                    />
                    <button type="submit" className="usercontent-save-btnCP">
                      Guardar
                    </button>
                  </form>
                )}
                <CommentPublication publicationId={item.id} userId={userId} />
              </div>
            )}
  
          </li>
        ))}
      </ul>
      {showImageModal && (
        <ImageModal
          selectedImages={content.filter(
            (item) => item.contentType && item.contentType.startsWith("image/")
          )}
          selectedFileIds={content
            .filter((item) => item.contentType && item.contentType.startsWith("image/"))
            .map((item) => item.id)}
            fileId={selectedFileId}
            onClose={handleCloseImageModal}
            userId={userId}
            onDelete={(fileId) => {
              deleteFile(fileId);
              setShowImageModal(false);
            }}
            onSetProfilePicture={setProfilePicture}
            selectedImageIndex={selectedImageIndex}
          />
        )}
        {showVideoModal && (
          <VideoModal
            videos={content.filter(
              (item) => item.contentType && item.contentType.startsWith("video/")
            )}
            selectedVideoIndex={selectedVideoIndex}
            onClose={() => setShowVideoModal(false)}
            userId={userId}
            onDelete={(fileId) => {
              deleteFile(fileId);
              setShowVideoModal(false);
            }}
          />
        )}
      </div>
    );
      }
export default UserContent

/*      {item.entityType === "publication" && (
              <div className="usercontent-publication-containerCT">
                <h3 className="usercontent-publication-titleCT">
                  Esto es una publicacion {item.content}
                </h3>
                {item.description && (
                  <p className="usercontent-publication-descriptionCT">
                    {item.description}
                  </p>
                )}
                <h4 className="usercontent-comments-titleCT">Comentarios:</h4>
                {comments[item.id] &&
                  comments[item.id].map((comment) => (
                    <div
                      key={comment.id}
                      className="usercontent-comment-containerCT"
                    >
                      <p className="usercontent-commentCT">
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
                    className="usercontent-edit-inputCT"
                  />
                )}
                {editing === item.id ? (
                  <button
                    className="usercontent-save-btnCT"
                    onClick={() => handleSaveButtonClick(item.id)}
                  >
                    Guardar
                  </button>
                ) : (
                  <button
                    className="usercontent-edit-btnCT"
                    onClick={() => handleEditButtonClick(item.id)}
                  >
                    Editar publicación
                  </button>
                )}
                <button
                  className="usercontent-delete-publication-btnCT"
                  onClick={() => deletePublication(item.id)}
                >
   Eliminar publicación
              </button>

              <form
                className="usercontent-comment-formCT"
                onSubmit={(e) => {
                  e.preventDefault();
                  addCommentToPublication(item.id, e.target.commentText.value);
                }}
              >
                <input
                  type="text"
                  name="commentText"
                  className="usercontent-comment-inputCT"
                  placeholder="Escribir un comentario..."
                />
                <button type="submit" className="usercontent-submit-comment-btnCT">
                  Enviar comentario
                </button>
              </form>
            </div>
          )}
        </li>
      ))}
    </ul>*/