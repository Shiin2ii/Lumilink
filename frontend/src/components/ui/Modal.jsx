import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = ''
}) => {
  const getSizeClasses = () => {
    const sizes = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-7xl'
    };
    return sizes[size] || sizes.md;
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`
              bg-gray-800 rounded-xl border border-gray-700 
              w-full ${getSizeClasses()} max-h-[90vh] overflow-hidden
              ${className}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                {title && (
                  <h3 className="text-xl font-semibold text-white">{title}</h3>
                )}
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={XMarkIcon}
                    onClick={onClose}
                    className="ml-auto"
                  />
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-700 bg-gray-800/50">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
