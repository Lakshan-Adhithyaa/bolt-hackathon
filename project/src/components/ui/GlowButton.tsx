import React from 'react';
import { motion } from 'framer-motion';

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  onClick,
  className = '',
  disabled = false,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`
        glow-button
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        '--glow-color': 'rgb(217, 176, 255)',
        '--glow-spread-color': 'rgba(191, 123, 255, 0.781)',
        '--enhanced-glow-color': 'rgb(231, 206, 255)',
        '--btn-color': 'rgb(100, 61, 136)',
        border: '0.25em solid var(--glow-color)',
        color: 'var(--glow-color)',
        fontWeight: 'bold',
        backgroundColor: 'var(--btn-color)',
        borderRadius: '1em',
        outline: 'none',
        boxShadow: `
          0 0 1em 0.25em var(--glow-color),
          0 0 4em 1em var(--glow-spread-color),
          inset 0 0 0.75em 0.25em var(--glow-color)
        `,
        textShadow: '0 0 0.5em var(--glow-color)',
        position: 'relative',
        transition: 'all 0.3s',
      } as React.CSSProperties}
    >
      {children}
      <div
        className="absolute pointer-events-none"
        style={{
          content: '""',
          position: 'absolute',
          top: '120%',
          left: 0,
          height: '100%',
          width: '100%',
          backgroundColor: 'var(--glow-spread-color)',
          filter: 'blur(2em)',
          opacity: 0.7,
          transform: 'perspective(1.5em) rotateX(35deg) scale(1, 0.6)',
        }}
      />
    </motion.button>
  );
};