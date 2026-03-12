import apiClient from '../api/apiClient';

export const fetchTrends = async () => {
  const response = await apiClient.get('/analytics/trends');
  return response.data;
};