import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  hover = true,
  clickable = false,
  onClick,
  gradient = false,
  glassmorphism = false,
  shadow = 'md',
  ...props
}) => {
  const variants = {
    default: 'bg-white border border-gray-200',
    filled: 'bg-gray-50 border border-gray-100',
    outlined: 'bg-transparent border-2 border-gray-300',
    elevated: 'bg-white border-0 shadow-lg',
    dark: 'bg-gray-800 border border-gray-700 text-white',
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white border-0',
    accent: 'bg-gradient-to-r from-accent-yellow to-orange-400 text-gray-900 border-0'
  };

  const sizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl'
  };

  const baseClasses = `
    rounded-2xl transition-all duration-300
    ${variants[variant]}
    ${sizes[size]}
    ${shadows[shadow]}
    ${glassmorphism ? 'backdrop-blur-xl bg-white/10 border-white/20' : ''}
    ${clickable ? 'cursor-pointer' : ''}
    ${className}
  `;

  const hoverEffects = hover ? {
    whileHover: { 
      scale: clickable ? 1.02 : 1.01,
      y: -2,
      boxShadow: clickable ? '0 20px 40px rgba(0,0,0,0.1)' : '0 10px 30px rgba(0,0,0,0.05)'
    },
    whileTap: clickable ? { scale: 0.98 } : {}
  } : {};

  const CardComponent = clickable ? motion.div : motion.div;

  return (
    <CardComponent
      className={baseClasses}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...hoverEffects}
      {...props}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-yellow/10 rounded-2xl" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </CardComponent>
  );
};

// Card Header Component
const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

// Card Body Component
const CardBody = ({ children, className = '', ...props }) => (
  <div className={`${className}`} {...props}>
    {children}
  </div>
);

// Card Footer Component
const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`mt-4 pt-4 border-t border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

// Card Title Component
const CardTitle = ({ children, className = '', size = 'lg', ...props }) => {
  const sizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <h3 className={`font-bold text-gray-900 ${sizes[size]} ${className}`} {...props}>
      {children}
    </h3>
  );
};

// Card Description Component
const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-gray-600 ${className}`} {...props}>
    {children}
  </p>
);

// Stats Card Component
const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'increase', 
  icon: Icon,
  color = 'primary',
  className = '',
  ...props 
}) => {
  const colors = {
    primary: 'from-blue-500 to-blue-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-yellow-600',
    danger: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
  };

  return (
    <Card 
      variant="elevated" 
      hover={true}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colors[color]}`}>
          {Icon && <Icon className="w-6 h-6 text-white" />}
        </div>
        {change && (
          <div className={`text-sm font-medium px-2 py-1 rounded-full ${
            changeType === 'increase' 
              ? 'text-green-600 bg-green-100' 
              : 'text-red-600 bg-red-100'
          }`}>
            {change}
          </div>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </Card>
  );
};

// Pricing Card Component
const PricingCard = ({ 
  title, 
  price, 
  period = '/month',
  description, 
  features = [], 
  buttonText = 'Get Started',
  onButtonClick,
  featured = false,
  badge,
  className = '',
  ...props 
}) => {
  return (
    <Card 
      variant={featured ? 'primary' : 'elevated'}
      hover={true}
      clickable={false}
      className={`relative ${featured ? 'scale-105 border-2 border-accent-yellow' : ''} ${className}`}
      {...props}
    >
      {badge && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-accent-yellow to-orange-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">
            {badge}
          </span>
        </div>
      )}
      
      <CardHeader className="text-center">
        <CardTitle className={featured ? 'text-white' : 'text-gray-900'}>{title}</CardTitle>
        <div className={`text-4xl font-bold mt-2 ${featured ? 'text-white' : 'text-gray-900'}`}>
          {price}<span className={`text-lg font-normal ${featured ? 'text-white/80' : 'text-gray-500'}`}>{period}</span>
        </div>
        {description && (
          <CardDescription className={featured ? 'text-white/80' : 'text-gray-600'}>
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardBody>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center ${featured ? 'text-white' : 'text-gray-700'}`}
            >
              <span className="text-green-500 mr-3">✓</span>
              {feature}
            </motion.li>
          ))}
        </ul>
      </CardBody>

      <CardFooter className={`border-t ${featured ? 'border-white/20' : 'border-gray-200'}`}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onButtonClick}
          className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
            featured 
              ? 'bg-white text-primary-600 hover:bg-gray-100' 
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          {buttonText}
        </motion.button>
      </CardFooter>
    </Card>
  );
};

// Export all components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Stats = StatsCard;
Card.Pricing = PricingCard;

export default Card;
