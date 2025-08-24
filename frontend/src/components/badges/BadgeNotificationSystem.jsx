import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBadgeNotifications } from '../../contexts/BadgeNotificationContext';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Badge Notification System Component
 * Displays real-time badge notifications when users earn new badges
 */
// Simple fallback component without context
const SimpleBadgeNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleBadgeUpdate = (event) => {
      const { badges } = event.detail;
      badges.forEach((badge, index) => {
        setTimeout(() => {
          setNotifications(prev => [...prev, {
            id: `badge-${badge.id}-${Date.now()}-${index}`,
            type: 'badge',
            badge,
            timestamp: Date.now()
          }]);
        }, index * 500);
      });
    };

    window.addEventListener('newBadgesEarned', handleBadgeUpdate);
    return () => window.removeEventListener('newBadgesEarned', handleBadgeUpdate);
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Auto-remove notifications after 8 seconds
  useEffect(() => {
    notifications.forEach(notification => {
      const timer = setTimeout(() => {
        removeNotification(notification.id);
      }, 8000);
      return () => clearTimeout(timer);
    });
  }, [notifications]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map(notification => (
          <BadgeNotification
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Context-aware component
const ContextBadgeNotifications = () => {
  const { notifications, removeNotification } = useBadgeNotifications();

  // Auto-remove notifications after 8 seconds
  useEffect(() => {
    notifications.forEach(notification => {
      const timer = setTimeout(() => {
        removeNotification(notification.id);
      }, 8000);
      return () => clearTimeout(timer);
    });
  }, [notifications, removeNotification]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map(notification => (
          <BadgeNotification
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Main component with fallback
const BadgeNotificationSystem = () => {
  // Check if we're in a provider context
  try {
    useBadgeNotifications();
    return <ContextBadgeNotifications />;
  } catch (error) {
    console.warn('BadgeNotificationSystem: Using fallback mode');
    return <SimpleBadgeNotifications />;
  }
};

/**
 * Individual Badge Notification Component
 */
const BadgeNotification = ({ notification, onRemove }) => {
  const { badge, totalBadges } = notification;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }}
      className="pointer-events-auto"
    >
      <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black rounded-lg shadow-2xl p-4 max-w-sm border-2 border-yellow-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <motion.span 
              className="text-2xl"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 0.6,
                repeat: 2
              }}
            >
              🎉
            </motion.span>
            <h4 className="font-bold text-sm">Huy hiệu mới!</h4>
          </div>
          <button
            onClick={() => onRemove(notification.id)}
            className="text-black hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-black/10"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Badge Info */}
        <div className="flex items-center space-x-3">
          <motion.div
            className="text-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              repeatDelay: 2
            }}
          >
            {badge.icon}
          </motion.div>
          
          <div className="flex-1">
            <h5 className="font-bold text-base">{badge.name}</h5>
            <p className="text-xs opacity-90 mb-1">{badge.description}</p>
            
            {/* Badge Category */}
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-black/20 px-2 py-1 rounded-full font-medium">
                {getCategoryName(badge.category)}
              </span>
              <span className="text-xs opacity-75">
                Tổng: {totalBadges} huy hiệu
              </span>
            </div>
          </div>
        </div>

        {/* Progress indicator if available */}
        {badge.criteria_description && (
          <div className="mt-3 pt-2 border-t border-black/20">
            <p className="text-xs opacity-75">
              ✅ {badge.criteria_description}
            </p>
          </div>
        )}

        {/* Reward info if available */}
        {badge.reward_type && badge.reward_type !== 'none' && (
          <div className="mt-2">
            <p className="text-xs font-medium">
              🎁 Phần thưởng: {getRewardText(badge.reward_type, badge.reward_value)}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Helper function to get category display name
 */
const getCategoryName = (category) => {
  const categoryMap = {
    'achievement': 'Thành tựu',
    'milestone': 'Cột mốc',
    'special': 'Đặc biệt',
    'seasonal': 'Theo mùa'
  };
  return categoryMap[category] || category;
};

/**
 * Helper function to get reward text
 */
const getRewardText = (rewardType, rewardValue) => {
  const rewardMap = {
    'points': `${rewardValue} điểm`,
    'premium_days': `${rewardValue} ngày Premium`,
    'feature_unlock': 'Mở khóa tính năng'
  };
  return rewardMap[rewardType] || `${rewardType}: ${rewardValue}`;
};

export default BadgeNotificationSystem;
