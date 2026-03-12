import apiClient from '../api/apiClient';

export const sendMessage = async (message) => {
  const response = await apiClient.post('/chatbot/send', { message });
  return response.data;
};