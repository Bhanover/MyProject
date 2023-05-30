import React, { useState, useEffect } from "react";
import ImageModal from "../image_modal/ImageModal";
import VideoModal from "../video_modal/VideoModal";
import "./UserContent.css";
import { Link } from 'react-router-dom';
import CreatePublications from "../create_publications/CreatePublications";
import CommentPublication from "../comment_publication/CommentPublication";
import { useProfileImage } from "../../../ProfileImageContext";
import {
  getUserContent,
  updatePublicationApi,
  deletePublicationApi,
  deleteFileApi,
} from "./ApiContent";
import Reaction from "../reaction/Reaction";
import { useParams } from "react-router-dom";
import CommentFile from "../comment_file/CommentFile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import DetailsUser from "../details_user/DetailsUser";

const UserContent = () => {
  const [content, setContent] = useState([]);
  const jwtToken = localStorage.getItem("jwtToken");
  const [updatedContent, setUpdatedContent] = useState("");
  const [editing, setEditing] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [showOptions, setShowOptions] = useState({});
  const { profileImage, updateProfileImage } = useProfileImage();
  const { userId } = useParams();
  const currentUserId = localStorage.getItem("idP");
  const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); 

  /*Esta función se activa cuando un usuario hace clic en el ícono de opciones*/
  const handleOptionsClick = (itemId,e) => {
    e.preventDefault();
    setShowOptions((prevState) => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }));
  };
  /*Esta función abre el modal de video cuando un usuario hace clic en un video. */
  const handleOpenVideoModal = (url, fileId) => {
    const videoIndex = content
      .filter(
        (item) =>
          item.contentType && item.contentType.startsWith("video/")
      )
      .findIndex((item) => item.id === fileId);
    setSelectedFileId(fileId);
    setSelectedVideoIndex(videoIndex);
    setShowVideoModal(true);
    navigate(`/profilePage/${userId}/content/${fileId}`);

  };
  /*Abre el modal de imagen cuando un usuario hace clic en una imagen.*/
  
  const handleOpenImageModal = (url, fileId) => {
    const imageIndex = content
      .filter((item) => item.contentType && item.contentType.startsWith("image/"))
      .findIndex((item) => item.id === fileId);
    setSelectedFileId(fileId);
    setSelectedImageIndex(imageIndex);
    setShowImageModal(true);

    navigate(`/profilePage/${userId}/content/${fileId}`);
  };
  const clearUrl = () => {
    navigate(`/profilePage/${userId}/content`);
  };
  /*Cierra el modal de imagen */
  const handleCloseImageModal = () => {
    setSelectedFileId(null);
    setShowImageModal(false);
    clearUrl();
  };
  /* Se usa useEffect para invocar fetchUserContent cuando el componente se monta y cada vez que cambia el userId.*/
  useEffect(() => {
 
    fetchUserContent();
 
  }, [userId]);
  /*Se invoca cuando el usuario envía el formulario de actualización de la publicación. 
  Llama a handleSaveButtonClick.*/
  const handleFormSubmit = (e, publicationId) => {
    e.preventDefault();
    handleSaveButtonClick(publicationId);
  };

  const fetchUserContent = async () => {
    setLoading(true);

    const data = await getUserContent(userId);
    setContent(data);
    setLoading(false);

  };

  const updatePublication = async (publicationId, updatedContent) => {
    await updatePublicationApi(publicationId, updatedContent);
    fetchUserContent();
  };

  const deletePublication = async (publicationId) => {
    await deletePublicationApi(publicationId);
    fetchUserContent();
  };

  const deleteFile = async (fileId) => {
    await deleteFileApi(fileId);
    fetchUserContent();
  };

  const handleEditButtonClick = (publicationId) => {
    setEditing(publicationId);
  };

  const handleSaveButtonClick = (publicationId) => {
    updatePublication(publicationId, updatedContent);
    setEditing(null);
    setUpdatedContent("");
  };
  return (
    <div  className="usercontent-mainCT"> 
    
    <div className="usercontent-detailsCT"><DetailsUser userId={userId} /></div>
    <div className="usercontent-containerCT">
     {loading ? (
      <div className="loader-container">
        <div className="loader"></div>
        </div>
      ) : (
        <>
      <CreatePublications onNewPublication={fetchUserContent} />
      <ul className="usercontent-listCT">
        {content.map((item, index) => (
          <li key={item.id} className="usercontent-itemCT">
        <div className="container-userCT"> 
        <Link to={`/profilePage/${item.userId}`}>

        <img
        className="profile-imageCT"
        src={item.profileImage  ||  profileImage}
        alt="Profile"
      />
                </Link>

          <p className="profile-usernameCT">{item.username}</p>
          </div>
            {currentUserId == userId && (
              <i
                className="fas fa-ellipsis-v optionsCT"
                onClick={(e) => handleOptionsClick(item.id,e)}
              ></i>
            )}
              
            {showOptions[item.id] && (
              <div className="options-containerCT">
                {item.entityType === "publication" && (
                  <>
                    <button onClick={() => deletePublication(item.id)}>Delete</button>
                    <button onClick={() => handleEditButtonClick(item.id)}>Update post</button>
                  </>
                )}
                {(item.contentType && item.contentType.startsWith("image/")) ||
                (item.contentType && item.contentType.startsWith("video/")) ? (
                  <button onClick={() => deleteFile(item.id)}>Delete</button>
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
                    {console.log(item)}
                    <div className="reactionCT">
                    <Reaction fileId={item.id} entityType="image" />
                    </div>
                    <div className="commentFileCT" >
                    <CommentFile  fileId={item.id} postOwner={item.owner} postDescription={item.description} postImage={item.url} />
                    </div>
                  </div>
                )}

                    {item.contentType && item.contentType.startsWith("video/") && (
                  <div className="usercontent-video-containerCT">
                  <p className="usercontent-descriptionCT">{item.description}</p>

                    <video
                      src={item.url}
                      alt={item.filename}
                      className="usercontent-videoCT"
                      controls={true}
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpenVideoModal(item.url, item.id);
                    }}                    />
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
                     <div className="reactionCT"> 
                    <Reaction fileId={item.id} entityType="video" />
                    </div>
                    {console.log(item.description)}
                    <div className="commentFileCT" >
                    <CommentFile className="commentFileCT" fileId={item.id} postOwner={item.owner} postDescription={item.description} postImage={item.url} />
                    </div>
                  </div>
                )}

            {item.entityType === "publication" && (
              <div className="usercontent-publication-containerCT">
            
                <p className="usercontent-descriptionCT ">{item.content}</p>
                <div > 
                    <Reaction  publicationId={item.id}  />
                </div>
                <span className="usercontent-publication-dateCT">
                posted on {new Date(item.creationTime).toLocaleDateString("es-ES")}
                </span>
                {editing === item.id && (
                  <form onSubmit={(e) => handleFormSubmit(e, item.id)}>
                  <input
                    type="text"
                    value={updatedContent}
                    className="usercontent-edit-inputCT"
                    onChange={(e) => setUpdatedContent(e.target.value)}
                    placeholder="Actualizar contenido"
                  />
                  <button type="submit" className="usercontent-save-btnCP">
                  <FontAwesomeIcon icon={faSave} /> 
                  </button>
                  <button className="usercontent-save-btnCP"
                 type="button"
                 onClick={() => {
                  setUpdatedContent("");
                  setEditing(null);
                }}
               >
                 <FontAwesomeIcon icon={faTimes} />
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
            selectedImageIndex={selectedImageIndex}
            onProfileImageUpdate={updateProfileImage} 
            onImagesRefresh={fetchUserContent}
            
          />
          
        )}

        {showVideoModal && (
          <VideoModal
            videos={content.filter(
              (item) => item.contentType && item.contentType.startsWith("video/")
            )}
            selectedVideoIndex={selectedVideoIndex}
            onClose={() => {
              setShowVideoModal(false);
              clearUrl();
            }}
            userId={userId}
            onDelete={(fileId) => {
              deleteFile(fileId);
              setShowVideoModal(false);
            }}
            onRefresh={fetchUserContent}

          />
        )}

          </>
      )}
      </div>
      </div>
    );
      }
export default UserContent
