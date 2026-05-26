import axios from 'axios';

const api = axios.create({
  // Empty baseline because Vite proxy forwards all '/api' routes directly to our Flask port
  baseURL: '',
});

// Interceptor to inject JWT authentication token automatically before execution
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('spendwise_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
