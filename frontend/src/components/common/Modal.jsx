import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  ...props
}) => {
  const sizes = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  const variants = {
    default: 'bg-white',
    dark: 'bg-gray-800 text-white',
    glass: 'bg-white/10 backdrop-blur-xl border border-white/20'
  };

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeOnOverlayClick ? onClose : undefined}
          />

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`
                relative w-full ${sizes[size]} 
                ${variants[variant]} 
                rounded-2xl shadow-2xl
                ${className}
              `}
              onClick={(e) => e.stopPropagation()}
              {...props}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  {title && (
                    <h3 className="text-xl font-semibold text-gray-900">
                      {title}
                    </h3>
                  )}
                  {showCloseButton && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5 text-gray-500" />
                    </motion.button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className={title || showCloseButton ? 'p-6' : 'p-6'}>
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Modal Header Component
const ModalHeader = ({ children, className = '', ...props }) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

// Modal Body Component
const ModalBody = ({ children, className = '', ...props }) => (
  <div className={`${className}`} {...props}>
    {children}
  </div>
);

// Modal Footer Component
const ModalFooter = ({ children, className = '', ...props }) => (
  <div className={`mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-3 ${className}`} {...props}>
    {children}
  </div>
);

// Confirmation Modal Component
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác nhận',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'danger',
  loading = false,
  ...props
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      {...props}
    >
      <ModalBody>
        <p className="text-gray-600 mb-6">{message}</p>
      </ModalBody>
      
      <ModalFooter>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          variant={variant}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

// Success Modal Component
const SuccessModal = ({
  isOpen,
  onClose,
  title = 'Thành công!',
  message,
  buttonText = 'Đóng',
  ...props
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      {...props}
    >
      <ModalBody className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <span className="text-2xl">✅</span>
        </motion.div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        {message && <p className="text-gray-600 mb-6">{message}</p>}
        
        <Button
          variant="primary"
          onClick={onClose}
          className="w-full"
        >
          {buttonText}
        </Button>
      </ModalBody>
    </Modal>
  );
};

// Error Modal Component
const ErrorModal = ({
  isOpen,
  onClose,
  title = 'Có lỗi xảy ra!',
  message,
  buttonText = 'Đóng',
  ...props
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      {...props}
    >
      <ModalBody className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <span className="text-2xl">❌</span>
        </motion.div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        {message && <p className="text-gray-600 mb-6">{message}</p>}
        
        <Button
          variant="danger"
          onClick={onClose}
          className="w-full"
        >
          {buttonText}
        </Button>
      </ModalBody>
    </Modal>
  );
};

// Export all components
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.Confirm = ConfirmModal;
Modal.Success = SuccessModal;
Modal.Error = ErrorModal;

export default Modal;
