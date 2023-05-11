import axios from 'axios';

const axiosConfig = () => {
  const jwtToken = localStorage.getItem('jwtToken');
  return {
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
    },
  };
};

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

export const updatePublicationApi = async (publicationId, updatedContent) => {
  try {
    const response = await axios.put(`http://localhost:8081/api/auth/publication/${publicationId}`, { content: updatedContent }, axiosConfig());
    return response.data;
  } catch (error) {
    console.error("Error updating publication", error);
  }
};

export const deletePublicationApi = async (publicationId) => {
  try {
    const response = await axios.delete(`http://localhost:8081/api/auth/publication/${publicationId}`, axiosConfig());
    return response.data;
  } catch (error) {
    console.error("Error deleting publication", error);
  }
};

export const deleteFileApi = async (fileId) => {
  try {
    const response = await axios.delete(`http://localhost:8081/api/auth/user-files/${fileId}`, axiosConfig());
    return response.data;
  } catch (error) {
    console.error("Error deleting file", error);
  }
};
export const getUserFriendsContent = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/auth/friends-content`, axiosConfig());
      return response.data;
    } catch (error) {
      console.error("Error fetching user content", error);
      return [];
    }
  };