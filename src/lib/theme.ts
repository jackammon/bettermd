import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

// Function to get initial theme from localStorage or system preference
export const getInitialTheme = (): Theme => {
  // Check if window is defined (for SSR)
  if (typeof window !== 'undefined') {
    // Check localStorage first
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme as Theme;
    }
    
    // If no preference in localStorage, use system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  
  // Default to light theme
  return 'light';
};

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [mounted, setMounted] = useState(false);

  // Mark component as mounted after initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply theme to document and save to localStorage when theme changes
  useEffect(() => {
    if (!mounted) return;
    
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save theme to localStorage
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme, mounted };
}; 