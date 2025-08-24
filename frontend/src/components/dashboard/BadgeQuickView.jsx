import React from 'react';
import { motion } from 'framer-motion';
import { TrophyIcon, StarIcon, EyeIcon, CursorArrowRaysIcon } from '@heroicons/react/24/outline';

const BadgeQuickView = ({ badges, badgeProgress, getBadgeStats }) => {
  const stats = getBadgeStats();
  
  // Lấy 3 huy hiệu gần đây nhất
  const recentBadges = badges.earned?.slice(0, 3) || [];
  
  // Lấy huy hiệu đang tiến hành có progress cao nhất
  const topProgressBadge = badges.inProgress?.reduce((prev, current) => {
    const prevProgress = badgeProgress[prev.id]?.progress || 0;
    const currentProgress = badgeProgress[current.id]?.progress || 0;
    return currentProgress > prevProgress ? current : prev;
  }, badges.inProgress?.[0]);

  const getCategoryIcon = (category) => {
    const icons = {
      'thanh-tuu': StarIcon,
      'luot-nhap': CursorArrowRaysIcon,
      'luot-xem': EyeIcon,
      'dac-biet': TrophyIcon,
      // Legacy support
      'achievements': StarIcon,
      'clicks': CursorArrowRaysIcon,
      'views': EyeIcon,
      'special': TrophyIcon
    };
    return icons[category] || TrophyIcon;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'thanh-tuu': 'from-purple-500 to-purple-600',
      'luot-nhap': 'from-blue-500 to-blue-600',
      'luot-xem': 'from-green-500 to-green-600',
      'dac-biet': 'from-yellow-500 to-orange-500',
      // Legacy support
      'achievements': 'from-purple-500 to-purple-600',
      'clicks': 'from-blue-500 to-blue-600',
      'views': 'from-green-500 to-green-600',
      'special': 'from-yellow-500 to-orange-500'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <TrophyIcon className="w-5 h-5 text-yellow-400" />
          <h4 className="text-white font-semibold">Huy hiệu</h4>
        </div>
        <div className="text-sm text-gray-400">
          {stats.totalEarned}/{stats.totalAvailable}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Tiến độ tổng thể</span>
          <span>{stats.completionRate}%</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${stats.completionRate}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Recent Badges */}
      {recentBadges.length > 0 && (
        <div className="mb-4">
          <h5 className="text-sm font-medium text-gray-300 mb-2">Gần đây</h5>
          <div className="flex space-x-2">
            {recentBadges.map((badge, index) => {
              const IconComponent = getCategoryIcon(badge.category);
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getCategoryColor(badge.category)} flex items-center justify-center text-lg shadow-lg relative group`}
                  title={badge.name}
                >
                  {badge.icon}
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {badge.name}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Progress Badge */}
      {topProgressBadge && badgeProgress[topProgressBadge.id] && (
        <div className="mb-4">
          <h5 className="text-sm font-medium text-gray-300 mb-2">Đang tiến hành</h5>
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getCategoryColor(topProgressBadge.category)} flex items-center justify-center text-sm`}>
              {topProgressBadge.icon}
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span className="truncate">{topProgressBadge.name}</span>
                <span>{badgeProgress[topProgressBadge.id].progress}%</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                <motion.div 
                  className={`bg-gradient-to-r ${getCategoryColor(topProgressBadge.category)} h-1.5 rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${badgeProgress[topProgressBadge.id].progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800/30 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-yellow-400">{stats.totalEarned}</div>
          <div className="text-xs text-gray-400">Đã đạt</div>
        </div>
        <div className="bg-gray-800/30 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-blue-400">{stats.inProgress}</div>
          <div className="text-xs text-gray-400">Đang làm</div>
        </div>
      </div>

      {/* Categories */}
      <div className="mt-4">
        <h5 className="text-sm font-medium text-gray-300 mb-2">Danh mục</h5>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'thanh-tuu', name: 'Thành tựu', icon: StarIcon },
            { id: 'luot-nhap', name: 'Lượt nhấp', icon: CursorArrowRaysIcon },
            { id: 'luot-xem', name: 'Lượt xem', icon: EyeIcon },
            { id: 'dac-biet', name: 'Đặc biệt', icon: TrophyIcon }
          ].map((category) => {
            const IconComponent = category.icon;
            const count = stats.byCategory?.[category.id] || 0;
            return (
              <div key={category.id} className="flex items-center space-x-2 text-xs">
                <IconComponent className="w-3 h-3 text-gray-400" />
                <span className="text-gray-400 truncate">{category.name}</span>
                <span className="text-gray-300 font-medium">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BadgeQuickView;
