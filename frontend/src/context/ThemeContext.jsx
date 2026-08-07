import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [highContrast, setHighContrast] = useState(localStorage.getItem('highContrast') === 'true');
  const [largeText, setLargeText] = useState(localStorage.getItem('largeText') === 'true');

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Manage Dark Mode class
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Manage High Contrast class
    if (highContrast) {
      root.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
    } else {
      root.classList.remove('high-contrast');
      localStorage.setItem('highContrast', 'false');
    }
  }, [highContrast]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Manage Large Text class
    if (largeText) {
      root.classList.add('text-lg');
      localStorage.setItem('largeText', 'true');
    } else {
      root.classList.remove('text-lg');
      localStorage.setItem('largeText', 'false');
    }
  }, [largeText]);

  return (
    <ThemeContext.Provider value={{
      darkMode, setDarkMode,
      highContrast, setHighContrast,
      largeText, setLargeText
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
