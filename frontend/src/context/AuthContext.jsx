import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const [guestMode, setGuestMode] = useState(localStorage.getItem('guestMode') === 'true');

  useEffect(() => {
    // Simulate loading profile from mock data stored in local storage
    const storedUser = localStorage.getItem('mockUser');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (token) {
      // Setup default mock account
      const defaultUser = {
        name: 'Yasith Perera',
        email: 'visitor@museum150.lk',
        role: 'admin', // Make admin by default in mock mode for review convenience
        points: 120,
        earnedBadges: [
          { badgeId: 'first_quiz', title: 'Quiz Explorer', icon: '🏆', earnedAt: new Date() }
        ]
      };
      setUser(defaultUser);
      localStorage.setItem('mockUser', JSON.stringify(defaultUser));
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    // Standard mock verification
    const mockToken = 'mock-jwt-token-key';
    const isCurator = email.includes('admin');
    const mockProfile = {
      name: isCurator ? 'Super Curator' : 'Yasith Perera',
      email: email,
      role: isCurator ? 'admin' : 'visitor',
      points: 150,
      earnedBadges: [
        { badgeId: 'first_quiz', title: 'Quiz Explorer', icon: '🏆', earnedAt: new Date() }
      ]
    };
    
    localStorage.setItem('token', mockToken);
    localStorage.setItem('mockUser', JSON.stringify(mockProfile));
    localStorage.removeItem('guestMode');
    setToken(mockToken);
    setGuestMode(false);
    setUser(mockProfile);
    setLoading(false);
    return { success: true };
  };

  const register = async (name, email, password) => {
    setLoading(true);
    const mockToken = 'mock-jwt-token-key';
    const mockProfile = {
      name: name,
      email: email,
      role: 'visitor',
      points: 0,
      earnedBadges: []
    };
    
    localStorage.setItem('token', mockToken);
    localStorage.setItem('mockUser', JSON.stringify(mockProfile));
    localStorage.removeItem('guestMode');
    setToken(mockToken);
    setGuestMode(false);
    setUser(mockProfile);
    setLoading(false);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('guestMode');
    localStorage.removeItem('mockUser');
    setToken('');
    setUser(null);
    setGuestMode(false);
  };

  const enterGuestMode = () => {
    localStorage.setItem('guestMode', 'true');
    localStorage.removeItem('token');
    localStorage.removeItem('mockUser');
    setToken('');
    setUser(null);
    setGuestMode(true);
  };

  const addPointsAndBadge = async (points, newBadge) => {
    if (guestMode || !user) return;
    
    const updatedUser = { ...user };
    if (points) {
      updatedUser.points += points;
    }
    if (newBadge) {
      const exists = updatedUser.earnedBadges.some(b => b.badgeId === newBadge.badgeId);
      if (!exists) {
        updatedUser.earnedBadges.push(newBadge);
      }
    }
    
    setUser(updatedUser);
    localStorage.setItem('mockUser', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, guestMode, login, register, logout, enterGuestMode, addPointsAndBadge, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
