/**
 * =============================================================================
 * BADGE CONTROLLER
 * =============================================================================
 * Badge system management:
 * - Get all badges
 * - Get user badges
 * - Badge leaderboard
 * - Award badges
 */

const Badge = require('../models/Badge');
const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');


/**
 * Get all available badges
 */
const getAllBadges = async (req, res) => {
  try {
    const { category } = req.query;
    
    let badges;
    if (category) {
      badges = await Badge.getBadgesByCategory(category);
    } else {
      badges = await Badge.getAllBadges();
    }

    res.json({
      success: true,
      data: badges
    });

  } catch (error) {
    console.error('❌ Get all badges failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get badges'
    });
  }
};

/**
 * Get badge categories
 */
const getBadgeCategories = async (req, res) => {
  try {
    const categories = [
      { id: 'luot-xem', name: 'Lượt xem', description: 'Cột mốc lượt xem hồ sơ', icon: '👁️' },
      { id: 'luot-nhap', name: 'Lượt nhấp', description: 'Thành tựu lượt nhấp liên kết', icon: '👆' },
      { id: 'dac-biet', name: 'Đặc biệt', description: 'Huy hiệu độc quyền', icon: '⭐' },
      { id: 'thanh-tuu', name: 'Thành tựu', description: 'Thành tích chung', icon: '🏆' }
    ];

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('❌ Get badge categories failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get badge categories'
    });
  }
};

/**
 * Get user's badges with progress
 */
const getUserBadges = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userBadges = await Badge.getUserBadges(user.id);
    const allBadges = await Badge.getAllBadges();

    // Combine user badges with all available badges
    const badgesWithProgress = allBadges.map(badge => {
      const userBadge = userBadges.find(ub => ub.badge_id === badge.id);
      return {
        ...badge,
        progress: userBadge?.progress || 0,
        isCompleted: userBadge?.is_completed || false,
        earnedAt: userBadge?.earned_at || null
      };
    });

    res.json({
      success: true,
      data: {
        badges: badgesWithProgress,
        earnedCount: userBadges.filter(b => b.is_completed).length,
        totalCount: allBadges.length
      }
    });

  } catch (error) {
    console.error('❌ Get user badges failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user badges'
    });
  }
};

/**
 * Get badge leaderboard
 */
const getBadgeLeaderboard = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const leaderboard = await Badge.getBadgeLeaderboard(parseInt(limit));

    res.json({
      success: true,
      data: leaderboard
    });

  } catch (error) {
    console.error('❌ Get badge leaderboard failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get badge leaderboard'
    });
  }
};

/**
 * Award badge to user (admin only)
 */
const awardBadge = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { userId, badgeId } = req.body;

    if (!userId || !badgeId) {
      return res.status(400).json({
        success: false,
        message: 'User ID and Badge ID are required'
      });
    }

    const result = await Badge.awardBadge(userId, badgeId);

    if (result) {
      res.json({
        success: true,
        message: 'Badge awarded successfully',
        data: result
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to award badge'
      });
    }

  } catch (error) {
    console.error('❌ Award badge failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to award badge'
    });
  }
};

/**
 * Check and award badges based on user activity
 */
const checkAndAwardBadges = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const decoded = verifyToken(token);
    const { userId, activityData } = req.body;

    // Verify user can only check their own badges or admin can check any
    const user = await User.findById(decoded.userId);
    if (!user || (user.id !== userId && user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get all badges and user's current badges
    const allBadges = await Badge.getAllBadges();
    const userBadges = await Badge.getUserBadges(userId);
    const earnedBadgeIds = userBadges.filter(ub => ub.is_completed).map(ub => ub.badge_id);

    const newBadges = [];
    const updatedProgress = {};

    // Check each badge for completion
    for (const badge of allBadges) {
      if (earnedBadgeIds.includes(badge.id)) continue; // Already earned

      let progress = 0;
      let shouldAward = false;

      // Badge logic based on category and type
      switch (badge.category) {
        case 'luot-xem':
        case 'views': // Legacy support
          progress = activityData.profileViews || 0;
          shouldAward = progress >= badge.target_value;
          break;
        case 'luot-nhap':
        case 'clicks': // Legacy support
          progress = activityData.totalClicks || 0;
          shouldAward = progress >= badge.target_value;
          break;
        case 'thanh-tuu':
        case 'achievements': // Legacy support
          if (badge.id === 'first-link') {
            progress = activityData.linksCount || 0;
            shouldAward = progress >= 1;
          } else if (badge.id === 'profile-complete') {
            progress = activityData.profileCompletion || 0;
            shouldAward = progress >= 100;
          } else if (badge.id === 'social-butterfly') {
            progress = activityData.socialLinksCount || 0;
            shouldAward = progress >= badge.target_value;
          }
          break;
        case 'dac-biet':
        case 'special': // Legacy support
          // Special badges are manually awarded
          break;
      }

      // Update progress
      if (progress > 0) {
        await Badge.updateBadgeProgress(userId, badge.id, progress);
        updatedProgress[badge.id] = {
          current: progress,
          requirement: badge.target_value,
          progress: Math.min(100, Math.round((progress / badge.target_value) * 100))
        };
      }

      // Award badge if criteria met
      if (shouldAward) {
        const awardedBadge = await Badge.awardBadge(userId, badge.id);
        if (awardedBadge) {
          newBadges.push({
            id: badge.id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            category: badge.category,
            rarity: badge.rarity || 'common'
          });
        }
      }
    }

    res.json({
      success: true,
      data: {
        newBadges,
        updatedProgress
      }
    });

  } catch (error) {
    console.error('❌ Check and award badges failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check badges'
    });
  }
};

/**
 * Get badge progress for user
 */
const getBadgeProgress = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const decoded = verifyToken(token);
    const { userId } = req.params;

    // Verify user can only get their own progress or admin can get any
    const user = await User.findById(decoded.userId);
    if (!user || (user.id !== userId && user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const userBadges = await Badge.getUserBadges(userId);
    const allBadges = await Badge.getAllBadges();

    const progress = {};
    allBadges.forEach(badge => {
      const userBadge = userBadges.find(ub => ub.badge_id === badge.id);
      progress[badge.id] = {
        current: userBadge?.progress || 0,
        requirement: badge.target_value,
        progress: userBadge ? Math.min(100, Math.round((userBadge.progress / badge.target_value) * 100)) : 0,
        isCompleted: userBadge?.is_completed || false
      };
    });

    res.json({
      success: true,
      data: progress
    });

  } catch (error) {
    console.error('❌ Get badge progress failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get badge progress'
    });
  }
};

/**
 * Get badges for specific user by ID
 */
const getUserBadgesById = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const decoded = verifyToken(token);
    const { userId } = req.params;

    // Verify user can only get their own badges or admin can get any
    const user = await User.findById(decoded.userId);
    if (!user || (user.id !== userId && user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const userBadges = await Badge.getUserBadges(userId);
    const allBadges = await Badge.getAllBadges();

    // Categorize badges
    const earned = [];
    const inProgress = [];
    const available = [];

    allBadges.forEach(badge => {
      const userBadge = userBadges.find(ub => ub.badge_id === badge.id);

      if (userBadge?.is_completed) {
        earned.push({
          ...badge,
          progress: 100,
          earnedAt: userBadge.earned_at
        });
      } else if (userBadge && userBadge.progress > 0) {
        inProgress.push({
          ...badge,
          progress: Math.min(100, Math.round((userBadge.progress / badge.target_value) * 100)),
          current: userBadge.progress,
          requirement: badge.target_value
        });
      } else {
        available.push({
          ...badge,
          progress: 0,
          current: 0,
          requirement: badge.target_value
        });
      }
    });

    res.json({
      success: true,
      data: {
        earned,
        inProgress,
        available
      }
    });

  } catch (error) {
    console.error('❌ Get user badges by ID failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user badges'
    });
  }
};

/**
 * Seed initial badges (admin only)
 */
const seedBadges = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    // Import seeder
    const { seedBadges: runSeed } = require('../data/seedBadges');
    const success = await runSeed();

    if (success) {
      res.json({
        success: true,
        message: 'Badges seeded successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to seed badges'
      });
    }

  } catch (error) {
    console.error('❌ Seed badges failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed badges'
    });
  }
};

/**
 * Get badge statistics
 */
const getBadgeStats = async (req, res) => {
  try {
    const allBadges = await Badge.getAllBadges();
    const categories = ['luot-xem', 'luot-nhap', 'dac-biet', 'thanh-tuu'];

    const stats = {
      totalBadges: allBadges.length,
      byCategory: {}
    };

    categories.forEach(category => {
      stats.byCategory[category] = allBadges.filter(b => b.category === category).length;
    });

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('❌ Get badge stats failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get badge statistics'
    });
  }
};

module.exports = {
  getAllBadges,
  getBadgeCategories,
  getUserBadges,
  getBadgeLeaderboard,
  awardBadge,
  checkAndAwardBadges,
  getBadgeProgress,
  getUserBadgesById,
  seedBadges,
  getBadgeStats
};

