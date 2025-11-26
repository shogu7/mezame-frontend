import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const decodeToken = useCallback((token) => {
    if (!token) return null;
    try {
      const payload = jwtDecode(token);
      // optional: validate payload shape
      if (payload && payload.username) return payload;
      return null;
    } catch (err) {
      console.warn('Invalid token', err);
      return null;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = decodeToken(token);
      if (payload) {
        setUser(payload);
      } else {
        // bad token -> clean
        localStorage.removeItem('token');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [decodeToken]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'token') {
        const newToken = e.newValue;
        if (newToken) {
          const payload = decodeToken(newToken);
          setUser(payload);
        } else {
          setUser(null);
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [decodeToken]);

  const loginWithToken = useCallback((token, { persist = true } = {}) => {
    if (!token) return;
    const payload = decodeToken(token);
    if (!payload) {
      if (persist) localStorage.removeItem('token');
      setUser(null);
      return;
    }
    if (persist) localStorage.setItem('token', token);
    setUser(payload);
  }, [decodeToken]);

  // Generic login helper
  const login = useCallback((userData, { persistToken = null } = {}) => {
    if (persistToken) localStorage.setItem('token', persistToken);
    setUser(userData);
  }, []);

  // logout: clear token and user, redirect to /login
  const logout = useCallback((opts = { redirect: true }) => {
    localStorage.removeItem('token');
    setUser(null);

  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      setUser,            
      login,  
      loginWithToken,   
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
