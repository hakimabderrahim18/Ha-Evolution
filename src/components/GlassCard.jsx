import React from 'react';
import useTilt from '../hooks/useTilt';

export default function GlassCard({ children, className = '', tilt = true, glow = false, glowColor = 'accent', ...props }) {
  const tiltRef = useTilt(tilt ? 8 : 0);

  const glowStyles = {
    accent: 'glass-glow-accent',
    primary: 'glass-glow-primary',
    success: 'glass-glow-success'
  };

  const glowClass = glow ? glowStyles[glowColor] || glowStyles.accent : '';

  return (
    <div
      ref={tilt ? tiltRef : null}
      className={`glass ${glowClass} rounded-2xl p-6 transition-all duration-300 relative overflow-hidden ${className}`}
      {...props}
    >
      {/* Glossy Reflection Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
