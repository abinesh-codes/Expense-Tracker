import axios from 'axios';

const api = axios.create({
  // Load API base URL from Vite environment variables for Vercel production deployment,
  // falling back to empty string in development so the Vite proxy takes care of the routing.
  baseURL: import.meta.env.VITE_API_URL || '',
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
