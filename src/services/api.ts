import axios from 'axios';

/**
 * Instância do Axios configurada para a API do sistema.
 * Define a baseURL a partir do .env ou usa localhost por padrão.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
});

/**
 * Interceptor de requisições:
 * Adiciona o token JWT (se existir) no header Authorization de todas as requisições.
 */
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