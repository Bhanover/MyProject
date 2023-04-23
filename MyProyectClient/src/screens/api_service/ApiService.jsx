import axios from 'axios';

const baseURL = 'http://localhost:8081/api/auth/';

const ApiService = {
  // Fetch videos
  fetchVideos: async (userId, limit) => {
    try {
      const response = await axios.get(`${baseURL}/users/${userId}/videos`, {
        params: {
          limit: limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener videos:', error);
      throw error;
    }
  },

  // Fetch images
  fetchImages: async (userId, limit) => {
    try {
      const response = await axios.get(`${baseURL}/users/${userId}/images`, {
        params: {
          limit: limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener imágenes:', error);
      throw error;
    }
  },

  // Fetch publications
  fetchPublications: async (userId, limit) => {
    try {
      const response = await axios.get(`${baseURL}/users/${userId}/publications`, {
        params: {
          limit: limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener publicaciones:', error);
      throw error;
    }
  },
};

export default ApiService;