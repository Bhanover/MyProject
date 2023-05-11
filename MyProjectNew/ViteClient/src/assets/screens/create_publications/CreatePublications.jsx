import UploadFile from "../uploadFile/UploadFile";
import UploadModal from "../upload_modal/UploadModal";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./CreatePublications.css"
const API_BASE_URL = 'http://localhost:8081/api/auth';

const CreatePublications= ({ onNewPublication }) =>  {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const currentUserId = localStorage.getItem("idP");
    const jwtToken = localStorage.getItem("jwtToken");
    const [newContent, setNewContent] = useState("");

    const toggleUploadModal = () => {
      setIsUploadModalOpen(!isUploadModalOpen);
    };
    const createPublication = async (publicationDTO) => {
        try {
          await axios.post(`${API_BASE_URL}/publication`, publicationDTO, {
            headers: { 'Authorization': 'Bearer ' + jwtToken },
          });
          // Actualiza la lista de publicaciones después de crear una nueva
          if (onNewPublication) onNewPublication(); // Añade esta línea para actualizar la lista
        } catch (error) {
          console.error('Error al crear la publicación:', error);
          throw new Error('Error al crear la publicación. Inténtalo de nuevo.');
        }
      };
    

    return(<div className="createPublicationsCRP">
        <div className="new-publication-formPL">
      <form onSubmit={(event) => {
          event.preventDefault();
          createPublication({ content: newContent });
          setNewContent(''); // Agrega esta línea para limpiar el contenido del input
        }}>
          <input
           placeholder="ContenidoPL"
           value={newContent}
           onChange={(event) => setNewContent(event.target.value)}
          />
          <button type="submit">Crear</button>
        </form>
      </div>
      <div> 
          <button onClick={toggleUploadModal}>Abrir cargador de archivos</button>

    <UploadModal  isOpen={isUploadModalOpen} onClose={toggleUploadModal}>
    <UploadFile onNewFile={onNewPublication} />
    </UploadModal>
    </div>
    </div>);
}
export default CreatePublications;