const { supabase } = require('../config/supabase');

/**
 * Get all active badges
 */
const getAllBadges = async () => {
  try {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('target_value', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('❌ Get all badges failed:', error);
    return [];
  }
};

/**
 * Get badges by category
 */
const getBadgesByCategory = async (category) => {
  try {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('target_value', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('❌ Get badges by category failed:', error);
    return [];
  }
};

/**
 * Get user badges with progress
 */
const getUserBadges = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        *,
        badges (
          name,
          description,
          icon,
          category,
          target_value,
          color
        )
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('❌ Get user badges failed:', error);
    return [];
  }
};

/**
 * Award badge to user
 */
const awardBadge = async (userId, badgeId) => {
  try {
    const { data, error } = await supabase
      .from('user_badges')
      .upsert({
        user_id: userId,
        badge_id: badgeId,
        is_completed: true,
        earned_at: new Date().toISOString()
      })
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data[0];
  } catch (error) {
    console.error('❌ Award badge failed:', error);
    return null;
  }
};

/**
 * Update badge progress
 */
const updateBadgeProgress = async (userId, badgeId, progress) => {
  try {
    // Get badge target value
    const { data: badge, error: badgeError } = await supabase
      .from('badges')
      .select('target_value')
      .eq('id', badgeId)
      .single();

    if (badgeError) {
      throw new Error(badgeError.message);
    }

    const isCompleted = progress >= badge.target_value;

    const { data, error } = await supabase
      .from('user_badges')
      .upsert({
        user_id: userId,
        badge_id: badgeId,
        progress: progress,
        is_completed: isCompleted,
        earned_at: isCompleted ? new Date().toISOString() : null
      })
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data[0];
  } catch (error) {
    console.error('❌ Update badge progress failed:', error);
    return null;
  }
};

/**
 * Get badge leaderboard
 */
const getBadgeLeaderboard = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        user_id,
        users!inner (
          username,
          display_name,
          avatar_url,
          verified
        )
      `)
      .eq('is_completed', true)
      .order('earned_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }

    // Group by user and count badges
    const userBadgeCounts = {};
    data.forEach(item => {
      const userId = item.user_id;
      if (!userBadgeCounts[userId]) {
        userBadgeCounts[userId] = {
          user: item.users,
          badgeCount: 0
        };
      }
      userBadgeCounts[userId].badgeCount++;
    });

    // Convert to array and sort by badge count
    const leaderboard = Object.values(userBadgeCounts)
      .sort((a, b) => b.badgeCount - a.badgeCount)
      .slice(0, limit);

    return leaderboard;
  } catch (error) {
    console.error('❌ Get badge leaderboard failed:', error);
    return [];
  }
};

/**
 * ADMIN FUNCTIONS - Get all badges including inactive ones
 */
const getAllBadgesAdmin = async () => {
  try {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('❌ Get all badges admin failed:', error);
    return [];
  }
};

/**
 * ADMIN FUNCTIONS - Create new badge
 */
const createBadge = async (badgeData) => {
  try {
    const {
      name,
      description,
      icon,
      category,
      criteria,
      reward,
      rarity,
      isActive
    } = badgeData;

    const { data, error } = await supabase
      .from('badges')
      .insert({
        name,
        description,
        icon: icon || '🏆',
        category: category || 'achievement',
        criteria_type: criteria?.type || 'profile_views',
        target_value: criteria?.target || 1,
        criteria_description: criteria?.description || description,
        reward_type: reward?.type || 'none',
        reward_value: reward?.value || 0,
        rarity: rarity || 'common',
        is_active: isActive !== false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('❌ Create badge failed:', error);
    throw error;
  }
};

/**
 * ADMIN FUNCTIONS - Update badge
 */
const updateBadge = async (badgeId, badgeData) => {
  try {
    const {
      name,
      description,
      icon,
      category,
      criteria,
      reward,
      rarity,
      isActive
    } = badgeData;

    const { data, error } = await supabase
      .from('badges')
      .update({
        name,
        description,
        icon,
        category,
        criteria_type: criteria?.type || 'profile_views',
        target_value: criteria?.target || 1,
        criteria_description: criteria?.description || description,
        reward_type: reward?.type || 'none',
        reward_value: reward?.value || 0,
        rarity: rarity || 'common',
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', badgeId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('❌ Update badge failed:', error);
    throw error;
  }
};

/**
 * ADMIN FUNCTIONS - Delete badge
 */
const deleteBadge = async (badgeId) => {
  try {
    // First, delete all user_badges associated with this badge
    const { error: userBadgesError } = await supabase
      .from('user_badges')
      .delete()
      .eq('badge_id', badgeId);

    if (userBadgesError) {
      throw new Error(userBadgesError.message);
    }

    // Then delete the badge itself
    const { data, error } = await supabase
      .from('badges')
      .delete()
      .eq('id', badgeId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('❌ Delete badge failed:', error);
    throw error;
  }
};

/**
 * ADMIN FUNCTIONS - Get badge by ID
 */
const getBadgeById = async (badgeId) => {
  try {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .eq('id', badgeId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('❌ Get badge by ID failed:', error);
    throw error;
  }
};

module.exports = {
  getAllBadges,
  getBadgesByCategory,
  getUserBadges,
  awardBadge,
  updateBadgeProgress,
  getBadgeLeaderboard,
  // Admin functions
  getAllBadgesAdmin,
  createBadge,
  updateBadge,
  deleteBadge,
  getBadgeById
};
