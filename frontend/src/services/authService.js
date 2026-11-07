import api from './api';

export const authService = {
  async register(name, email, password) {
    const response = await api.post('/auth/register', { name, email, password });
    if (response.data.data?.token) {
      localStorage.setItem('phishguard_token', response.data.data.token);
      localStorage.setItem('phishguard_user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.data?.token) {
      localStorage.setItem('phishguard_token', response.data.data.token);
      localStorage.setItem('phishguard_user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async generateApiKey() {
    const response = await api.post('/auth/api-key');
    return response.data;
  },

  logout() {
    localStorage.removeItem('phishguard_token');
    localStorage.removeItem('phishguard_user');
  },

  getStoredUser() {
    const userStr = localStorage.getItem('phishguard_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }
};

