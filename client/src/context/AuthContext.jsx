import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getApiBaseUrl } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sanctuary_token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const res = await axios.get(`${getApiBaseUrl()}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem('sanctuary_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post(`${getApiBaseUrl()}/auth/login`, { email, password });
    localStorage.setItem('sanctuary_token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password, phone) => {
    const res = await axios.post(`${getApiBaseUrl()}/auth/register`, { name, email, password, phone });
    localStorage.setItem('sanctuary_token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('sanctuary_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
