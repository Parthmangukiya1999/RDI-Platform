import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/reviews`;

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getMyAssignedReviews = async () => {
  const response = await axios.get(`${API_URL}/my`, authHeaders());
  return response.data;
};

export const submitReview = async (reviewId, payload) => {
  const response = await axios.put(`${API_URL}/${reviewId}/submit`, payload, authHeaders());
  return response.data;
};

export const getProjectRatingSummary = async (projectId) => {
  const response = await axios.get(`${API_URL}/project/${projectId}/summary`, authHeaders());
  return response.data;
};
