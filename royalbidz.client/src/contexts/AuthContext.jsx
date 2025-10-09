import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      // Backend returns { token, user, expiresAt }
      const { token: newToken, user: userData, expiresAt } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      localStorage.setItem('tokenExpiry', expiresAt);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      
      // Registration endpoint returns just the user, then we need to login
      const newUser = response.data;
      
      // After successful registration, automatically log the user in
      const loginResult = await login(userData.email, userData.password);
      
      if (loginResult.success) {
        return { success: true };
      } else {
        return {
          success: false,
          message: 'Registration successful, but auto-login failed. Please login manually.'
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    delete axios.defaults.headers.common['Authorization'];
  };

  const getCurrentUser = async () => {
    if (!token) return;
    
    try {
      const response = await axios.get('/api/users/me');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
      logout();
    }
  };

  // Check token expiry
  const isTokenExpired = () => {
    const expiry = localStorage.getItem('tokenExpiry');
    if (!expiry) return false;
    return new Date() > new Date(expiry);
  };

  useEffect(() => {
    if (token && !user) {
      // Check if token is expired
      if (isTokenExpired()) {
        logout();
      } else {
        getCurrentUser();
      }
    }
  }, [token, user]);

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !isTokenExpired()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};