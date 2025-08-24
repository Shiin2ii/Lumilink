import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellIcon,
  XMarkIcon,
  CheckIcon,
  EyeIcon,
  LinkIcon,
  UserPlusIcon,
  TrophyIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
// Simple time formatting utility
const formatTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Vừa xong';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  return `${Math.floor(diffInSeconds / 2592000)} tháng trước`;
};

const NotificationDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // Mock notifications data - replace with real API call
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'profile_view',
        title: 'Profile được xem',
        message: 'Có 5 lượt xem profile mới trong 24h qua',
        icon: EyeIcon,
        color: 'blue',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false
      },
      {
        id: 2,
        type: 'link_click',
        title: 'Link được nhấp',
        message: 'Link "Instagram" được nhấp 12 lần',
        icon: LinkIcon,
        color: 'green',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: false
      },
      {
        id: 3,
        type: 'badge_earned',
        title: 'Huy hiệu mới!',
        message: 'Bạn đã nhận được huy hiệu "Người mới"',
        icon: TrophyIcon,
        color: 'yellow',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        read: true
      },
      {
        id: 4,
        type: 'follower',
        title: 'Follower mới',
        message: '3 người đã theo dõi profile của bạn',
        icon: UserPlusIcon,
        color: 'purple',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        read: true
      }
    ];
    
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const removeNotification = (id) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      const newNotifications = prev.filter(n => n.id !== id);
      
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      return newNotifications;
    });
  };

  const getNotificationColor = (color) => {
    const colors = {
      blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/20 text-blue-400',
      green: 'from-green-500/20 to-green-600/20 border-green-500/20 text-green-400',
      yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/20 text-yellow-400',
      purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/20 text-purple-400',
      red: 'from-red-500/20 to-red-600/20 border-red-500/20 text-red-400'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="relative z-[9999]" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
        title="Thông báo"
      >
        <BellIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 min-w-[12px] h-3 sm:min-w-[16px] sm:h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Content */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-80 lg:w-96 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-[10000] max-h-[80vh] overflow-hidden"
            >
            {/* Header */}
            <div className="p-3 sm:p-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0">
                  <BellIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                  <h3 className="text-white font-semibold text-sm sm:text-base">Thông báo</h3>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-red-500 text-white text-xs font-bold rounded-full flex-shrink-0">
                      {unreadCount}
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm font-medium transition-colors flex-shrink-0"
                  >
                    <span className="hidden sm:inline">Đánh dấu tất cả</span>
                    <span className="sm:hidden">Đọc hết</span>
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y divide-gray-700">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 sm:p-4 hover:bg-gray-700/50 transition-colors relative touch-manipulation ${
                        !notification.read ? 'bg-purple-500/5' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        {/* Icon */}
                        <div className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-br border ${getNotificationColor(notification.color)} flex-shrink-0`}>
                          <notification.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-medium text-xs sm:text-sm">{notification.title}</h4>
                              <p className="text-gray-400 text-xs mt-1 leading-relaxed line-clamp-2">{notification.message}</p>
                              <p className="text-gray-500 text-xs mt-1 sm:mt-2">
                                {formatTimeAgo(notification.timestamp)}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-1 mt-2 sm:mt-0 sm:ml-2 flex-shrink-0">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-1.5 sm:p-1 text-gray-400 hover:text-green-400 transition-colors touch-manipulation"
                                  title="Đánh dấu đã đọc"
                                >
                                  <CheckIcon className="w-4 h-4" />
                                </button>
                              )}

                              <button
                                onClick={() => removeNotification(notification.id)}
                                className="p-1.5 sm:p-1 text-gray-400 hover:text-red-400 transition-colors touch-manipulation"
                                title="Xóa thông báo"
                              >
                                <XMarkIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Unread indicator */}
                      {!notification.read && (
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-purple-500 rounded-full"></div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                // Empty State
                <div className="p-6 sm:p-8 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                    <BellIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
                  </div>
                  <h3 className="text-white font-medium mb-2 text-sm sm:text-base">Không có thông báo</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Bạn sẽ nhận được thông báo khi có hoạt động mới</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-2 sm:p-3 border-t border-gray-700 bg-gray-800/50">
                <button className="w-full text-center text-purple-400 hover:text-purple-300 text-xs sm:text-sm font-medium transition-colors py-2 touch-manipulation">
                  <span className="hidden sm:inline">Xem tất cả thông báo</span>
                  <span className="sm:hidden">Xem tất cả</span>
                </button>
              </div>
            )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
