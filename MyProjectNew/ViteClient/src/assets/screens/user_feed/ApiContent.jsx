import axios from 'axios';
/*Este es un ayudante que recupera un token JWT del almacenamiento local 
y lo coloca en un objeto de configuración de axios*/
const axiosConfig = () => {
  const jwtToken = localStorage.getItem('jwtToken');
  return {
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
    },
  };
};
/*Esta función toma un userId como argumento y realiza una solicitud GET al endpoint de contenido del usuario en el backend*/
export const getUserContent = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:8081/api/auth/${userId}/content`, axiosConfig());
    console.log(response.data)

    return response.data;
   } catch (error) {
    console.error("Error fetching user content", error);
    return [];
  }
};
/*Esta función de actualización de publicaciones toma un publicationId y updatedContent como argumentos. */
export const updatePublicationApi = async (publicationId, updatedContent) => {
  try {
    const response = await axios.put(`http://localhost:8081/api/auth/publication/${publicationId}`, { content: updatedContent }, axiosConfig());
    return response.data;
  } catch (error) {
    console.error("Error updating publication", error);
  }
};
/* Esta función realiza la eliminación de publicaciones en el backend toma un publicationId como argumento*/
export const deletePublicationApi = async (publicationId) => {
  try {
    const response = await axios.delete(`http://localhost:8081/api/auth/publication/${publicationId}`, axiosConfig());
    alert("Successful Post deleted");

    return response.data;
  } catch (error) {
    console.error("Error deleting publication", error);
  }
};
/*Esta función realiza la eliminación de archivos en el backend  toma un fileId como argumento */
export const deleteFileApi = async (fileId) => {
  try {
    const response = await axios.delete(`http://localhost:8081/api/auth/user-files/${fileId}`, axiosConfig());
    alert("Successful file deleted");

    return response.data;
   } catch (error) {
    console.error("Error deleting file", error);
  }
};
/*Esta función realiza una solicitud GET al endpoint de contenido de amigos en el backend.*/
export const getUserFriendsContent = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/auth/friends-content`, axiosConfig());
      return response.data;
    } catch (error) {
      console.error("Error fetching user content", error);
      return [];
    }
  };