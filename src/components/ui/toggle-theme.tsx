import React from 'react';
import { Button } from './button';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../lib/theme';

// Function to get initial theme from localStorage or system preference
const getInitialTheme = (): 'light' | 'dark' => {
  // Check if window is defined (for SSR)
  if (typeof window !== 'undefined') {
    // Check localStorage first
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
    
    // If no preference in localStorage, use system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  
  // Default to light theme
  return 'light';
};

const ToggleTheme: React.FC = () => {
  const { theme, toggleTheme, mounted } = useTheme();

  // Prevent flash of unstyled content
  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="transition-all duration-200 ease-in-out rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      {theme === 'light' ? (
        <Moon size={18} className="text-slate-900 transition-all duration-300" />
      ) : (
        <Sun size={18} className="text-white transition-all duration-300" />
      )}
    </Button>
  );
};

export default ToggleTheme; 