import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RealTimeCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  showChange?: boolean;
}

export const RealTimeCounter: React.FC<RealTimeCounterProps> = ({
  value,
  duration = 800,
  className = '',
  prefix = '',
  suffix = '',
  showChange = false,
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [previousValue, setPreviousValue] = useState(value);
  const [change, setChange] = useState(0);

  useEffect(() => {
    if (value !== displayValue) {
      const diff = value - displayValue;
      setChange(diff);
      setPreviousValue(displayValue);

      const startTime = Date.now();
      const startValue = displayValue;
      const endValue = value;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        
        const currentValue = Math.round(startValue + (endValue - startValue) * easeOutCubic);
        setDisplayValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [value, displayValue, duration]);

  return (
    <div className={`relative ${className}`}>
      <motion.span
        key={displayValue}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.3 }}
        className="inline-block"
      >
        {prefix}{displayValue.toLocaleString()}{suffix}
      </motion.span>

      {/* Change indicator */}
      <AnimatePresence>
        {showChange && change !== 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.8 }}
            transition={{ duration: 0.6 }}
            className={`absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-medium ${
              change > 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {change > 0 ? '+' : ''}{change}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};