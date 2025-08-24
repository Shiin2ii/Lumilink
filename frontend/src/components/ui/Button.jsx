import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
  const getVariantClasses = () => {
    const variants = {
      primary: 'bg-purple-600 hover:bg-purple-700 text-white border-purple-500/50',
      secondary: 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600',
      outline: 'bg-transparent hover:bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-500',
      danger: 'bg-red-600 hover:bg-red-700 text-white border-red-500/50',
      success: 'bg-green-600 hover:bg-green-700 text-white border-green-500/50',
      ghost: 'bg-transparent hover:bg-gray-700/50 text-gray-300 border-transparent'
    };
    return variants[variant] || variants.primary;
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg'
    };
    return sizes[size] || sizes.md;
  };

  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-lg border
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-purple-500/50
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={`
        ${baseClasses}
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
      `}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      )}
      
      {Icon && iconPosition === 'left' && !loading && (
        <Icon className={`w-4 h-4 ${children ? 'mr-2' : ''}`} />
      )}
      
      {children}
      
      {Icon && iconPosition === 'right' && !loading && (
        <Icon className={`w-4 h-4 ${children ? 'ml-2' : ''}`} />
      )}
    </motion.button>
  );
};

export default Button;
