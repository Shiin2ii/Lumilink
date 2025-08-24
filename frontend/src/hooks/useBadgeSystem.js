import { useState, useEffect, useCallback } from 'react';
import { badgeService } from '../services/badgeService';
import toast from 'react-hot-toast';

export const useBadgeSystem = (user) => {
  const [badges, setBadges] = useState({
    earned: [],
    inProgress: [],
    available: []
  });
  const [badgeProgress, setBadgeProgress] = useState({});
  const [allBadges, setAllBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBadgeNotifications, setNewBadgeNotifications] = useState([]);

  // Load user badges
  const loadUserBadges = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await badgeService.getUserBadges(user.id);
      if (response.success) {
        setBadges(response.data);
      } else {
        // Use mock data if API fails
        const mockResponse = badgeService.getMockUserBadges();
        setBadges(mockResponse.data);
      }
    } catch (error) {
      console.error('Error loading user badges:', error);
      // Use mock data as fallback
      const mockResponse = badgeService.getMockUserBadges();
      setBadges(mockResponse.data);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Load all available badges
  const loadAllBadges = useCallback(async () => {
    try {
      const response = await badgeService.getAllBadges();
      if (response.success) {
        setAllBadges(response.data);
      }
    } catch (error) {
      console.error('Error loading all badges:', error);
    }
  }, []);

  // Load badge progress
  const loadBadgeProgress = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await badgeService.getBadgeProgress(user.id);
      if (response.success) {
        setBadgeProgress(response.data);
      }
    } catch (error) {
      console.error('Error loading badge progress:', error);
    }
  }, [user?.id]);

  // Check for new badges based on user activity
  const checkForNewBadges = useCallback(async (activityData) => {
    if (!user?.id) return;

    try {
      const response = await badgeService.checkAndAwardBadges(user.id, activityData);
      if (response.success && response.data.newBadges.length > 0) {
        // Update badges state
        setBadges(prev => ({
          ...prev,
          earned: [...prev.earned, ...response.data.newBadges]
        }));

        // Update progress
        if (response.data.updatedProgress) {
          setBadgeProgress(response.data.updatedProgress);
        }

        // Show notifications for new badges
        setNewBadgeNotifications(response.data.newBadges);
        
        // Show toast notifications
        response.data.newBadges.forEach(badge => {
          toast.success(
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{badge.icon}</span>
              <div>
                <p className="font-semibold">Huy hiệu mới đạt được!</p>
                <p className="text-sm text-gray-600">{badge.name}</p>
              </div>
            </div>,
            {
              duration: 5000,
              position: 'top-right'
            }
          );
        });

        return response.data.newBadges;
      }
    } catch (error) {
      console.error('Error checking for new badges:', error);
    }

    return [];
  }, [user?.id]);

  // Calculate badge statistics
  const getBadgeStats = useCallback(() => {
    const totalEarned = badges.earned.length;
    const totalAvailable = allBadges.length;
    const completionRate = totalAvailable > 0 ? Math.round((totalEarned / totalAvailable) * 100) : 0;
    
    const rarityCount = badges.earned.reduce((acc, badge) => {
      acc[badge.rarity] = (acc[badge.rarity] || 0) + 1;
      return acc;
    }, {});

    const categoryCount = badges.earned.reduce((acc, badge) => {
      acc[badge.category] = (acc[badge.category] || 0) + 1;
      return acc;
    }, {});

    return {
      totalEarned,
      totalAvailable,
      completionRate,
      rarityCount,
      categoryCount,
      inProgress: badges.inProgress.length
    };
  }, [badges, allBadges]);

  // Get badges by category
  const getBadgesByCategory = useCallback((category) => {
    return {
      earned: badges.earned.filter(badge => badge.category === category),
      inProgress: badges.inProgress.filter(badge => badge.category === category),
      available: badges.available.filter(badge => badge.category === category)
    };
  }, [badges]);

  // Get badges by rarity
  const getBadgesByRarity = useCallback((rarity) => {
    return badges.earned.filter(badge => badge.rarity === rarity);
  }, [badges.earned]);

  // Check if user has specific badge
  const hasBadge = useCallback((badgeId) => {
    return badges.earned.some(badge => badge.id === badgeId);
  }, [badges.earned]);

  // Get progress for specific badge
  const getBadgeProgress = useCallback((badgeId) => {
    return badgeProgress[badgeId] || { current: 0, requirement: 1, progress: 0 };
  }, [badgeProgress]);

  // Clear new badge notifications
  const clearNewBadgeNotifications = useCallback(() => {
    setNewBadgeNotifications([]);
  }, []);

  // Auto-check badges based on common activities
  const autoCheckBadges = useCallback(async (activityType, data = {}) => {
    const activityData = {
      linksCount: data.linksCount || 0,
      totalClicks: data.totalClicks || 0,
      profileCompletion: data.profileCompletion || 0,
      themesUsed: data.themesUsed || 0,
      socialLinksCount: data.socialLinksCount || 0,
      hasFirstLink: hasBadge('first-link'),
      hasProfileComplete: hasBadge('profile-complete'),
      ...data
    };

    return await checkForNewBadges(activityData);
  }, [checkForNewBadges, hasBadge]);

  // Initialize badge system
  useEffect(() => {
    if (user?.id) {
      loadUserBadges();
      loadBadgeProgress();
    }
    loadAllBadges();
  }, [user?.id, loadUserBadges, loadBadgeProgress, loadAllBadges]);

  return {
    badges,
    badgeProgress,
    allBadges,
    loading,
    newBadgeNotifications,
    
    // Functions
    loadUserBadges,
    loadAllBadges,
    loadBadgeProgress,
    checkForNewBadges,
    autoCheckBadges,
    clearNewBadgeNotifications,
    
    // Utilities
    getBadgeStats,
    getBadgesByCategory,
    getBadgesByRarity,
    hasBadge,
    getBadgeProgress
  };
};

// Hook for badge notifications
export const useBadgeNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((badge) => {
    const notification = {
      id: Date.now(),
      badge,
      timestamp: new Date()
    };
    
    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep only 5 most recent
    
    // Auto remove after 10 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 10000);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications
  };
};

export default useBadgeSystem;
