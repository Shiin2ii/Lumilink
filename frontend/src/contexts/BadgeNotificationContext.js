import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const BadgeNotificationContext = createContext();

export const useBadgeNotifications = () => {
  const context = useContext(BadgeNotificationContext);
  if (!context) {
    throw new Error('useBadgeNotifications must be used within a BadgeNotificationProvider');
  }
  return context;
};

export const BadgeNotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);

  // Handle badge earned events
  useEffect(() => {
    const handleBadgeUpdate = (event) => {
      if (!isEnabled) return;

      const { badges, totalBadges } = event.detail;
      
      badges.forEach((badge, index) => {
        setTimeout(() => {
          // Add to notifications state
          setNotifications(prev => [...prev, {
            id: `badge-${badge.id}-${Date.now()}-${index}`,
            type: 'badge',
            badge,
            totalBadges,
            timestamp: Date.now()
          }]);

          // Show toast notification
          toast.success(
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{badge.icon || '🏆'}</div>
              <div>
                <div className="font-semibold">Huy hiệu mới!</div>
                <div className="text-sm text-gray-600">{badge.name}</div>
              </div>
            </div>,
            {
              duration: 5000,
              position: 'top-right',
              style: {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '12px',
                padding: '16px'
              }
            }
          );
        }, index * 500); // Stagger notifications
      });
    };

    // Listen for badge updates
    window.addEventListener('newBadgesEarned', handleBadgeUpdate);
    
    return () => {
      window.removeEventListener('newBadgesEarned', handleBadgeUpdate);
    };
  }, [isEnabled]);

  // Auto-remove old notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setNotifications(prev => 
        prev.filter(notification => now - notification.timestamp < 30000) // Keep for 30 seconds
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const enableNotifications = () => {
    setIsEnabled(true);
  };

  const disableNotifications = () => {
    setIsEnabled(false);
  };

  const value = {
    notifications,
    isEnabled,
    clearNotifications,
    removeNotification,
    enableNotifications,
    disableNotifications
  };

  return (
    <BadgeNotificationContext.Provider value={value}>
      {children}
    </BadgeNotificationContext.Provider>
  );
};

export default BadgeNotificationContext;
