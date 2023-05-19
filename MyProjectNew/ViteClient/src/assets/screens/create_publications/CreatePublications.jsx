import UploadFile from "../uploadFile/UploadFile";
import UploadModal from "../upload_modal/UploadModal";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./CreatePublications.css"

const API_BASE_URL = 'http://localhost:8081/api/auth';
/*CreatePublications que recibe una prop onNewPublication. 
Esta función será invocada cuando se cree una nueva publicación*/
const CreatePublications = ({ onNewPublication }) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const currentUserId = localStorage.getItem("idP");
  const jwtToken = localStorage.getItem("jwtToken");
  const [newContent, setNewContent] = useState("");
  /*toggleUploadModal es una función que cambia el estado de 
  isUploadModalOpen cada vez que se llama.*/
  const toggleUploadModal = () => {
    setIsUploadModalOpen(!isUploadModalOpen);
  };
  /*Esta es una función asincrónica que realiza una solicitud POST a 
  la API para crear una nueva publicación. */
  const createPublication = async (publicationDTO) => {
    try {
      await axios.post(`${API_BASE_URL}/publication`, publicationDTO, {
        headers: { 'Authorization': 'Bearer ' + jwtToken },
      });
      // Actualiza la lista de publicaciones después de crear una nueva
      if (onNewPublication) onNewPublication();
    } catch (error) {
      console.error('Error al crear la publicación:', error);
      throw new Error('Error al crear la publicación. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="createPublicationsCRP">
      <div className="new-publication-formCRP">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (newContent.trim() !== "") {
              createPublication({ content: newContent });
              setNewContent('');
            }
          }}
        >
          <input
            placeholder="post something"
            value={newContent}
            onChange={(event) => setNewContent(event.target.value)}
          />
          <button type="submit" disabled={!newContent.trim()}>
          Create
          </button>
        </form>
      </div>
      <div className="createPublicationUploadCRP">
        <button className="upload-button" onClick={toggleUploadModal}>
          <i className="fas fa-cloud-upload-alt"></i>
        </button>
        <UploadModal isOpen={isUploadModalOpen} onClose={toggleUploadModal}>
          <UploadFile onNewFile={onNewPublication} />
        </UploadModal>
      </div>
    </div>
  );
};

export default CreatePublications;
