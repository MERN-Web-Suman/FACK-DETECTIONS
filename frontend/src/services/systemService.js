import api from './api';

export const systemService = {
  async getDbStatus() {
    const response = await api.get('/system/db-status');
    return response.data;
  },

  async connectDb(mongoURI) {
    const response = await api.post('/system/connect-db', { mongoURI });
    return response.data;
  }
};

