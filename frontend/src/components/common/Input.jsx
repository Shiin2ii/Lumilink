import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  ExclamationCircleIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const Input = forwardRef(({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  success,
  disabled = false,
  required = false,
  icon: Icon,
  className = '',
  size = 'md',
  variant = 'default',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  };

  const variants = {
    default: 'border-gray-200 focus:border-primary-500 focus:ring-primary-500',
    filled: 'bg-gray-50 border-gray-200 focus:bg-white focus:border-primary-500 focus:ring-primary-500',
    outlined: 'border-2 border-gray-300 focus:border-primary-500 focus:ring-primary-500',
    underlined: 'border-0 border-b-2 border-gray-300 focus:border-primary-500 rounded-none px-0'
  };

  const baseClasses = `
    w-full rounded-xl transition-all duration-300 
    focus:outline-none focus:ring-2 focus:ring-opacity-50
    disabled:opacity-50 disabled:cursor-not-allowed
    ${sizes[size]}
    ${variants[variant]}
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
    ${success ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''}
    ${Icon || type === 'password' ? 'pr-12' : ''}
    ${className}
  `;

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <motion.label
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
            error ? 'text-red-600' : 
            success ? 'text-green-600' : 
            isFocused ? 'text-primary-600' : 'text-gray-700'
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}

      {/* Input Container */}
      <div className="relative">
        <motion.input
          ref={ref}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={baseClasses}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          {...props}
        />

        {/* Icons Container */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {/* Custom Icon */}
          {Icon && !error && !success && (
            <Icon className={`w-5 h-5 transition-colors duration-200 ${
              isFocused ? 'text-primary-500' : 'text-gray-400'
            }`} />
          )}

          {/* Success Icon */}
          {success && !error && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
            </motion.div>
          )}

          {/* Error Icon */}
          {error && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
            </motion.div>
          )}

          {/* Password Toggle */}
          {type === 'password' && (
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`p-1 rounded-md transition-colors duration-200 ${
                isFocused ? 'text-primary-500 hover:text-primary-600' : 'text-gray-400 hover:text-gray-600'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </motion.button>
          )}
        </div>
      </div>

      {/* Error/Success/Helper Text */}
      <AnimatePresence>
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2"
          >
            {error && (
              <p className="text-sm text-red-600 flex items-center">
                <ExclamationCircleIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                {error}
              </p>
            )}
            {success && !error && (
              <p className="text-sm text-green-600 flex items-center">
                <CheckCircleIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                {success}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Focus Ring Animation */}
      {isFocused && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-primary-500 pointer-events-none"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 0.3, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
