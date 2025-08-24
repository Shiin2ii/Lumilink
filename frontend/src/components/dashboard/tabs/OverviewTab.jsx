import React from 'react';
import { motion } from 'framer-motion';
import {
  EyeIcon,
  CursorArrowRaysIcon,
  LinkIcon,
  StarIcon,
  PlusIcon,
  PaintBrushIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

// Reusable UI Components
import Card from '../../ui/Card';
import StatCard from '../../ui/StatCard';
import Button from '../../ui/Button';
import EmptyState from '../../ui/EmptyState';

const OverviewTab = ({ data, refreshData, user, profile }) => {
  const { overview, analytics, links, badges } = data;

  // Quick stats cards
  const statsCards = [
    {
      title: 'Lượt Xem Profile',
      value: analytics.data?.profileViews?.total || 0,
      change: '+12%',
      changeType: 'positive',
      icon: EyeIcon,
      color: 'blue'
    },
    {
      title: 'Lượt Nhấp Liên Kết',
      value: analytics.data?.linkClicks?.total || 0,
      change: '+8%',
      changeType: 'positive',
      icon: CursorArrowRaysIcon,
      color: 'green'
    },
    {
      title: 'Tổng Liên Kết',
      value: links.data?.length || 0,
      change: '+2',
      changeType: 'neutral',
      icon: LinkIcon,
      color: 'purple'
    },
    {
      title: 'Huy Hiệu Đạt Được',
      value: badges.data?.earned?.length || 0,
      change: '+1',
      changeType: 'positive',
      icon: StarIcon,
      color: 'amber'
    }
  ];

  // Quick actions
  const quickActions = [
    {
      title: 'Thêm Liên Kết Mới',
      description: 'Tạo liên kết mới cho profile',
      icon: PlusIcon,
      color: 'blue',
      action: () => refreshData('links')
    },
    {
      title: 'Tùy Chỉnh Giao Diện',
      description: 'Cá nhân hóa profile của bạn',
      icon: PaintBrushIcon,
      color: 'purple',
      action: () => {}
    },
    {
      title: 'Xem Thống Kê',
      description: 'Phân tích chi tiết hoạt động',
      icon: ChartBarIcon,
      color: 'green',
      action: () => {}
    },
    {
      title: 'Xem Profile',
      description: 'Xem profile công khai',
      icon: EyeIcon,
      color: 'amber',
      action: () => window.open(`/${user?.username}`, '_blank')
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Chào mừng trở lại, {user?.displayName || user?.username}! 👋
            </h2>
            <p className="text-gray-300">
              Đây là tổng quan về hoạt động LumiLink của bạn
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
            color={stat.color}
            index={index}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Hành Động Nhanh</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={action.action}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 text-left group hover:bg-gray-750"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`p-3 rounded-lg bg-${action.color}-500/20 mb-4 inline-block`}>
                <action.icon className={`w-6 h-6 text-${action.color}-400`} />
              </div>
              <h4 className="text-white font-semibold mb-2 group-hover:text-purple-300 transition-colors">
                {action.title}
              </h4>
              <p className="text-gray-400 text-sm">
                {action.description}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Hoạt Động Gần Đây</h3>
        <Card>
          {analytics.data?.dailyStats?.length > 0 ? (
            <div className="space-y-4">
              {analytics.data.dailyStats.slice(0, 5).map((day, index) => (
                <div key={day.date} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="text-white font-medium">
                        {day.views} lượt xem, {day.clicks} lượt nhấp
                      </p>
                      <p className="text-gray-400 text-sm">
                        {new Date(day.date).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-400 text-sm">
                    {Math.round((day.clicks / day.views) * 100) || 0}% CTR
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={ChartBarIcon}
              description="Chưa có hoạt động nào. Hãy chia sẻ profile để bắt đầu!"
            />
          )}
        </Card>
      </div>

      {/* Profile Preview */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Xem Trước Profile</h3>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="text-white font-semibold">@{user?.username}</p>
                <p className="text-gray-400 text-sm">{user?.bio || 'Chưa có bio'}</p>
              </div>
            </div>
            <button
              onClick={() => window.open(`/${user?.username}`, '_blank')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Xem Profile
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Profile URL: <span className="text-purple-400">lumilink.com/{user?.username}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
