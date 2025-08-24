import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({
  size = 'md',
  variant = 'primary',
  text,
  fullScreen = false,
  className = '',
  ...props
}) => {
  const sizes = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const variants = {
    primary: 'border-primary-600',
    secondary: 'border-gray-600',
    accent: 'border-accent-yellow',
    white: 'border-white',
    success: 'border-green-600',
    danger: 'border-red-600'
  };

  const spinnerClasses = `
    ${sizes[size]}
    border-2 border-t-transparent rounded-full
    ${variants[variant]}
    ${className}
  `;

  const spinAnimation = {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  };

  const Spinner = () => (
    <motion.div
      className={spinnerClasses}
      animate={spinAnimation}
      {...props}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          <Spinner />
          {text && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-gray-600 font-medium"
            >
              {text}
            </motion.p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <Spinner />
      {text && (
        <span className="ml-3 text-gray-600 font-medium">{text}</span>
      )}
    </div>
  );
};

// Dots Loading Component
const DotsLoading = ({ 
  size = 'md', 
  variant = 'primary',
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const variants = {
    primary: 'bg-primary-600',
    secondary: 'bg-gray-600',
    accent: 'bg-accent-yellow',
    white: 'bg-white'
  };

  const dotClasses = `
    ${sizes[size]}
    rounded-full
    ${variants[variant]}
    ${className}
  `;

  const containerVariants = {
    start: {
      transition: {
        staggerChildren: 0.2
      }
    },
    end: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const dotVariants = {
    start: {
      y: "0%"
    },
    end: {
      y: "100%"
    }
  };

  const dotTransition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut"
  };

  return (
    <motion.div
      className="flex space-x-2"
      variants={containerVariants}
      initial="start"
      animate="end"
      {...props}
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={dotClasses}
          variants={dotVariants}
          transition={dotTransition}
        />
      ))}
    </motion.div>
  );
};

// Pulse Loading Component
const PulseLoading = ({ 
  size = 'md', 
  variant = 'primary',
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const variants = {
    primary: 'bg-primary-600',
    secondary: 'bg-gray-600',
    accent: 'bg-accent-yellow',
    white: 'bg-white'
  };

  const pulseClasses = `
    ${sizes[size]}
    rounded-full
    ${variants[variant]}
    ${className}
  `;

  return (
    <motion.div
      className={pulseClasses}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.5, 1]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      {...props}
    />
  );
};

// Skeleton Loading Component
const SkeletonLoading = ({ 
  lines = 3,
  className = '',
  ...props 
}) => {
  return (
    <div className={`animate-pulse ${className}`} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`bg-gray-200 rounded h-4 mb-3 ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

// Progress Bar Loading Component
const ProgressLoading = ({ 
  progress = 0,
  variant = 'primary',
  size = 'md',
  showPercentage = true,
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const variants = {
    primary: 'bg-primary-600',
    secondary: 'bg-gray-600',
    accent: 'bg-accent-yellow',
    success: 'bg-green-600',
    danger: 'bg-red-600'
  };

  return (
    <div className={`w-full ${className}`} {...props}>
      <div className={`w-full bg-gray-200 rounded-full ${sizes[size]}`}>
        <motion.div
          className={`${sizes[size]} rounded-full ${variants[variant]}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      {showPercentage && (
        <div className="text-sm text-gray-600 mt-2 text-center">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

// Button Loading State
const ButtonLoading = ({ 
  size = 'md',
  variant = 'white',
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <motion.div
      className={`${sizes[size]} border-2 border-t-transparent rounded-full ${
        variant === 'white' ? 'border-white' : 'border-gray-600'
      } ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
      {...props}
    />
  );
};

// Export all components
LoadingSpinner.Dots = DotsLoading;
LoadingSpinner.Pulse = PulseLoading;
LoadingSpinner.Skeleton = SkeletonLoading;
LoadingSpinner.Progress = ProgressLoading;
LoadingSpinner.Button = ButtonLoading;

export default LoadingSpinner;
