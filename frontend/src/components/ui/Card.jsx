import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = true,
  padding = 'p-4 sm:p-6',
  background = 'bg-gray-800',
  border = 'border-gray-700',
  ...props
}) => {
  return (
    <motion.div
      className={`${background} rounded-xl border ${border} ${padding} ${
        hover ? 'hover:border-gray-600 transition-colors' : ''
      } ${className}`}
      whileHover={hover ? { y: -2 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
