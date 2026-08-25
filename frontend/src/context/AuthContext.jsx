import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, profileAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('pathfinder_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const res = await authAPI.getMe();
      if (res.data.success) {
        setUser(res.data.data.user);
        setProfile(res.data.data.profile);
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      const newToken = res.data.data.token;
      localStorage.setItem('pathfinder_token', newToken);
      setToken(newToken);
      setUser(res.data.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    if (res.data.success) {
      const newToken = res.data.data.token;
      localStorage.setItem('pathfinder_token', newToken);
      setToken(newToken);
      setUser(res.data.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const loginDemoUser = async () => {
    return await login('demo@pathfinder.ai', 'Demo@123');
  };

  const logout = () => {
    localStorage.removeItem('pathfinder_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, token, loading, login, register, loginDemoUser, logout, refreshProfile: fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
