import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Logo = ({ 
  size = 'default', 
  showText = true, 
  variant = 'light',
  className = '',
  to = '/',
  animated = true 
}) => {
  const sizes = {
    small: {
      container: 'text-xl',
      logo: 'w-6 h-6',
      text: 'text-xl'
    },
    default: {
      container: 'text-2xl',
      logo: 'w-8 h-8',
      text: 'text-2xl'
    },
    large: {
      container: 'text-3xl',
      logo: 'w-10 h-10',
      text: 'text-3xl'
    },
    xlarge: {
      container: 'text-4xl',
      logo: 'w-12 h-12',
      text: 'text-4xl'
    }
  };

  const variants = {
    light: {
      text: 'text-white',
      accent: 'text-accent-yellow',
      logo: 'text-white'
    },
    dark: {
      text: 'text-gray-900',
      accent: 'text-primary-500',
      logo: 'text-primary-500'
    }
  };

  const currentSize = sizes[size];
  const currentVariant = variants[variant];

  const LogoContent = () => (
    <div className={`flex items-center space-x-2 ${currentSize.container} font-bold ${className}`}>
             {/* Logo Icon */}
       <div className={`${currentSize.logo} flex items-center justify-center`}>
         <img 
           src="/logo512.png" 
           alt="LumiLink" 
           className="w-full h-full object-contain"
         />
       </div>
      
      {/* Brand Text */}
      {showText && (
        <span className={`${currentSize.text} ${currentVariant.text}`}>
          Lumi<span className={currentVariant.accent}>Link</span>
        </span>
      )}
    </div>
  );

  if (animated) {
    return (
      <Link to={to}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <LogoContent />
        </motion.div>
      </Link>
    );
  }

  return (
    <Link to={to} className="inline-block">
      <LogoContent />
    </Link>
  );
};

export default Logo;
