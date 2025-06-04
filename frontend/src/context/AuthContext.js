import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Get current user
          const res = await authAPI.getCurrentUser();
          
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (error) {
          // Invalid token or user inactive, clear localStorage
          localStorage.removeItem('token');
          console.error('Auth error:', error.response?.data || error.message);
        }
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      const res = await authAPI.register(userData);
      
      // Set token in localStorage
      localStorage.setItem('token', res.data.token);
      
      setUser(res.data.user);
      setIsAuthenticated(true);
      
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      return false;
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      const res = await authAPI.login(credentials);
      
      // Set token in localStorage
      localStorage.setItem('token', res.data.token);
      
      setUser(res.data.user);
      setIsAuthenticated(true);
      
      toast.success('Login successful!');
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      return false;
    }
  };

  // Logout user
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    setUser(null);
    setIsAuthenticated(false);
    
    toast.info('Logged out successfully');
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};