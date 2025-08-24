import React from 'react';
import { motion } from 'framer-motion';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

const StatCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color = 'blue',
  description,
  loading = false,
  index = 0
}) => {
  const getChangeIcon = () => {
    if (changeType === 'positive') return ArrowTrendingUpIcon;
    if (changeType === 'negative') return ArrowTrendingDownIcon;
    return null;
  };

  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-green-400';
    if (changeType === 'negative') return 'text-red-400';
    return 'text-gray-400';
  };

  const ChangeIcon = getChangeIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gray-800 rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-700 hover:border-gray-600 transition-colors"
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-lg bg-${color}-500/20 flex-shrink-0`}>
          {Icon && <Icon className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-${color}-400`} />}
        </div>
        {change && (
          <div className={`flex items-center space-x-1 text-xs sm:text-sm ${getChangeColor()}`}>
            {ChangeIcon && <ChangeIcon className="w-3 h-3 sm:w-4 sm:h-4" />}
            <span className="hidden sm:inline">{change}</span>
          </div>
        )}
      </div>

      <div>
        {loading ? (
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-gray-700 rounded mb-2"></div>
            <div className="h-3 sm:h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        ) : (
          <>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">
              {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
            </p>
            <p className="text-gray-400 text-xs sm:text-sm mb-1 truncate">{title}</p>
            {description && (
              <p className="text-gray-500 text-xs hidden sm:block">{description}</p>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
