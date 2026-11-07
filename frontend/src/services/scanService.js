import api from './api';

export const scanService = {
  async analyzeUrl(url) {
    const response = await api.post('/scans/analyze', { url });
    return response.data;
  },

  async getScanHistory() {
    const response = await api.get('/scans/history');
    return response.data;
  },

  async getScanById(id) {
    const response = await api.get(`/scans/${id}`);
    return response.data;
  },

  async getUserStats() {
    const response = await api.get('/scans/stats');
    return response.data;
  },

  async deleteScan(id) {
    const response = await api.delete(`/scans/${id}`);
    return response.data;
  },

  async analyzeEmail(subject, body) {
    const response = await api.post('/scans/analyze-email', { subject, body });
    return response.data;
  }
};
