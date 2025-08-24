const { supabase } = require('../config/supabase');

/**
 * Get all active badges
 */
const getAllBadges = async (req, res) => {
  try {

    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [BADGES] Error fetching badges:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch badges',
        error: error.message,
        code: error.code
      });
    }


    const response = {
      success: true,
      data: data || [],
      total: data?.length || 0,
      message: 'Badges retrieved successfully'
    };

    res.json(response);

  } catch (error) {
    console.error('❌ [BADGES] Get all badges failed:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get user badges
 */
const getUserBadges = async (req, res) => {
  try {

    const userId = req.user?.id;
    if (!userId) {
      console.error('❌ [BADGES] No user ID found in request');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }


    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        *,
        badges (
          id,
          name,
          description,
          icon,
          category,
          target_value,
          criteria_type,
          criteria_description,
          reward_type,
          reward_value
        )
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false, nullsFirst: false });

    if (error) {
      console.error('❌ [BADGES] Error fetching user badges:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user badges',
        error: error.message
      });
    }


    const response = {
      success: true,
      data: data || [],
      total: data?.length || 0,
      message: 'User badges retrieved successfully'
    };

    res.json(response);

  } catch (error) {
    console.error('❌ [BADGES] Get user badges failed:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Check and award badges based on activity
 */
const checkAndAwardBadges = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { activityData } = req.body;

    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Calculate actual stats from database
    const stats = await calculateUserStats(profile.id, userId);

    // Check for eligible badges
    const newBadges = [];
    const criteriaTypes = ['profile_views', 'links_created', 'unique_visitors', 'unique_sessions', 'unique_countries'];

    for (const criteriaType of criteriaTypes) {
      const currentValue = stats[criteriaType] || 0;

      // Get eligible badges for this criteria
      const { data: eligibleBadges } = await supabase
        .from('badges')
        .select('*')
        .eq('criteria_type', criteriaType)
        .eq('is_active', true)
        .lte('target_value', currentValue);

      // Check each eligible badge
      for (const badge of eligibleBadges || []) {
        // Check if user already has this badge
        const { data: existingBadge } = await supabase
          .from('user_badges')
          .select('id, is_completed')
          .eq('user_id', userId)
          .eq('badge_id', badge.id)
          .single();

        if (!existingBadge || !existingBadge.is_completed) {
          // Award the badge
          const { error: awardError } = await supabase
            .from('user_badges')
            .upsert({
              user_id: userId,
              badge_id: badge.id,
              progress: currentValue,
              is_completed: true,
              earned_at: new Date().toISOString()
            });

          if (!awardError) {
            newBadges.push(badge);
          }
        }
      }
    }

    // Get total badge count
    const { data: totalBadgesData } = await supabase
      .from('user_badges')
      .select('id')
      .eq('user_id', userId)
      .eq('is_completed', true);

    res.json({
      success: true,
      data: {
        newBadges,
        totalBadges: totalBadgesData?.length || 0,
        stats
      }
    });

  } catch (error) {
    console.error('❌ [BADGES] Check and award badges failed:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Calculate user statistics for badge criteria using analytics_summary
 */
const calculateUserStats = async (profileId, userId) => {
  try {

    // Get analytics summary for this profile
    const { data: summaryData, error: summaryError } = await supabase
      .from('analytics_summary')
      .select('*')
      .eq('profile_id', profileId)
      .single();

    if (summaryError && summaryError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('❌ [BADGES] Error fetching analytics summary:', summaryError);
    }

    // Get links created count
    const { data: linksData } = await supabase
      .from('links')
      .select('id')
      .eq('profile_id', profileId);

    // Calculate stats from summary or fallback to 0
    const stats = {
      profile_views: summaryData?.event_count || 0, // Total events as proxy for views
      links_created: linksData?.length || 0,
      referrals: 0, // TODO: Implement referral tracking
      days_active: summaryData ? 1 : 0, // If has summary, at least 1 day active
      premium_days: 0, // TODO: Implement premium tracking
      unique_visitors: summaryData?.unique_visitors || 0,
      unique_sessions: summaryData?.unique_sessions || 0,
      unique_countries: summaryData?.unique_countries || 0
    };

    return stats;

  } catch (error) {
    console.error('❌ [BADGES] Error calculating stats:', error);
    return {
      profile_views: 0,
      links_created: 0,
      referrals: 0,
      days_active: 0,
      premium_days: 0,
      unique_visitors: 0,
      unique_sessions: 0,
      unique_countries: 0
    };
  }
};

module.exports = {
  getAllBadges,
  getUserBadges,
  checkAndAwardBadges,
  calculateUserStats
};
