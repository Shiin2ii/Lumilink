import React from 'react';
import { motion } from 'framer-motion';
import Avatar from '../ui/Avatar';
import NotificationDropdown from './NotificationDropdown';
import {
  EyeIcon,
  MagnifyingGlassIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

const DashboardHeader = ({
  user,
  activeTab,
  onToggleSidebar
}) => {
  const getTabTitle = (tab) => {
    const titles = {
      account: 'Tài Khoản',
      analytics: 'Thống Kê',
      links: 'Quản Lý Liên Kết',
      customize: 'Tùy Chỉnh Giao Diện',
      badges: 'Huy Hiệu & Thành Tựu',
      // 'image-host': 'Lưu Trữ Ảnh', // Temporarily hidden
      // 'templates': 'Mẫu Thiết Kế', // Temporarily hidden
      settings: 'Cài Đặt Tài Khoản',
      premium: 'Nâng Cấp Premium'
    };
    return titles[tab] || 'Dashboard';
  };

  const getTabDescription = (tab) => {
    const descriptions = {
      overview: 'Xem tổng quan về hoạt động và thống kê của bạn',
      analytics: 'Phân tích chi tiết lượt truy cập và tương tác',
      links: 'Tạo, chỉnh sửa và quản lý các liên kết trong profile',
      customize: 'Cá nhân hóa giao diện và phong cách profile',
      badges: 'Xem các huy hiệu đã đạt được và tiến độ thành tựu',
      settings: 'Quản lý thông tin tài khoản và cài đặt bảo mật',
      premium: 'Khám phá các tính năng cao cấp và nâng cấp tài khoản'
    };
    return descriptions[tab] || 'Quản lý tài khoản LumiLink của bạn';
  };

  return (
    <header className="dashboard-header bg-gray-800 border-b border-gray-700 px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Section */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0 max-w-[50%] sm:max-w-[60%] lg:max-w-[70%]">
          {/* Mobile Menu Button */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>

          {/* Page Title */}
          <div className="min-w-0 flex-1 header-title">
            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-white truncate">
              {getTabTitle(activeTab)}
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 truncate hidden lg:block">
              {getTabDescription(activeTab)}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="header-actions flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          {/* Search - Hidden on mobile and small tablets */}
          <div className="hidden xl:block relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none w-48"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-1">
            {/* View Profile Button */}
            <motion.button
              onClick={() => window.open(`/${user?.username}`, '_blank')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Xem profile công khai"
            >
              <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>

            {/* Notifications */}
            <NotificationDropdown user={user} />
          </div>

          {/* User Avatar - Always visible */}
          <div className="header-avatar flex items-center space-x-2 sm:space-x-3 ml-1 sm:ml-2">
            <div className="hidden lg:block text-right min-w-0">
              <p className="text-white font-medium text-sm truncate max-w-[100px] xl:max-w-[120px]">
                {user?.displayName || user?.username}
              </p>
              <p className="text-gray-400 text-xs truncate max-w-[100px] xl:max-w-[120px]">
                {user?.email}
              </p>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
              <Avatar
                user={user}
                size="sm"
                className="cursor-pointer w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Breadcrumb or Tab Navigation - Hidden on mobile to save space */}
      <div className="mt-3 sm:mt-4 hidden sm:flex items-center space-x-2 text-sm">
        <span className="text-gray-400">Dashboard</span>
        <span className="text-gray-600">/</span>
        <span className="text-purple-400 font-medium truncate">
          {getTabTitle(activeTab)}
        </span>
      </div>
    </header>
  );
};

export default DashboardHeader;
