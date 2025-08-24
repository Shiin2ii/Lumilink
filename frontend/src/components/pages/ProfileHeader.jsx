import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShareIcon,
  HeartIcon,
  EyeIcon,
  MapPinIcon,
  LinkIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Button from '../common/Button';
import Card from '../common/Card';

const ProfileHeader = ({
  user = {},
  theme = 'default',
  customizable = false,
  showStats = true,
  showActions = true,
  animated = true,
  className = '',
  onEdit,
  onShare,
  onFollow,
  ...props
}) => {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [followersCount, setFollowersCount] = useState(user.followers || 0);

  // Default user data
  const defaultUser = {
    username: 'yourname',
    displayName: 'Your Name',
    bio: 'LumiLink của tôi ✨ Kết nối với tôi qua các platform khác nhau!',
    avatar: null,
    verified: false,
    location: 'Vietnam',
    website: 'https://yourwebsite.com',
    joinDate: '2024',
    followers: 1234,
    following: 567,
    totalViews: 12500,
    totalClicks: 8900,
    ...user
  };

  const themes = {
    default: {
      background: 'bg-gradient-to-br from-white to-gray-50',
      card: 'bg-white/80 backdrop-blur-sm border-white/20',
      text: 'text-gray-900',
      subtext: 'text-gray-600',
      accent: 'text-primary-600'
    },
    dark: {
      background: 'bg-gradient-to-br from-gray-900 to-gray-800',
      card: 'bg-gray-800/80 backdrop-blur-sm border-gray-700/20',
      text: 'text-white',
      subtext: 'text-gray-300',
      accent: 'text-accent-yellow'
    },
    colorful: {
      background: 'bg-gradient-to-br from-purple-500 via-pink-500 to-red-500',
      card: 'bg-white/10 backdrop-blur-xl border-white/20',
      text: 'text-white',
      subtext: 'text-white/80',
      accent: 'text-yellow-300'
    },
    minimal: {
      background: 'bg-white',
      card: 'bg-gray-50 border-gray-200',
      text: 'text-gray-900',
      subtext: 'text-gray-500',
      accent: 'text-blue-600'
    }
  };

  const currentTheme = themes[theme] || themes.default;

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
    onFollow?.(!isFollowing);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${defaultUser.displayName} - LumiLink`,
        text: defaultUser.bio,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You can add a toast notification here
    }
    onShare?.();
  };

  const stats = [
    { label: 'Followers', value: followersCount, icon: HeartIcon },
    { label: 'Following', value: defaultUser.following, icon: LinkIcon },
    { label: 'Views', value: defaultUser.totalViews, icon: EyeIcon }
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className={`${currentTheme.background} ${className}`} {...props}>
      <div className="container mx-auto px-6 py-12">
        <Card
          variant="glass"
          className={`max-w-4xl mx-auto ${currentTheme.card} relative overflow-hidden`}
        >
          {/* Background Pattern */}
          {animated && (
            <div className="absolute inset-0 opacity-5">
              <motion.div
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="w-full h-full"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v-40c11.046 0 20 8.954 20 20z'/%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: "40px 40px"
                }}
              />
            </div>
          )}

          <div className="relative z-10 p-8">
            {/* Main Profile Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-8">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="relative"
              >
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-accent-yellow p-1">
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {defaultUser.avatar ? (
                      <img 
                        src={defaultUser.avatar} 
                        alt={defaultUser.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">👤</span>
                    )}
                  </div>
                </div>
                
                {/* Online Status */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"
                />
              </motion.div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-4"
                >
                  <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                    <h1 className={`text-3xl font-bold ${currentTheme.text}`}>
                      {defaultUser.displayName}
                    </h1>

                  </div>
                  
                  <p className={`text-lg ${currentTheme.accent} mb-3`}>
                    @{defaultUser.username}
                  </p>
                  
                  <p className={`${currentTheme.subtext} max-w-md mx-auto md:mx-0 leading-relaxed`}>
                    {defaultUser.bio}
                  </p>
                </motion.div>

                {/* Meta Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm mb-6"
                >
                  {defaultUser.location && (
                    <div className={`flex items-center space-x-1 ${currentTheme.subtext}`}>
                      <MapPinIcon className="w-4 h-4" />
                      <span>{defaultUser.location}</span>
                    </div>
                  )}
                  
                  {defaultUser.website && (
                    <div className={`flex items-center space-x-1 ${currentTheme.subtext}`}>
                      <LinkIcon className="w-4 h-4" />
                      <a 
                        href={defaultUser.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`hover:${currentTheme.accent} transition-colors`}
                      >
                        Website
                      </a>
                    </div>
                  )}
                  
                  <div className={`flex items-center space-x-1 ${currentTheme.subtext}`}>
                    <CalendarIcon className="w-4 h-4" />
                    <span>Tham gia {defaultUser.joinDate}</span>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                {showActions && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-wrap items-center justify-center md:justify-start gap-3"
                  >
                    {customizable ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={onEdit}
                      >
                        Chỉnh sửa profile
                      </Button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleFollow}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          isFollowing 
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                            : 'bg-primary-600 text-white hover:bg-primary-700'
                        }`}
                      >
                        <AnimatePresence mode="wait">
                          {isFollowing ? (
                            <HeartSolidIcon className="w-4 h-4 text-red-500" />
                          ) : (
                            <HeartIcon className="w-4 h-4" />
                          )}
                        </AnimatePresence>
                        <span>{isFollowing ? 'Đang follow' : 'Follow'}</span>
                      </motion.button>
                    )}
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleShare}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-300"
                    >
                      <ShareIcon className="w-4 h-4" />
                      <span>Chia sẻ</span>
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Stats */}
            {showStats && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200/50"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="text-center cursor-pointer group"
                  >
                    <div className={`flex items-center justify-center mb-2 ${currentTheme.accent} group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-5 h-5 mr-1" />
                    </div>
                    <div className={`text-2xl font-bold ${currentTheme.text} mb-1`}>
                      {formatNumber(stat.value)}
                    </div>
                    <div className={`text-sm ${currentTheme.subtext}`}>
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfileHeader;
