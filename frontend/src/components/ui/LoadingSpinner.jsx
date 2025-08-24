import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'purple', 
  text,
  className = '' 
}) => {
  const getSizeClasses = () => {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16'
    };
    return sizes[size] || sizes.md;
  };

  const getColorClasses = () => {
    const colors = {
      purple: 'border-purple-500',
      blue: 'border-blue-500',
      green: 'border-green-500',
      red: 'border-red-500',
      white: 'border-white',
      gray: 'border-gray-500'
    };
    return colors[color] || colors.purple;
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div 
        className={`
          ${getSizeClasses()} 
          ${getColorClasses()} 
          border-4 border-t-transparent rounded-full animate-spin
        `}
      />
      {text && (
        <p className="text-gray-400 text-sm">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
