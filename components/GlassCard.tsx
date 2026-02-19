
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`molten-glass rounded-2xl p-6 transition-all duration-300 ${onClick ? 'cursor-pointer active:scale-95' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
