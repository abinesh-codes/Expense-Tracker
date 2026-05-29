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

// Interceptor to handle HTML responses (Vercel rewrites fallback) and expired tokens
api.interceptors.response.use(
  (response) => {
    const contentType = response.headers['content-type'] || '';
    if (contentType && contentType.includes('text/html')) {
      return Promise.reject(new Error('Received HTML response instead of JSON. The API endpoint may be incorrect or server is down.'));
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Session expired or unauthorized. Logging out.');
      localStorage.removeItem('spendwise_token');
    }
    return Promise.reject(error);
  }
);

export default api;
