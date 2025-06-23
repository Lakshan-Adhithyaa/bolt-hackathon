import React from 'react';
import { motion } from 'framer-motion';

interface StreakCounterProps {
  streak: number;
  className?: string;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ streak, className = '' }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <motion.span
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ 
          duration: 0.6,
          repeat: Infinity,
          repeatDelay: 3
        }}
        className="text-2xl"
      >
        🔥
      </motion.span>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-orange-600">{streak}</span>
        <span className="text-xs text-gray-500">day streak</span>
      </div>
    </div>
  );
};