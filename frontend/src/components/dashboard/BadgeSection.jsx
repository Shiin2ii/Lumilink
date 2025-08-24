import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrophyIcon, 
  StarIcon, 
  ChevronRightIcon,
  SparklesIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const BadgeSection = ({ 
  badges, 
  badgeProgress, 
  getBadgeStats, 
  newBadgeNotifications, 
  clearNewBadgeNotifications 
}) => {
  const [showAllBadges, setShowAllBadges] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const stats = getBadgeStats();
  
  // Get recent earned badges (last 3)
  const recentBadges = badges.earned?.slice(0, 3) || [];
  
  // Get badges in progress (showing progress)
  const inProgressBadges = badges.inProgress?.slice(0, 2) || [];

  // Danh mục huy hiệu
  const categories = [
    { id: 'all', name: 'Tất cả', icon: TrophyIcon },
    { id: 'thanh-tuu', name: 'Thành tựu', icon: StarIcon },
    { id: 'luot-nhap', name: 'Lượt nhấp', icon: SparklesIcon },
    { id: 'luot-xem', name: 'Lượt xem', icon: ShieldCheckIcon },
    { id: 'dac-biet', name: 'Đặc biệt', icon: TrophyIcon }
  ];

  // Get rarity color based on badge category and color
  const getRarityColor = (badge) => {
    if (badge.color) {
      const colorMap = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        orange: 'from-orange-500 to-orange-600',
        purple: 'from-purple-500 to-purple-600',
        gold: 'from-yellow-500 to-orange-500',
        pink: 'from-pink-500 to-pink-600',
        special: 'from-purple-500 to-indigo-500',
        diamond: 'from-cyan-500 to-blue-500'
      };
      return colorMap[badge.color] || 'from-gray-500 to-gray-600';
    }

    // Fallback to category-based colors
    const categoryColors = {
      'luot-nhap': 'from-blue-500 to-blue-600',
      'luot-xem': 'from-green-500 to-green-600',
      'thanh-tuu': 'from-purple-500 to-purple-600',
      'dac-biet': 'from-yellow-500 to-orange-500',
      // Legacy support
      clicks: 'from-blue-500 to-blue-600',
      views: 'from-green-500 to-green-600',
      achievements: 'from-purple-500 to-purple-600',
      special: 'from-yellow-500 to-orange-500'
    };
    return categoryColors[badge.category] || 'from-gray-500 to-gray-600';
  };

  // Badge component
  const BadgeCard = ({ badge, isEarned = false, progress = null }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative p-4 rounded-xl border transition-all duration-200 ${
        isEarned 
          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg' 
          : 'bg-gray-800/30 border-gray-700/50 hover:border-gray-600/50'
      }`}
    >
      {/* Badge Icon */}
      <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-2xl ${
        isEarned
          ? `bg-gradient-to-br ${getRarityColor(badge)} text-white shadow-lg`
          : 'bg-gray-700/50 text-gray-400'
      }`}>
        {badge.icon}
      </div>

      {/* Badge Info */}
      <div className="text-center">
        <h4 className={`font-semibold mb-1 ${isEarned ? 'text-gray-900' : 'text-white'}`}>
          {badge.name}
        </h4>
        <p className={`text-sm mb-3 ${isEarned ? 'text-gray-600' : 'text-gray-400'}`}>
          {badge.description}
        </p>

        {/* Progress Bar (for in-progress badges) */}
        {progress && !isEarned && (
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{progress.current}</span>
              <span>{progress.requirement}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, progress.progress)}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {progress.progress}% hoàn thành
            </div>
          </div>
        )}

        {/* Earned Date */}
        {isEarned && badge.earnedAt && (
          <div className="text-xs text-gray-500">
            Đạt được: {new Date(badge.earnedAt).toLocaleDateString('vi-VN')}
          </div>
        )}

        {/* Category Badge */}
        <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
          isEarned
            ? 'bg-yellow-200 text-yellow-800'
            : 'bg-gray-700 text-gray-300'
        }`}>
          {badge.category === 'luot-nhap' && 'Lượt nhấp'}
          {badge.category === 'luot-xem' && 'Lượt xem'}
          {badge.category === 'thanh-tuu' && 'Thành tựu'}
          {badge.category === 'dac-biet' && 'Đặc biệt'}
          {/* Legacy support */}
          {badge.category === 'clicks' && 'Lượt nhấp'}
          {badge.category === 'views' && 'Lượt xem'}
          {badge.category === 'achievements' && 'Thành tựu'}
          {badge.category === 'special' && 'Đặc biệt'}
          {!['luot-nhap', 'luot-xem', 'thanh-tuu', 'dac-biet', 'clicks', 'views', 'achievements', 'special'].includes(badge.category) && badge.category}
        </div>
      </div>

      {/* New Badge Indicator */}
      {newBadgeNotifications.some(n => n.id === badge.id) && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <SparklesIcon className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
            <TrophyIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Huy hiệu</h3>
            <p className="text-gray-400 text-sm">
              {stats.totalEarned}/{stats.totalAvailable} đã đạt được ({stats.completionRate}%)
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowAllBadges(!showAllBadges)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
        >
          <span className="text-gray-300 text-sm">
            {showAllBadges ? 'Thu gọn' : 'Xem tất cả'}
          </span>
          <ChevronRightIcon className={`w-4 h-4 text-gray-400 transition-transform ${
            showAllBadges ? 'rotate-90' : ''
          }`} />
        </button>
      </div>

      {/* Tổng quan thống kê */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-lg p-3 text-center border border-yellow-700/30">
          <div className="text-2xl font-bold text-yellow-400">{stats.totalEarned}</div>
          <div className="text-xs text-yellow-300">Đã đạt được</div>
        </div>
        <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg p-3 text-center border border-blue-700/30">
          <div className="text-2xl font-bold text-blue-400">{stats.inProgress}</div>
          <div className="text-xs text-blue-300">Đang tiến hành</div>
        </div>
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-lg p-3 text-center border border-green-700/30">
          <div className="text-2xl font-bold text-green-400">{stats.completionRate}%</div>
          <div className="text-xs text-green-300">Hoàn thành</div>
        </div>
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg p-3 text-center border border-purple-700/30">
          <div className="text-2xl font-bold text-purple-400">{stats.totalAvailable - stats.totalEarned}</div>
          <div className="text-xs text-purple-300">Còn lại</div>
        </div>
      </div>

      {/* Recent Earned Badges */}
      {recentBadges.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
            <StarIcon className="w-5 h-5 text-yellow-400 mr-2" />
            Huy hiệu gần đây
          </h4>
          <div className="grid grid-cols-3 gap-4">
            {recentBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} isEarned={true} />
            ))}
          </div>
        </div>
      )}

      {/* In Progress Badges */}
      {inProgressBadges.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
            <SparklesIcon className="w-5 h-5 text-blue-400 mr-2" />
            Đang tiến hành
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {inProgressBadges.map((badge) => (
              <BadgeCard 
                key={badge.id} 
                badge={badge} 
                isEarned={false}
                progress={badgeProgress[badge.id]}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Badges (Expandable) */}
      <AnimatePresence>
        {showAllBadges && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {/* Category Filter */}
            <div className="flex space-x-2 mb-4 overflow-x-auto">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{category.name}</span>
                  </button>
                );
              })}
            </div>

            {/* All Badges Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Earned badges */}
              {badges.earned?.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} isEarned={true} />
              ))}
              
              {/* In progress badges */}
              {badges.inProgress?.map((badge) => (
                <BadgeCard 
                  key={badge.id} 
                  badge={badge} 
                  isEarned={false}
                  progress={badgeProgress[badge.id]}
                />
              ))}
              
              {/* Huy hiệu có sẵn */}
              {badges.available?.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} isEarned={false} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Badge Notifications */}
      {newBadgeNotifications.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SparklesIcon className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-300 font-medium">
                Bạn có {newBadgeNotifications.length} huy hiệu mới!
              </span>
            </div>
            <button
              onClick={clearNewBadgeNotifications}
              className="text-yellow-400 hover:text-yellow-300 text-sm"
            >
              Đã xem
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeSection;
