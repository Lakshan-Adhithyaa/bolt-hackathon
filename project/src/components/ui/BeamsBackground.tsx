import React, { useEffect, useRef } from 'react';

interface BeamsBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export const BeamsBackground: React.FC<BeamsBackgroundProps> = ({
  className = '',
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const beams: Array<{
      x: number;
      y: number;
      angle: number;
      speed: number;
      length: number;
      opacity: number;
      color: string;
    }> = [];

    const colors = [
      'rgba(168, 85, 247, 0.1)', // Purple
      'rgba(59, 130, 246, 0.1)',  // Blue
      'rgba(16, 185, 129, 0.1)',  // Green
      'rgba(245, 158, 11, 0.1)',  // Yellow
    ];

    // Initialize beams
    for (let i = 0; i < 8; i++) {
      beams.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        angle: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1,
        length: 100 + Math.random() * 200,
        opacity: 0.1 + Math.random() * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      beams.forEach((beam) => {
        // Update position
        beam.x += Math.cos(beam.angle) * beam.speed;
        beam.y += Math.sin(beam.angle) * beam.speed;

        // Wrap around screen
        if (beam.x > canvas.width + beam.length) beam.x = -beam.length;
        if (beam.x < -beam.length) beam.x = canvas.width + beam.length;
        if (beam.y > canvas.height + beam.length) beam.y = -beam.length;
        if (beam.y < -beam.length) beam.y = canvas.height + beam.length;

        // Draw beam
        ctx.save();
        ctx.translate(beam.x, beam.y);
        ctx.rotate(beam.angle);

        const gradient = ctx.createLinearGradient(0, 0, beam.length, 0);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, beam.color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, -2, beam.length, 4);
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <div className="relative" style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};