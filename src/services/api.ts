import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
});

// Adiciona o token em todas as requisições, se existir
api.interceptors.request.use((config) => {
  const authState = localStorage.getItem('authState');
  if (authState) {
    const { token } = JSON.parse(authState);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api; 