import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  PhotoIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const AvatarModal = ({ isOpen, onClose, avatarPreview, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Cập Nhật Avatar</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Avatar Preview */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-600"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-600">
                    <PhotoIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="text-center">
                <h3 className="text-white font-medium">Xem trước avatar mới</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Avatar này sẽ được hiển thị trong hồ sơ của bạn
                </p>
              </div>
            </div>

            {/* Guidelines */}
            <div className="mt-6 bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-blue-300 font-medium text-sm">Hướng dẫn avatar</p>
                  <ul className="text-blue-400/80 text-xs mt-1 space-y-1">
                    <li>• Kích thước tối đa: 5MB</li>
                    <li>• Định dạng: JPG, PNG, GIF</li>
                    <li>• Tỷ lệ khuyến nghị: 1:1 (vuông)</li>
                    <li>• Độ phân giải tối thiểu: 200x200px</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                disabled={isLoading}
              >
                Hủy bỏ
              </button>
              
              <button
                onClick={handleSave}
                disabled={isLoading || !avatarPreview}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang tải lên...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-4 h-4" />
                    Cập nhật
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AvatarModal;
