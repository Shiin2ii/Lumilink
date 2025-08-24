import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  StarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Reusable UI Components
import Card from '../../ui/Card';
import StatCard from '../../ui/StatCard';
import EmptyState from '../../ui/EmptyState';

// API Services - Using fetch directly like AdminDashboard

const BadgesTab = ({ data }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [badgesData, setBadgesData] = useState({ earned: [], available: [] });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock badges data with enhanced rarity and icons
  const mockBadgesData = data?.badges?.data || {
    earned: [
      {
        id: 'first-link',
        name: 'Người Tiên Phong',
        description: 'Bạn là người đầu tiên tạo profile trên LumiLink',
        icon: 'crown',
        category: 'milestone',
        earnedAt: '2024-01-15',
        rarity: 'legendary',
        status: 'earned',
        progress: 100,
        criteria_description: 'Tạo profile đầu tiên',
        reward_type: 'points',
        reward_value: 100
      },
      {
        id: 'profile-views-100',
        name: 'Người Nổi Tiếng',
        description: 'Profile của bạn đã được xem 100 lần',
        icon: 'star',
        category: 'engagement',
        earnedAt: '2024-01-20',
        rarity: 'uncommon',
        status: 'earned',
        progress: 100,
        criteria_description: 'Đạt 100 lượt xem profile',
        reward_type: 'points',
        reward_value: 25
      }
    ],
    available: [
      {
        id: 'profile-views-1000',
        name: 'Siêu Sao',
        description: 'Profile của bạn đã được xem 1000 lần!',
        icon: 'diamond',
        category: 'engagement',
        progress: 45,
        target: 1000,
        current: 450,
        rarity: 'epic',
        status: 'available',
        criteria_description: 'Đạt 1000 lượt xem profile',
        reward_type: 'premium_days',
        reward_value: 7
      },
      {
        id: 'link-clicks-500',
        name: 'Người Bốc Lửa',
        description: 'Links của bạn đã được click 500 lần',
        icon: 'fire',
        category: 'engagement',
        progress: 30,
        target: 500,
        current: 150,
        rarity: 'rare',
        status: 'available',
        criteria_description: 'Đạt 500 lượt click',
        reward_type: 'points',
        reward_value: 50
      },
      {
        id: 'premium-user',
        name: 'Thành Viên VIP',
        description: 'Nâng cấp lên tài khoản Premium',
        icon: 'crown',
        category: 'premium',
        progress: 0,
        target: 1,
        current: 0,
        rarity: 'epic',
        status: 'available',
        criteria_description: 'Nâng cấp Premium',
        reward_type: 'premium_days',
        reward_value: 30
      },
      {
        id: 'loyal-user',
        name: 'Chiến Binh',
        description: 'Hoạt động liên tục 30 ngày',
        icon: 'shield',
        category: 'milestone',
        progress: 30,
        target: 30,
        current: 9,
        rarity: 'rare',
        status: 'available',
        criteria_description: 'Hoạt động 30 ngày liên tiếp',
        reward_type: 'points',
        reward_value: 75
      },
      {
        id: 'social-butterfly',
        name: 'Bướm Xã Hội',
        description: 'Có 10 khách ghé thăm từ các quốc gia khác nhau',
        icon: 'trophy',
        category: 'engagement',
        progress: 20,
        target: 10,
        current: 2,
        rarity: 'uncommon',
        status: 'available',
        criteria_description: 'Thu hút khách từ 10 quốc gia',
        reward_type: 'points',
        reward_value: 30
      }
    ]
  };

  // Fetch user stats from analytics_summary
  const fetchUserStats = async (token) => {
    try {

      // Get user profile first
      const profileResponse = await fetch('http://localhost:3001/api/v1/profile/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to get profile');
      }

      const profileData = await profileResponse.json();
      const profileId = profileData.data?.id;

      if (!profileId) {
        throw new Error('No profile ID found');
      }

      // Get analytics summary
      const analyticsResponse = await fetch(`http://localhost:3001/api/v1/analytics/summary/${profileId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      let stats = {
        profile_views: 0,
        links_created: 0,
        unique_visitors: 0,
        unique_sessions: 0,
        unique_countries: 0
      };

      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        const summary = analyticsData.data;

        stats = {
          profile_views: summary?.event_count || 0,
          links_created: 0, // Will get from links endpoint
          unique_visitors: summary?.unique_visitors || 0,
          unique_sessions: summary?.unique_sessions || 0,
          unique_countries: summary?.unique_countries || 0
        };
      }

      // Get links count
      const linksResponse = await fetch(`http://localhost:3001/api/v1/links/profile/${profileId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (linksResponse.ok) {
        const linksData = await linksResponse.json();
        stats.links_created = linksData.data?.length || 0;
      }

      return stats;

    } catch (error) {
      console.error('❌ Error fetching user stats:', error);
      return {
        profile_views: 0,
        links_created: 0,
        unique_visitors: 0,
        unique_sessions: 0,
        unique_countries: 0
      };
    }
  };

  // Fetch badges data
  const fetchBadgesData = async () => {
    setLoading(true);
    try {

      // Check authentication
      const token = localStorage.getItem('lumilink_token') || localStorage.getItem('token');

      // Load user badges using fetch (like AdminDashboard)
      const userBadgesResponse = await fetch('http://localhost:3001/api/v1/badges/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Try public endpoint first, fallback to admin endpoint if needed
      let allBadgesResponse = await fetch('http://localhost:3001/api/v1/badges', {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // If public endpoint fails, try admin endpoint
      if (!allBadgesResponse.ok) {
        allBadgesResponse = await fetch('http://localhost:3001/api/v1/admin/badges', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      // Parse responses
      const userBadges = userBadgesResponse.ok ? await userBadgesResponse.json() : { data: [] };
      const allBadges = allBadgesResponse.ok ? await allBadgesResponse.json() : { data: [] };


      // Get user stats for progress calculation
      const userStats = await fetchUserStats(token);

      // Process the data - check if responses have data property
      const userBadgesData = userBadges?.data || userBadges || [];
      const allBadgesData = allBadges?.data || allBadges || [];



      // Helper function to calculate progress
      const calculateProgress = (badge) => {
        const currentValue = userStats[badge.criteria_type] || 0;
        const targetValue = badge.target_value || 1;
        const progress = Math.min((currentValue / targetValue) * 100, 100);

        return {
          current: currentValue,
          target: targetValue,
          percentage: Math.round(progress),
          isCompleted: currentValue >= targetValue
        };
      };

      // Separate earned and available badges
      const earnedBadgeIds = new Set(userBadgesData.map(ub => ub.badge_id));

      // Process earned badges with badge details
      const earned = userBadgesData
        .filter(ub => ub.is_completed)
        .map(userBadge => {
          const badgeDetails = allBadgesData.find(badge => badge.id === userBadge.badge_id);
          return {
            ...badgeDetails,
            ...userBadge,
            status: 'earned',
            earnedAt: userBadge.earned_at,
            progress: 100,
            current: badgeDetails?.target_value || 0,
            target: badgeDetails?.target_value || 0,
            rarity: badgeDetails?.rarity || 'common',
            // Map database fields to expected format
            criteria_description: badgeDetails?.criteria_description,
            reward_type: badgeDetails?.reward_type,
            reward_value: badgeDetails?.reward_value
          };
        })
        .filter(badge => badge.name);

      // Process available badges with progress
      const available = allBadgesData
        .filter(badge => !earnedBadgeIds.has(badge.id))
        .map(badge => {
          const progressData = calculateProgress(badge);
          return {
            ...badge,
            status: 'available',
            progress: progressData.percentage,
            current: progressData.current,
            target: progressData.target,
            rarity: badge.rarity || 'common',
            // Map database fields to expected format
            criteria_description: badge.criteria_description,
            reward_type: badge.reward_type,
            reward_value: badge.reward_value
          };
        });



      setBadgesData({
        earned,
        available
      });

    } catch (error) {
      console.error('Error fetching badges:', error);
      toast.error('Không thể tải dữ liệu huy hiệu');

      // Set empty arrays on error to prevent undefined issues
      setBadgesData({
        earned: [],
        available: []
      });
    } finally {
      setLoading(false);
    }
  };



  // Load data on component mount
  useEffect(() => {
    fetchBadgesData();
  }, []);

  // Sync data from props if available
  useEffect(() => {
    if (data?.badges) {
      setBadgesData({
        earned: data.badges.earned || [],
        available: data.badges.available || []
      });
    }
  }, [data]);

  // Use real data if available, fallback to mock data
  const currentBadgesData = (badgesData?.earned?.length > 0 || badgesData?.available?.length > 0) ? badgesData : mockBadgesData;

  const categoriesData = [
    { id: 'all', name: 'Tất Cả', count: (currentBadgesData?.earned?.length || 0) + (currentBadgesData?.available?.length || 0) },
    { id: 'earned', name: 'Đã Đạt', count: currentBadgesData?.earned?.length || 0 },
    { id: 'milestone', name: 'Cột Mốc', count: (currentBadgesData?.earned?.filter(b => b.category === 'milestone')?.length || 0) + (currentBadgesData?.available?.filter(b => b.category === 'milestone')?.length || 0) },
    { id: 'engagement', name: 'Tương Tác', count: (currentBadgesData?.earned?.filter(b => b.category === 'engagement')?.length || 0) + (currentBadgesData?.available?.filter(b => b.category === 'engagement')?.length || 0) },
    { id: 'premium', name: 'Premium', count: (currentBadgesData?.earned?.filter(b => b.category === 'premium')?.length || 0) + (currentBadgesData?.available?.filter(b => b.category === 'premium')?.length || 0) }
  ];



  const getRarityConfig = (rarity) => {
    const configs = {
      common: {
        name: 'Phổ Biến',
        color: 'green',
        bgGradient: 'from-green-500 to-emerald-600',
        borderColor: 'border-green-500',
        textColor: 'text-green-400',
        glowColor: 'shadow-green-500/30'
      },
      uncommon: {
        name: 'Không Phổ Biến',
        color: 'gray',
        bgGradient: 'from-gray-500 to-gray-600',
        borderColor: 'border-gray-500',
        textColor: 'text-gray-400',
        glowColor: 'shadow-gray-500/20'
      },
      rare: {
        name: 'Hiếm',
        color: 'blue',
        bgGradient: 'from-blue-500 to-cyan-600',
        borderColor: 'border-blue-500',
        textColor: 'text-blue-400',
        glowColor: 'shadow-blue-500/30'
      },
      epic: {
        name: 'Sử Thi',
        color: 'purple',
        bgGradient: 'from-purple-500 to-indigo-600',
        borderColor: 'border-purple-500',
        textColor: 'text-purple-400',
        glowColor: 'shadow-purple-500/40'
      },
      legendary: {
        name: 'Huyền Thoại',
        color: 'amber',
        bgGradient: 'from-amber-500 to-orange-600',
        borderColor: 'border-amber-500',
        textColor: 'text-amber-400',
        glowColor: 'shadow-amber-500/50'
      }
    };
    return configs[rarity] || configs.common;
  };

  const filteredBadges = () => {
    const earnedBadges = currentBadgesData?.earned || [];
    const availableBadges = currentBadgesData?.available || [];

    let allBadges = [
      ...earnedBadges.map(badge => ({ ...badge, status: 'earned' })),
      ...availableBadges.map(badge => ({ ...badge, status: 'available' }))
    ];

    // Filter by search term
    if (searchTerm.trim()) {
      allBadges = allBadges.filter(badge =>
        badge.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        badge.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        badge.criteria_description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (activeCategory === 'all') return allBadges;
    if (activeCategory === 'earned') return allBadges.filter(badge => badge.status === 'earned');
    return allBadges.filter(badge => badge.category === activeCategory);
  };

  const stats = [
    {
      title: 'Huy Hiệu Đã Đạt',
      value: currentBadgesData?.earned?.length || 0,
      icon: TrophyIcon,
      color: 'amber'
    },
    {
      title: 'Huy Hiệu Khả Dụng',
      value: currentBadgesData?.available?.length || 0,
      icon: StarIcon,
      color: 'blue'
    },
    {
      title: 'Tiến Độ Trung Bình',
      value: `${Math.round((currentBadgesData?.available?.reduce((acc, badge) => acc + (badge.progress || 0), 0) || 0) / (currentBadgesData?.available?.length || 1)) || 0}%`,
      icon: StarIcon,
      color: 'green'
    }
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-400">Đang tải huy hiệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">Huy Hiệu & Thành Tựu</h2>
          <p className="text-gray-400 text-sm sm:text-base">Kiếm huy hiệu bằng cách hoàn thành thành tích và đạt được các cột mốc</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            index={index}
          />
        ))}
      </div>

      {/* Search and Filter Section */}
      <div className="space-y-3 sm:space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm huy hiệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
          {categoriesData.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                activeCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
        {filteredBadges()?.length > 0 ? (
          filteredBadges().map((badge, index) => {
            const rarity = badge.rarity || 'common';
            const rarityConfig = getRarityConfig(rarity);


            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <Card
                  padding="p-2 sm:p-3"
                  className={`relative overflow-hidden transition-all duration-300 hover:scale-102 h-full flex flex-col ${
                    badge.status === 'earned'
                      ? `${rarityConfig.borderColor} border-2 ${rarityConfig.glowColor} shadow-lg`
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  {/* Rarity Corner */}
                  <div className={`absolute top-0 right-0 w-0 h-0 border-l-[12px] sm:border-l-[15px] border-l-transparent border-t-[12px] sm:border-t-[15px] border-t-${rarityConfig.color}-500`}></div>

                  {/* Earned Status Indicator */}
                  {badge.status === 'earned' && (
                    <div className="absolute top-1 left-1 z-10">
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r ${rarityConfig.bgGradient} rounded-full animate-pulse shadow-lg`}>
                        <div className="w-full h-full rounded-full bg-white/30"></div>
                      </div>
                    </div>
                  )}

                  <div className="text-center flex-1 flex flex-col">
                    {/* Badge Icon with Rarity Styling */}
                    <div className={`relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-1 sm:mb-2 rounded-full flex items-center justify-center transition-all duration-300 ${
                      badge.status === 'earned'
                        ? `bg-gradient-to-br ${rarityConfig.bgGradient} ${rarityConfig.glowColor} shadow-xl border-2 ${rarityConfig.borderColor}`
                        : 'bg-gray-700 border-2 border-gray-600 hover:bg-gray-600'
                    }`}>
                      {/* Badge Icon - Use direct icon from database */}
                      <span className="text-lg sm:text-xl lg:text-2xl">
                        {badge.icon || '🏆'}
                      </span>

                      {/* Shine Effect for Earned Badges */}
                      {badge.status === 'earned' && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent"></div>
                      )}
                    </div>

                    {/* Badge Name */}
                    <h3 className={`font-semibold text-xs sm:text-sm mb-1 line-clamp-2 min-h-[24px] sm:min-h-[32px] flex items-center justify-center text-center ${
                      badge.status === 'earned' ? rarityConfig.textColor : 'text-gray-300'
                    }`}>
                      {badge.name}
                    </h3>

                    {/* Badge Description - Hidden on mobile */}
                    <p className="text-gray-400 text-xs mb-1 sm:mb-2 min-h-[20px] sm:min-h-[28px] line-clamp-2 flex items-start justify-center text-center hidden sm:block">
                      {badge.description || 'Không có mô tả'}
                    </p>

                    {/* Progress Bar for Available Badges */}
                    {badge.status === 'available' && badge.progress !== undefined && (
                      <div className="mb-2 sm:mb-3">
                        <div className="flex justify-between text-xs text-gray-400 mb-1 hidden sm:flex">
                          <span>Tiến độ</span>
                          <span>{badge.current || 0}/{badge.target}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2 overflow-hidden">
                          <div
                            className={`bg-gradient-to-r ${rarityConfig.bgGradient} h-1.5 sm:h-2 rounded-full transition-all duration-500 relative`}
                            style={{ width: `${badge.progress}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 rounded-full"></div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 mt-1 text-center sm:text-left">
                          {badge.progress}%
                        </div>
                      </div>
                    )}

                    {/* Info Section - Fixed Height */}
                    <div className="min-h-[60px] mb-2 space-y-1">
                      {/* Earned Date */}
                      {badge.status === 'earned' && badge.earnedAt && (
                        <div className="text-xs text-gray-500 bg-gray-800/50 rounded-lg px-2 py-1">
                          🎉 {new Date(badge.earnedAt).toLocaleDateString('vi-VN')}
                        </div>
                      )}

                      {/* Criteria Description */}
                      {badge.criteria_description && (
                        <div className="text-xs text-gray-500 bg-gray-800/30 rounded-lg px-2 py-1 line-clamp-2">
                          📋 {badge.criteria_description}
                        </div>
                      )}

                      {/* Empty space filler if no info */}
                      {!badge.earnedAt && !badge.criteria_description && (
                        <div className="h-full"></div>
                      )}
                    </div>

                    {/* Bottom Section - Fixed Height */}
                    <div className="mt-auto min-h-[40px] sm:min-h-[56px] flex flex-col justify-end space-y-1 sm:space-y-2">
                      {/* Rarity Badge */}
                      <div className={`inline-flex items-center justify-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold ${
                        badge.status === 'earned'
                          ? `bg-gradient-to-r ${rarityConfig.bgGradient} text-white shadow-lg`
                          : 'bg-gray-700 text-gray-400'
                      }`}>
                        <span className="mr-0.5 sm:mr-1 text-xs">
                          {rarity === 'legendary' && '👑'}
                          {rarity === 'epic' && '💜'}
                          {rarity === 'rare' && '💎'}
                          {rarity === 'uncommon' && '🌟'}
                          {rarity === 'common' && '⚪'}
                        </span>
                        <span className="text-xs hidden sm:inline">{rarityConfig.name}</span>
                      </div>

                      {/* Reward Info */}
                      {badge.reward_type && badge.reward_type !== 'none' ? (
                        <div className={`text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-center ${
                          badge.status === 'earned'
                            ? `text-white bg-gradient-to-r ${rarityConfig.bgGradient} shadow-sm`
                            : `${rarityConfig.textColor} bg-gray-800/50 border border-gray-700`
                        }`}>
                          <span className="hidden sm:inline">🎁 </span>{badge.reward_value} <span className="hidden sm:inline">{badge.reward_type === 'points' ? 'điểm' : badge.reward_type === 'premium_days' ? 'ngày premium' : badge.reward_type}</span>
                        </div>
                      ) : (
                        <div className="h-4 sm:h-6"></div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full">
            <EmptyState
              icon={StarIcon}
              title="Không có huy hiệu nào"
              description="Chưa có huy hiệu nào trong danh mục này. Hãy hoàn thành các thành tích để kiếm huy hiệu!"
            />
          </div>
        )}
      </div>

      {/* Achievement Tips */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">💡 Mẹo Kiếm Huy Hiệu</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-white font-medium">Chia sẻ profile</p>
                <p className="text-gray-400 text-sm">Chia sẻ profile trên mạng xã hội để tăng lượt xem</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-white font-medium">Thêm liên kết hấp dẫn</p>
                <p className="text-gray-400 text-sm">Tạo nhiều liên kết chất lượng để tăng lượt nhấp</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-white font-medium">Tùy chỉnh profile</p>
                <p className="text-gray-400 text-sm">Cá nhân hóa giao diện để thu hút người xem</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-white font-medium">Nâng cấp Premium</p>
                <p className="text-gray-400 text-sm">Mở khóa các huy hiệu đặc biệt và tính năng cao cấp</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BadgesTab;
