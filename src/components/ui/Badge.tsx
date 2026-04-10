import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'surface';
  className?: string;
}

export const Badge = ({ children, variant = 'primary', className = '' }: BadgeProps) => {
  const variants = {
    primary: 'bg-primary text-on-primary',
    secondary: 'bg-secondary text-white',
    outline: 'border border-outline-variant text-on-surface-variant',
    surface: 'bg-white/80 backdrop-blur text-primary border border-slate-100',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
