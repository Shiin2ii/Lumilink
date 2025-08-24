import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { badgeService } from '../../services/badgeService';

// Individual Badge Notification
const BadgeNotification = ({ badge, onClose, onView }) => {
  const rarityColor = badgeService.getRarityColor(badge.rarity);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl max-w-sm w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl"
          >
            🎉
          </motion.div>
          <h3 className="text-white font-bold text-lg">Huy hiệu mới!</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700/50"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Badge Display */}
      <div className="flex items-center space-x-4 mb-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.3,
            type: "spring",
            stiffness: 200
          }}
          className={`w-16 h-16 rounded-xl bg-gradient-to-br ${rarityColor} flex items-center justify-center text-3xl shadow-lg relative`}
        >
          {badge.icon}
          
          {/* Sparkle effect */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent"
          />
        </motion.div>

        <div className="flex-1">
          <h4 className="text-white font-semibold text-lg mb-1">{badge.name}</h4>
          <p className="text-gray-300 text-sm mb-2">{badge.description}</p>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${rarityColor} text-white`}>
              {badge.rarity === 'common' && 'Phổ thông'}
              {badge.rarity === 'uncommon' && 'Không phổ biến'}
              {badge.rarity === 'rare' && 'Hiếm'}
              {badge.rarity === 'epic' && 'Sử thi'}
              {badge.rarity === 'legendary' && 'Huyền thoại'}
              {!['common', 'uncommon', 'rare', 'epic', 'legendary'].includes(badge.rarity) && badge.rarity}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
              {badge.category === 'thanh-tuu' && 'Thành tựu'}
              {badge.category === 'luot-nhap' && 'Lượt nhấp'}
              {badge.category === 'luot-xem' && 'Lượt xem'}
              {badge.category === 'dac-biet' && 'Đặc biệt'}
              {/* Legacy support */}
              {badge.category === 'achievements' && 'Thành tựu'}
              {badge.category === 'clicks' && 'Lượt nhấp'}
              {badge.category === 'views' && 'Lượt xem'}
              {badge.category === 'special' && 'Đặc biệt'}
              {!['thanh-tuu', 'luot-nhap', 'luot-xem', 'dac-biet', 'achievements', 'clicks', 'views', 'special'].includes(badge.category) && badge.category.replace('-', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          onClick={onView}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <CheckIcon className="w-4 h-4" />
          <span>Xem huy hiệu</span>
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
        >
          Bỏ qua
        </button>
      </div>
    </motion.div>
  );
};

// Badge Notification Toast (smaller version)
const BadgeToast = ({ badge, onClose }) => {
  const rarityColor = badgeService.getRarityColor(badge.rarity);

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 shadow-lg flex items-center space-x-3 max-w-sm"
    >
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${rarityColor} flex items-center justify-center text-xl`}
      >
        {badge.icon}
      </motion.div>
      
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm">Đạt được huy hiệu!</p>
        <p className="text-gray-300 text-xs truncate">{badge.name}</p>
      </div>

      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white transition-colors p-1"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// Main Notification System Component
const BadgeNotificationSystem = ({ 
  notifications = [], 
  onCloseNotification, 
  onViewBadge,
  position = 'top-right',
  showToasts = true,
  showFullNotifications = true 
}) => {
  const [activeNotifications, setActiveNotifications] = useState([]);
  const [toastNotifications, setToastNotifications] = useState([]);

  useEffect(() => {
    if (notifications.length > 0) {
      const newNotification = notifications[notifications.length - 1];
      
      if (showFullNotifications) {
        setActiveNotifications(prev => [...prev, newNotification]);
      }
      
      if (showToasts) {
        setToastNotifications(prev => [...prev, newNotification]);
      }
    }
  }, [notifications, showFullNotifications, showToasts]);

  const handleCloseNotification = (notificationId) => {
    setActiveNotifications(prev => prev.filter(n => n.id !== notificationId));
    if (onCloseNotification) {
      onCloseNotification(notificationId);
    }
  };

  const handleCloseToast = (notificationId) => {
    setToastNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleViewBadge = (badge) => {
    if (onViewBadge) {
      onViewBadge(badge);
    }
    // Close the notification after viewing
    handleCloseNotification(badge.id);
  };

  const getPositionClasses = () => {
    const positions = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };
    return positions[position] || positions['top-right'];
  };

  return (
    <>
      {/* Full Notifications */}
      {showFullNotifications && (
        <div className={`fixed ${getPositionClasses()} z-50 space-y-4`}>
          <AnimatePresence>
            {activeNotifications.map((notification) => (
              <BadgeNotification
                key={notification.id}
                badge={notification.badge}
                onClose={() => handleCloseNotification(notification.id)}
                onView={() => handleViewBadge(notification.badge)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Toast Notifications */}
      {showToasts && (
        <div className="fixed top-4 right-4 z-40 space-y-2">
          <AnimatePresence>
            {toastNotifications.map((notification) => (
              <BadgeToast
                key={`toast-${notification.id}`}
                badge={notification.badge}
                onClose={() => handleCloseToast(notification.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

// Badge Achievement Celebration
export const BadgeAchievementCelebration = ({ badge, isVisible, onClose }) => {
  if (!isVisible || !badge) return null;

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
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 50 }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl text-center max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Celebration Animation */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>

          <h2 className="text-3xl font-bold text-white mb-2">Chúc mừng!</h2>
          <p className="text-gray-300 mb-6">Bạn đã đạt được huy hiệu mới!</p>

          {/* Badge Display */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.3,
              type: "spring",
              stiffness: 150
            }}
            className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${badgeService.getRarityColor(badge.rarity)} flex items-center justify-center text-4xl mx-auto mb-4 shadow-2xl`}
          >
            {badge.icon}
          </motion.div>

          <h3 className="text-2xl font-bold text-white mb-2">{badge.name}</h3>
          <p className="text-gray-300 mb-6">{badge.description}</p>

          <button
            onClick={onClose}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            Tuyệt vời!
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BadgeNotificationSystem;
