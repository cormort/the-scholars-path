import React from 'react';
import { motion } from 'motion/react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  glass?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const Card = ({ children, glass = false, className = '', ...props }: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl ${glass ? 'glass-effect' : 'paper-card'} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
