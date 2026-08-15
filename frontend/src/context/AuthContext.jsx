import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_BASE = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const [guestMode, setGuestMode] = useState(localStorage.getItem('guestMode') === 'true');

  // On mount: if we have a stored token, fetch real profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const { data } = await axios.get(`${API_BASE}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (data.success) {
            setUser(data.user);
          } else {
            // Token invalid — clear it
            localStorage.removeItem('token');
            setToken('');
          }
        } catch {
          // Backend unreachable or token invalid
          localStorage.removeItem('token');
          setToken('');
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/auth/login`, { email, password });
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.removeItem('guestMode');
        setToken(data.token);
        setUser(data.user);
        setGuestMode(false);
        setLoading(false);
        return { success: true, user: data.user };
      }
      setLoading(false);
      return { success: false, message: data.message };
    } catch (err) {
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Login failed. Check your connection.' };
    }
  };

  const register = async (name, email, password, role = 'visitor') => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/auth/register`, { name, email, password, role });
      if (data.success) {
        // Only auto-login if registering as a visitor (not creating an admin account from dashboard)
        if (role === 'visitor') {
          localStorage.setItem('token', data.token);
          localStorage.removeItem('guestMode');
          setToken(data.token);
          setUser(data.user);
          setGuestMode(false);
        }
        setLoading(false);
        return { success: true, user: data.user };
      }
      setLoading(false);
      return { success: false, message: data.message };
    } catch (err) {
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Registration failed.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('guestMode');
    setToken('');
    setUser(null);
    setGuestMode(false);
  };

  const enterGuestMode = () => {
    localStorage.setItem('guestMode', 'true');
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setGuestMode(true);
  };

  const addPointsAndBadge = async (points, newBadge) => {
    if (guestMode || !user || !token) return;
    try {
      const { data } = await axios.put(
        `${API_BASE}/auth/profile/rewards`,
        { points, newBadge },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setUser(prev => ({ ...prev, points: data.user.points, earnedBadges: data.user.earnedBadges }));
      }
    } catch {
      // Silently fail for points
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, guestMode, login, register, logout, enterGuestMode, addPointsAndBadge, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
