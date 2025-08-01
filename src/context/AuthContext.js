import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // On initial load, check for a token in localStorage
    try {
      // Check both storages, prioritizing localStorage for "remember me"
      const token = localStorage.getItem('session_token') || sessionStorage.getItem('session_token');
      if (token) {
        const decodedUser = jwtDecode(token);
        // Optional: Check if token is expired
        if (decodedUser.exp * 1000 > Date.now()) {
          setUser({ ...decodedUser, token });
        } else {
          localStorage.removeItem('session_token');
          sessionStorage.removeItem('session_token');
        }
      }
    } catch (error) {
      console.error('Failed to decode token on initial load', error);
      localStorage.removeItem('session_token');
      sessionStorage.removeItem('session_token');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (token, rememberMe = false) => {
    if (rememberMe) {
      localStorage.setItem('session_token', token);
    } else {
      sessionStorage.setItem('session_token', token);
    }
    const decodedUser = jwtDecode(token);
    const userWithToken = { ...decodedUser, token };
    setUser(userWithToken);
    return userWithToken;
  };

  const logout = () => {
    localStorage.removeItem('session_token');
    sessionStorage.removeItem('session_token');
    setUser(null);
    navigate('/login');
  };

  const updateUser = (newUserData) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      // This updates the user state in the client. The new data will be
      // fetched from a fresh token on the next login.
      return { ...prevUser, ...newUserData };
    });
  };

  const value = { user, login, logout, loading, updateUser };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};