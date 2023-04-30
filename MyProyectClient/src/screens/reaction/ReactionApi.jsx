import axios from 'axios';

const API_URL = '/api/auth';

export const addReaction = async (publicationId, type, fileId = null) => {
  const response = await axios.post(`${API_URL}/publications/${publicationId}/reactions`, {type, fileId});
  return response.data;
};

export const deleteReaction = async (reactionId) => {
  const response = await axios.delete(`${API_URL}/reactions/${reactionId}`);
  return response.data;
};

export const toggleReaction = async (publicationId, type, fileId = null) => {
  const response = await axios.put(`${API_URL}/reactions`, {publicationId, type, fileId});
  return response.data;
};

export const getReactionCounts = async (publicationId, fileId = null) => {
  const response = await axios.get(`${API_URL}/reactions/count`, {params: {publicationId, fileId}});
  return response.data;
};