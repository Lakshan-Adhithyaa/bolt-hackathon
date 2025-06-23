import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from './Button';

interface ThemeToggleProps {
  theme: 'light' | 'dark' | 'auto';
  onThemeChange: (theme: 'light' | 'dark' | 'auto') => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onThemeChange,
  className = '',
}) => {
  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'auto', icon: Monitor, label: 'Auto' },
  ] as const;

  return (
    <div className={`relative inline-flex bg-gray-100 rounded-lg p-1 ${className}`}>
      {themes.map(({ value, icon: Icon, label }) => (
        <motion.button
          key={value}
          onClick={() => onThemeChange(value)}
          className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            theme === value
              ? 'text-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {theme === value && (
            <motion.div
              layoutId="theme-indicator"
              className="absolute inset-0 bg-white rounded-md shadow-sm"
              initial={false}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <div className="relative flex items-center space-x-2">
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
};