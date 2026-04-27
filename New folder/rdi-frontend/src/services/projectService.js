import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/projects`;

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const createProject = async (projectData) => {
  const response = await axios.post(API_URL, projectData, authHeaders());
  return response.data;
};

export const getProjects = async () => {
  const response = await axios.get(API_URL, authHeaders());
  return response.data;
};

export const getProjectById = async (projectId) => {
  const response = await axios.get(`${API_URL}/${projectId}`, authHeaders());
  return response.data;
};

export const applyToProject = async (projectId, payload = {}) => {
  const response = await axios.post(`${API_URL}/${projectId}/apply`, payload, authHeaders());
  return response.data;
};

export const getProjectApplications = async (projectId) => {
  const response = await axios.get(`${API_URL}/${projectId}/applications`, authHeaders());
  return response.data;
};

export const updateApplicationStatus = async (projectId, payload) => {
  const response = await axios.put(`${API_URL}/${projectId}/application-status`, payload, authHeaders());
  return response.data;
};

export const markProjectCompleted = async (projectId) => {
  const response = await axios.put(`${API_URL}/${projectId}/complete`, {}, authHeaders());
  return response.data;
};
