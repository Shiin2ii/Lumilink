import React from 'react';
import Button from './Button';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && (
        <Icon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
      )}
      
      {title && (
        <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      )}
      
      {description && (
        <p className="text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
      )}
      
      {(action || (actionText && onAction)) && (
        <div>
          {action || (
            <Button onClick={onAction}>
              {actionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
