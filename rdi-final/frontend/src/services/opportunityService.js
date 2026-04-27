import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/opportunities`;

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getAllOpportunities = async () => {
  const response = await axios.get(API_URL, authHeaders());
  return response.data;
};

export const getMyOpportunities = async () => {
  const response = await axios.get(`${API_URL}/my`, authHeaders());
  return response.data;
};

export const createOpportunity = async (payload) => {
  const response = await axios.post(API_URL, payload, authHeaders());
  return response.data;
};

export const applyToOpportunity = async (opportunityId) => {
  const response = await axios.post(
    `${API_URL}/${opportunityId}/apply`,
    {},
    authHeaders()
  );
  return response.data;
};

export const updateApplicantStatus = async (opportunityId, payload) => {
  const response = await axios.put(
    `${API_URL}/${opportunityId}/applicant-status`,
    payload,
    authHeaders()
  );
  return response.data;
};