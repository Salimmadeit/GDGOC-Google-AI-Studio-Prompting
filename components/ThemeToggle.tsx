import React from 'react';
import { Sun, Moon, Zap } from 'lucide-react';
import { Theme } from '../types';

interface ThemeToggleProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className={`flex items-center space-x-1 p-1 rounded-full border ${
      currentTheme === Theme.NEON 
        ? 'bg-black border-cyan-500/50 shadow-neon-blue' 
        : currentTheme === Theme.DARK
        ? 'bg-gray-800 border-gray-700'
        : 'bg-gray-100 border-gray-200'
    }`}>
      <button
        onClick={() => onThemeChange(Theme.LIGHT)}
        className={`p-2 rounded-full transition-all ${
          currentTheme === Theme.LIGHT 
            ? 'bg-white text-yellow-500 shadow-sm' 
            : 'text-gray-400 hover:text-gray-600'
        }`}
        aria-label="Light Mode"
      >
        <Sun size={18} />
      </button>
      <button
        onClick={() => onThemeChange(Theme.DARK)}
        className={`p-2 rounded-full transition-all ${
          currentTheme === Theme.DARK 
            ? 'bg-gray-700 text-blue-400 shadow-sm' 
            : 'text-gray-400 hover:text-gray-200'
        }`}
        aria-label="Dark Mode"
      >
        <Moon size={18} />
      </button>
      <button
        onClick={() => onThemeChange(Theme.NEON)}
        className={`p-2 rounded-full transition-all ${
          currentTheme === Theme.NEON 
            ? 'bg-gray-900 text-orange-500 shadow-neon-orange' 
            : 'text-gray-400 hover:text-orange-400'
        }`}
        aria-label="Neon Mode"
      >
        <Zap size={18} />
      </button>
    </div>
  );
};
