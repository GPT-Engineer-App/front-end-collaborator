import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';  // Replace with your actual API URL

export const uploadFile = async (folder, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_BASE_URL}/upload/${folder}`, formData);
  return response.data;
};

export const removeFile = async (folder, fileName) => {
  const response = await axios.delete(`${API_BASE_URL}/remove/${folder}/${fileName}`);
  return response.data;
};

export const listFiles = async (folder) => {
  const response = await axios.get(`${API_BASE_URL}/list/${folder}`);
  return response.data;
};

export const createCollection = async (collectionName) => {
  const response = await axios.post(`${API_BASE_URL}/vdb/create`, { name: collectionName });
  return response.data;
};

export const listCollections = async () => {
  const response = await axios.get(`${API_BASE_URL}/vdb/list`);
  return response.data;
};
