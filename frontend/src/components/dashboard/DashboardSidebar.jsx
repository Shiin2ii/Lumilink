import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  LinkIcon,
  PaintBrushIcon,
  StarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  // CloudIcon, // Temporarily hidden
  // DocumentDuplicateIcon, // Temporarily hidden
  UserIcon
} from '@heroicons/react/24/outline';

const DashboardSidebar = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  user,
  onLogout
}) => {
  // Analytics state
  const [analytics, setAnalytics] = useState({
    profileViews: '--',
    linkClicks: '--'
  });
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  // Load analytics data
  const loadAnalytics = async () => {
    if (isLoadingAnalytics) return;

    setIsLoadingAnalytics(true);
    try {
      const token = localStorage.getItem('lumilink_token') || localStorage.getItem('token');
      if (!token) return;

      // Load profile analytics
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';
      const profileResponse = await fetch(`${apiUrl}/analytics/profile?timeRange=7d`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        if (profileData.success) {
          setAnalytics(prev => ({
            ...prev,
            profileViews: profileData.data?.profileViews?.total || 0
          }));
        }
      }

      // Load links analytics
      const linksResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/v1/analytics/links?timeRange=7d`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (linksResponse.ok) {
        const linksData = await linksResponse.json();
        if (linksData.success) {
          setAnalytics(prev => ({
            ...prev,
            linkClicks: linksData.data?.linkClicks?.total || 0
          }));
        }
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  // Load analytics on component mount
  useEffect(() => {
    loadAnalytics();
  }, []);

  const navigationItems = [
    {
      id: 'account',
      name: 'Tài Khoản',
      icon: UserIcon,
      description: 'Thông tin tài khoản'
    },
    {
      id: 'analytics',
      name: 'Thống Kê',
      icon: ChartBarIcon,
      description: 'Phân tích lượt truy cập'
    },
    {
      id: 'links',
      name: 'Liên Kết',
      icon: LinkIcon,
      description: 'Quản lý liên kết'
    },
    {
      id: 'customize',
      name: 'Tùy Chỉnh',
      icon: PaintBrushIcon,
      description: 'Cá nhân hóa giao diện'
    },
    {
      id: 'badges',
      name: 'Huy Hiệu',
      icon: StarIcon,
      description: 'Thành tựu và huy hiệu'
    },
    // Temporarily hidden features
    // {
    //   id: 'image-host',
    //   name: 'Lưu Trữ Ảnh',
    //   icon: CloudIcon,
    //   description: 'Quản lý hình ảnh'
    // },
    // {
    //   id: 'templates',
    //   name: 'Mẫu Thiết Kế',
    //   icon: DocumentDuplicateIcon,
    //   description: 'Templates có sẵn'
    // },
    {
      id: 'settings',
      name: 'Cài Đặt',
      icon: Cog6ToothIcon,
      description: 'Cài đặt tài khoản'
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: StarIcon,
      description: 'Nâng cấp tài khoản',
      premium: true
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-gray-800 border-r border-gray-700 z-50 flex flex-col transition-all duration-300 ease-in-out ${
          // Mobile behavior
          isOpen
            ? 'w-64 translate-x-0 lg:w-64'
            : '-translate-x-full w-64 lg:translate-x-0 lg:w-16'
        }`}
      >
        {/* Header */}
        <div className="h-16 sm:h-20 px-4 sm:px-6 border-b border-gray-700 flex items-center justify-between lg:justify-center">
          {/* Logo - always show on desktop, only when open on mobile */}
          <div className={`flex items-center space-x-3 ${isOpen ? 'block' : 'hidden lg:block'}`}>
            <img src="/logo512.png" alt="LumiLink Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
            {isOpen && <span className="text-white font-bold text-lg sm:text-xl">LumiLink</span>}
          </div>

          {/* Close button for mobile */}
          {isOpen && (
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>



        {/* Navigation */}
        <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
          {navigationItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => {
                setActiveTab(item.id);
                // Close sidebar on mobile after selection
                if (window.innerWidth < 1024) {
                  setIsOpen(false);
                }
              }}
              className={`w-full flex items-center ${isOpen ? 'space-x-3 px-3' : 'justify-center px-2'} py-3 rounded-lg text-left transition-all duration-200 group ${
                activeTab === item.id
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
              }`}
              whileHover={{ x: isOpen ? 4 : 0 }}
              whileTap={{ scale: 0.98 }}
              title={!isOpen ? item.name : undefined}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${
                activeTab === item.id ? 'text-purple-400' : 'text-gray-400 group-hover:text-gray-300'
              }`} />

              {isOpen && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">
                      {item.name}
                    </span>
                    {item.premium && user?.plan !== 'Premium' && (
                      <span className="text-amber-400 text-xs">👑</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {item.description}
                  </p>
                </div>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Footer */}
        <div className={`border-t border-gray-700 ${isOpen ? 'p-4' : 'p-2'}`}>
          {isOpen ? (
            <div className="space-y-3">
              {/* Quick Stats */}
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Profile Views</span>
                  <span className="text-white font-medium">
                    {isLoadingAnalytics ? (
                      <div className="animate-pulse bg-gray-600 h-3 w-6 rounded"></div>
                    ) : (
                      analytics.profileViews
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-gray-400">Link Clicks</span>
                  <span className="text-white font-medium">
                    {isLoadingAnalytics ? (
                      <div className="animate-pulse bg-gray-600 h-3 w-6 rounded"></div>
                    ) : (
                      analytics.linkClicks
                    )}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 group"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span className="text-sm">Đăng Xuất</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
              title="Đăng Xuất"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;
