import React from 'react';
import { motion } from 'framer-motion';

interface StarBorderProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export const StarBorder: React.FC<StarBorderProps> = ({
  children,
  className = '',
  animate = true,
}) => {
  return (
    <div className={`star-border-container ${className}`}>
      {animate && (
        <>
          <motion.div
            className="border-gradient-bottom"
            animate={{
              transform: ['translate(0%, 0%)', 'translate(-100%, 0%)'],
              opacity: [1, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            }}
          />
          <motion.div
            className="border-gradient-top"
            animate={{
              transform: ['translate(0%, 0%)', 'translate(100%, 0%)'],
              opacity: [1, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            }}
          />
        </>
      )}
      <div className="inner-content">
        {children}
      </div>
    </div>
  );
};