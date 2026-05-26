import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize and check persistent session on app startup
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('spendwise_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/api/auth/profile');
        setUser(res.data);
      } catch (err) {
        console.error('Session validation failed. Logging out.', err);
        localStorage.removeItem('spendwise_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // Register a new user
  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/api/auth/register', { username, email, password });
      const { token, user: userData } = res.data;
      localStorage.setItem('spendwise_token', token);
      setUser(userData);
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Registration failed';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // Log in an existing user
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { token, user: userData } = res.data;
      localStorage.setItem('spendwise_token', token);
      setUser(userData);
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Invalid credentials';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // Terminate user session
  const logout = () => {
    localStorage.removeItem('spendwise_token');
    setUser(null);
    setError(null);
  };

  // Clear previous form validation errors
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        clearError,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be wrapped within an AuthProvider');
  }
  return context;
};
