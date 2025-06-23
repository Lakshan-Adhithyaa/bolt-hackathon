import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins } from 'lucide-react';

interface TokenCounterProps {
  tokens: number;
  className?: string;
}

export const TokenCounter: React.FC<TokenCounterProps> = ({ tokens, className = '' }) => {
  const [displayTokens, setDisplayTokens] = useState(tokens);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (tokens !== displayTokens) {
      setIsAnimating(true);
      setTimeout(() => {
        setDisplayTokens(tokens);
        setIsAnimating(false);
      }, 300);
    }
  }, [tokens, displayTokens]);

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <motion.div
        animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.6 }}
      >
        <Coins className="w-5 h-5 text-yellow-500" />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.span
          key={displayTokens}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -90, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="font-semibold text-gray-700"
        >
          {displayTokens.toLocaleString()}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};