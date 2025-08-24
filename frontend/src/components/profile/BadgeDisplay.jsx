import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrophyIcon, EyeIcon, CursorArrowRaysIcon, StarIcon } from '@heroicons/react/24/outline';

const BadgeDisplay = ({ username, showAll = false, limit = 3 }) => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/v1/profiles/${username}/badges`);
        const data = await response.json();
        
        if (data.success) {
          const earnedBadges = data.data.earnedBadges || [];
          setBadges(showAll ? earnedBadges : earnedBadges.slice(0, limit));
        } else {
          setError('Failed to load badges');
        }
      } catch (err) {
        console.error('Error fetching badges:', err);
        setError('Failed to load badges');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchBadges();
    }
  }, [username, showAll, limit]);

  const getBadgeIcon = (category, icon) => {
    // Use emoji from database or fallback to category icons
    if (icon) return icon;
    
    switch (category) {
      case 'views': return '👁️';
      case 'clicks': return '👆';
      case 'special': return '⭐';
      case 'achievements': return '🏆';
      default: return '🏅';
    }
  };

  const getBadgeColor = (color) => {
    const colorMap = {
      'blue': 'from-blue-500 to-blue-600',
      'green': 'from-green-500 to-green-600',
      'orange': 'from-orange-500 to-orange-600',
      'purple': 'from-purple-500 to-purple-600',
      'gold': 'from-yellow-500 to-yellow-600',
      'diamond': 'from-gray-300 to-gray-400',
      'special': 'from-pink-500 to-purple-600',
      'pink': 'from-pink-500 to-pink-600'
    };
    
    return colorMap[color] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center space-x-2 py-4">
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        <span className="text-white/70 text-sm">Loading badges...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 text-sm text-center py-2">
        {error}
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <div className="text-white/50 text-sm text-center py-2">
        No badges earned yet
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-center space-x-1 mb-3">
        <TrophyIcon className="w-4 h-4 text-yellow-400" />
        <span className="text-white/80 text-sm font-medium">
          {badges.length} Badge{badges.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className={`grid gap-2 ${showAll ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-3'}`}>
        <AnimatePresence>
          {badges.map((badge, index) => (
            <motion.div
              key={badge.badge_id || index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div 
                className={`
                  relative p-3 rounded-xl border border-white/20 
                  bg-gradient-to-br ${getBadgeColor(badge.badges?.color)} 
                  backdrop-blur-sm hover:scale-105 transition-all duration-300
                  cursor-pointer
                `}
                title={`${badge.badges?.name}: ${badge.badges?.description}`}
              >
                {/* Badge Icon */}
                <div className="text-center">
                  <div className="text-2xl mb-1">
                    {getBadgeIcon(badge.badges?.category, badge.badges?.icon)}
                  </div>
                  <div className="text-white text-xs font-medium truncate">
                    {badge.badges?.name}
                  </div>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                <div className="font-medium">{badge.badges?.name}</div>
                <div className="text-white/70">{badge.badges?.description}</div>
                <div className="text-green-400 text-xs mt-1">
                  Earned {new Date(badge.earned_at).toLocaleDateString()}
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/80"></div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BadgeDisplay;
