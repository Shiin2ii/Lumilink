import React from 'react';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const inputClasses = `
    w-full px-3 py-2 
    bg-gray-700 border border-gray-600 rounded-lg 
    text-white placeholder-gray-400
    focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors
    ${Icon && iconPosition === 'left' ? 'pl-10' : ''}
    ${Icon && iconPosition === 'right' ? 'pr-10' : ''}
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
    ${className}
  `;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-gray-300 text-sm font-medium">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <Icon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        )}
        
        {type === 'textarea' ? (
          <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={inputClasses}
            {...props}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={inputClasses}
            {...props}
          />
        )}
        
        {Icon && iconPosition === 'right' && (
          <Icon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
        )}
      </div>
      
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
};

export default Input;
