import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Toast Context
const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Provider Component
export const ToastProvider = ({ children, position = 'top-right', maxToasts = 5 }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast,
      createdAt: Date.now()
    };

    setToasts(prev => {
      const updated = [newToast, ...prev];
      return updated.slice(0, maxToasts);
    });

    // Auto remove toast
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, [maxToasts]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback((message, options = {}) => {
    return addToast({ type: 'success', message, ...options });
  }, [addToast]);

  const error = useCallback((message, options = {}) => {
    return addToast({ type: 'error', message, duration: 7000, ...options });
  }, [addToast]);

  const warning = useCallback((message, options = {}) => {
    return addToast({ type: 'warning', message, ...options });
  }, [addToast]);

  const info = useCallback((message, options = {}) => {
    return addToast({ type: 'info', message, ...options });
  }, [addToast]);

  const loading = useCallback((message, options = {}) => {
    return addToast({ type: 'loading', message, duration: 0, ...options });
  }, [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
    success,
    error,
    warning,
    info,
    loading
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} position={position} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, position, onRemove }) => {
  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  return (
    <div className={`fixed z-50 ${positions[position]} space-y-2`}>
      <AnimatePresence>
        {toasts.map((toast, index) => (
          <Toast
            key={toast.id}
            toast={toast}
            index={index}
            onRemove={() => onRemove(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Individual Toast Component
const Toast = ({ toast, index, onRemove }) => {
  const { type, message, title, action, icon: CustomIcon } = toast;

  const types = {
    success: {
      icon: CheckCircleIcon,
      colors: 'bg-green-50 border-green-200 text-green-800',
      iconColor: 'text-green-500'
    },
    error: {
      icon: XCircleIcon,
      colors: 'bg-red-50 border-red-200 text-red-800',
      iconColor: 'text-red-500'
    },
    warning: {
      icon: ExclamationTriangleIcon,
      colors: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      iconColor: 'text-yellow-500'
    },
    info: {
      icon: InformationCircleIcon,
      colors: 'bg-blue-50 border-blue-200 text-blue-800',
      iconColor: 'text-blue-500'
    },
    loading: {
      icon: null,
      colors: 'bg-gray-50 border-gray-200 text-gray-800',
      iconColor: 'text-gray-500'
    }
  };

  const config = types[type] || types.info;
  const Icon = CustomIcon || config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      whileHover={{ scale: 1.02 }}
      className={`
        max-w-sm w-full shadow-lg rounded-lg border backdrop-blur-sm
        ${config.colors}
        cursor-pointer
      `}
      onClick={onRemove}
    >
      <div className="p-4">
        <div className="flex items-start">
          {/* Icon */}
          <div className="flex-shrink-0">
            {type === 'loading' ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full"
              />
            ) : Icon ? (
              <Icon className={`w-5 h-5 ${config.iconColor}`} />
            ) : null}
          </div>

          {/* Content */}
          <div className="ml-3 w-0 flex-1">
            {title && (
              <p className="text-sm font-medium">
                {title}
              </p>
            )}
            <p className={`text-sm ${title ? 'mt-1' : ''}`}>
              {message}
            </p>
            
            {/* Action Button */}
            {action && (
              <div className="mt-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick();
                  }}
                  className={`
                    text-sm font-medium underline hover:no-underline
                    ${type === 'success' ? 'text-green-700' :
                      type === 'error' ? 'text-red-700' :
                      type === 'warning' ? 'text-yellow-700' :
                      'text-blue-700'
                    }
                  `}
                >
                  {action.label}
                </motion.button>
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="ml-4 flex-shrink-0 flex">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className={`
                inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2
                ${type === 'success' ? 'text-green-400 hover:bg-green-100 focus:ring-green-600' :
                  type === 'error' ? 'text-red-400 hover:bg-red-100 focus:ring-red-600' :
                  type === 'warning' ? 'text-yellow-400 hover:bg-yellow-100 focus:ring-yellow-600' :
                  'text-blue-400 hover:bg-blue-100 focus:ring-blue-600'
                }
              `}
            >
              <XMarkIcon className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {toast.duration > 0 && (
        <motion.div
          className={`h-1 ${
            type === 'success' ? 'bg-green-200' :
            type === 'error' ? 'bg-red-200' :
            type === 'warning' ? 'bg-yellow-200' :
            'bg-blue-200'
          }`}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: toast.duration / 1000, ease: "linear" }}
        />
      )}
    </motion.div>
  );
};

// Hook for easy toast usage
export const useToastActions = () => {
  const { success, error, warning, info, loading, removeToast } = useToast();

  const showSuccess = useCallback((message, options) => {
    return success(message, options);
  }, [success]);

  const showError = useCallback((message, options) => {
    return error(message, options);
  }, [error]);

  const showWarning = useCallback((message, options) => {
    return warning(message, options);
  }, [warning]);

  const showInfo = useCallback((message, options) => {
    return info(message, options);
  }, [info]);

  const showLoading = useCallback((message, options) => {
    return loading(message, options);
  }, [loading]);

  const dismiss = useCallback((id) => {
    removeToast(id);
  }, [removeToast]);

  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    loading: showLoading,
    dismiss
  };
};

// Utility function for promise-based toasts
export const useToastPromise = () => {
  const { loading, success, error, removeToast } = useToast();

  const toastPromise = (promise, messages, options = {}) => {
    const loadingId = loading(messages.loading || 'Loading...', { duration: 0 });

    return promise
      .then((result) => {
        removeToast(loadingId);
        success(messages.success || 'Success!', options.success);
        return result;
      })
      .catch((err) => {
        removeToast(loadingId);
        error(messages.error || 'Something went wrong!', options.error);
        throw err;
      });
  };

  return toastPromise;
};

export default ToastProvider;
