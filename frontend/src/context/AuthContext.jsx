import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const stored = authService.getStoredUser();
      const token = localStorage.getItem('phishguard_token');

      if (token && stored) {
        setUser(stored);
        try {
          const fresh = await authService.getCurrentUser();
          if (fresh.data) {
            setUser(fresh.data);
            localStorage.setItem('phishguard_user', JSON.stringify(fresh.data));
          }
        } catch (err) {
          if (stored) setUser(stored);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      setUser(res.data);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await authService.register(name, email, password);
      setUser(res.data);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const demoLogin = async () => {
    return await login('user@phishguard.ai', 'User@123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        demoLogin,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
