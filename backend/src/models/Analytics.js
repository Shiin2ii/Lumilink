const { supabase } = require('../config/supabase');

/**
 * Track analytics event (existing function)
 */
const trackEvent = async (eventData) => {
  try {


    // Validate required fields
    if (!eventData.profileId) {
      throw new Error('profile_id is required');
    }
    if (!eventData.eventType) {
      throw new Error('event_type is required');
    }

    // 🎯 CHECK FOR DUPLICATE IP VIEWS IN SAME DAY
    if (eventData.eventType === 'view' && eventData.ipAddress) {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);



      const { data: existingViews, error: checkError } = await supabase
        .from('analytics')
        .select('id')
        .eq('profile_id', eventData.profileId)
        .eq('event_type', 'view')
        .eq('ip_address', eventData.ipAddress)
        .gte('created_at', startOfDay.toISOString())
        .lt('created_at', endOfDay.toISOString())
        .limit(1);

      if (checkError) {
        console.error('❌ [ANALYTICS] Error checking duplicate views:', checkError);
      } else if (existingViews && existingViews.length > 0) {

        return { success: true, message: 'Duplicate view skipped', skipped: true };
      }
    }

    // Validate event_type against allowed values
    const validEventTypes = ['view', 'click', 'share'];
    if (!validEventTypes.includes(eventData.eventType)) {
      console.warn(`⚠️ [ANALYTICS] Invalid event_type: ${eventData.eventType}, using 'view' instead`);
      eventData.eventType = 'view'; // Default to 'view'
    }

    // Prepare insert data
    const insertData = {
      profile_id: eventData.profileId,
      link_id: eventData.linkId || null,
      event_type: eventData.eventType,
      referrer: eventData.referrer || null,
      user_agent: eventData.userAgent || null,
      country: eventData.country || null,
      city: eventData.city || null,
      device_type: eventData.deviceType || null,
      ip_address: eventData.ipAddress || null,
      session_id: eventData.sessionId || null,
      device_info: eventData.deviceInfo || {},
      location_info: eventData.locationInfo || {},
      referrer_info: eventData.referrerInfo || {}
    };



    // Try minimal insert first to isolate the issue

    const minimalData = {
      profile_id: eventData.profileId,
      event_type: eventData.eventType,
      ip_address: eventData.ipAddress || '127.0.0.1'
    };

    const { data, error } = await supabase
      .from('analytics')
      .insert([minimalData])
      .select();

    if (error) {
      console.error('❌ [ANALYTICS] Database insert failed:', error);
      throw new Error(error.message);
    }



    return data[0];
  } catch (error) {
    console.error('❌ [ANALYTICS] Track event failed:', {
      error: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      eventData: {
        profile_id: eventData.profileId,
        event_type: eventData.eventType,
        ip_address: eventData.ipAddress
      }
    });
    throw error; // Re-throw để trackEventWithBadges có thể handle
  }
};

/**
 * Simple track event - NO BADGE INTEGRATION
 */
const trackEventSimple = async (eventData) => {
  try {


    // Track analytics event only
    const analyticsResult = await trackEvent(eventData);


    if (!analyticsResult) {
      return { success: false, message: 'Failed to track event' };
    }

    // 🎯 BADGE INTEGRATION: Check for new badges after successful analytics tracking
    let badgeUpdates = { newBadges: [], totalBadges: 0 };

    if (eventData.profileId) {
      try {
        badgeUpdates = await checkBadgesFromAnalytics(
          eventData.profileId,
          eventData.eventType,
          analyticsResult
        );
      } catch (badgeError) {
        console.error('⚠️ [ANALYTICS] Badge check failed:', badgeError.message);
        // Don't fail the whole request if badge check fails
      }
    }

    return {
      success: true,
      analytics: analyticsResult,
      badgeUpdates
    };

  } catch (error) {
    console.error('❌ [ANALYTICS] trackEventSimple failed:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Get profile analytics summary
 */
const getProfileAnalytics = async (profileId, days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('profile_id', profileId)
      .gte('created_at', startDate.toISOString());

    if (error) {
      throw new Error(error.message);
    }

    // Process analytics data
    const analytics = {
      totalViews: data.filter(item => item.event_type === 'view').length,
      totalClicks: data.filter(item => item.event_type === 'click').length,
      totalShares: data.filter(item => item.event_type === 'share').length,
      uniqueVisitors: new Set(data.map(item => item.ip_address)).size,
      countries: [...new Set(data.map(item => item.country).filter(Boolean))],
      devices: {
        desktop: data.filter(item => item.device_type === 'desktop').length,
        mobile: data.filter(item => item.device_type === 'mobile').length,
        tablet: data.filter(item => item.device_type === 'tablet').length
      },
      dailyStats: {}
    };

    // Group by day
    data.forEach(item => {
      const date = new Date(item.created_at).toISOString().split('T')[0];
      if (!analytics.dailyStats[date]) {
        analytics.dailyStats[date] = { views: 0, clicks: 0, shares: 0 };
      }
      analytics.dailyStats[date][item.event_type + 's']++;
    });

    return analytics;
  } catch (error) {
    return null;
  }
};

/**
 * Get link analytics
 */
const getLinkAnalytics = async (linkId, days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('link_id', linkId)
      .gte('created_at', startDate.toISOString());

    if (error) {
      throw new Error(error.message);
    }

    return {
      totalClicks: data.filter(item => item.event_type === 'click').length,
      uniqueClickers: new Set(data.map(item => item.ip_address)).size,
      countries: [...new Set(data.map(item => item.country).filter(Boolean))],
      referrers: [...new Set(data.map(item => item.referrer).filter(Boolean))],
      devices: {
        desktop: data.filter(item => item.device_type === 'desktop').length,
        mobile: data.filter(item => item.device_type === 'mobile').length,
        tablet: data.filter(item => item.device_type === 'tablet').length
      }
    };
  } catch (error) {
    return null;
  }
};

/**
 * Get top performing links
 */
const getTopLinks = async (profileId, limit = 10, days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('analytics')
      .select(`
        link_id,
        links!inner (
          title,
          url,
          icon
        )
      `)
      .eq('profile_id', profileId)
      .eq('event_type', 'click')
      .gte('created_at', startDate.toISOString())
      .not('link_id', 'is', null);

    if (error) {
      throw new Error(error.message);
    }

    // Count clicks per link
    const linkClicks = {};
    data.forEach(item => {
      const linkId = item.link_id;
      if (!linkClicks[linkId]) {
        linkClicks[linkId] = {
          linkId,
          title: item.links.title,
          url: item.links.url,
          icon: item.links.icon,
          clicks: 0
        };
      }
      linkClicks[linkId].clicks++;
    });

    // Sort by clicks and return top links
    return Object.values(linkClicks)
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, limit);

  } catch (error) {
    return [];
  }
};

/**
 * Get analytics overview for dashboard
 */
const getAnalyticsOverview = async (profileId) => {
  try {
    // Get data for different time periods
    const [last7Days, last30Days, allTime] = await Promise.all([
      getProfileAnalytics(profileId, 7),
      getProfileAnalytics(profileId, 30),
      getProfileAnalytics(profileId, 365)
    ]);

    return {
      last7Days,
      last30Days,
      allTime,
      topLinks: await getTopLinks(profileId, 5, 30)
    };
  } catch (error) {
    console.error('❌ Get analytics overview failed:', error);
    return null;
  }
};

/**
 * Get real-time analytics (last 24 hours)
 */
const getRealTimeAnalytics = async (profileId) => {
  try {
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);

    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('profile_id', profileId)
      .gte('created_at', last24Hours.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // Group by hour
    const hourlyStats = {};
    data.forEach(item => {
      const hour = new Date(item.created_at).getHours();
      if (!hourlyStats[hour]) {
        hourlyStats[hour] = { views: 0, clicks: 0 };
      }
      if (item.event_type === 'view') hourlyStats[hour].views++;
      if (item.event_type === 'click') hourlyStats[hour].clicks++;
    });

    return {
      recentEvents: data.slice(0, 20),
      hourlyStats,
      totalEvents: data.length
    };
  } catch (error) {
    console.error('❌ Get real-time analytics failed:', error);
    return null;
  }
};

// Badge-related functions removed - not needed for basic analytics

/**
 * Check and award badges based on analytics data
 */
const checkBadgesFromAnalytics = async (profileId, eventType, analyticsData) => {
  try {


    // Get user_id from profile_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('id', profileId)
      .single();

    if (profileError || !profile) {
      console.error('❌ [BADGES] Profile not found:', profileError);
      return { newBadges: [], totalBadges: 0 };
    }

    const userId = profile.user_id;

    // Calculate current stats based on analytics data
    const stats = await calculateUserStats(profileId, userId);


    // Check badges for different criteria types
    const newBadges = [];
    const criteriaMap = {
      'view': 'profile_views',
      'click': 'links_created', // Approximate - clicks indicate link usage
      'share': 'referrals' // Shares can count as referrals
    };

    const criteriaType = criteriaMap[eventType];
    if (!criteriaType) {

      return { newBadges: [], totalBadges: 0 };
    }

    // Get eligible badges for this criteria type
    const { data: eligibleBadges, error: badgesError } = await supabase
      .from('badges')
      .select('*')
      .eq('criteria_type', criteriaType)
      .eq('is_active', true)
      .lte('target_value', stats[criteriaType] || 0);

    if (badgesError) {
      console.error('❌ [BADGES] Error fetching badges:', badgesError);
      return { newBadges: [], totalBadges: 0 };
    }

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
            progress: stats[criteriaType] || 0,
            is_completed: true,
            earned_at: new Date().toISOString()
          });

        if (!awardError) {
          newBadges.push(badge);

        } else {
          console.error('❌ [BADGES] Error awarding badge:', awardError);
        }
      }
    }

    // Get total badge count
    const { data: totalBadgesData } = await supabase
      .from('user_badges')
      .select('id')
      .eq('user_id', userId)
      .eq('is_completed', true);

    return {
      newBadges,
      totalBadges: totalBadgesData?.length || 0
    };

  } catch (error) {
    console.error('❌ [BADGES] Badge check failed:', error);
    return { newBadges: [], totalBadges: 0 };
  }
};

/**
 * Calculate user statistics for badge criteria
 */
const calculateUserStats = async (profileId, userId) => {
  try {
    // Get profile views from analytics
    const { data: viewsData } = await supabase
      .from('analytics')
      .select('id')
      .eq('profile_id', profileId)
      .eq('event_type', 'view');

    // Get links created count
    const { data: linksData } = await supabase
      .from('links')
      .select('id')
      .eq('profile_id', profileId);

    // Get shares/referrals from analytics
    const { data: sharesData } = await supabase
      .from('analytics')
      .select('id')
      .eq('profile_id', profileId)
      .eq('event_type', 'share');

    // Calculate days active (simplified - based on analytics data)
    const { data: analyticsData } = await supabase
      .from('analytics')
      .select('created_at')
      .eq('profile_id', profileId);

    const uniqueDays = new Set();
    analyticsData?.forEach(record => {
      const date = new Date(record.created_at).toISOString().split('T')[0];
      uniqueDays.add(date);
    });

    return {
      profile_views: viewsData?.length || 0,
      links_created: linksData?.length || 0,
      referrals: sharesData?.length || 0,
      days_active: uniqueDays.size || 0,
      premium_days: 0 // TODO: Implement premium tracking
    };

  } catch (error) {
    console.error('❌ [BADGES] Error calculating stats:', error);
    return {
      profile_views: 0,
      links_created: 0,
      referrals: 0,
      days_active: 0,
      premium_days: 0
    };
  }
};

module.exports = {
  trackEvent, // Keep existing function
  trackEventSimple, // Simple function with badge integration
  getProfileAnalytics,
  getLinkAnalytics,
  getTopLinks,
  getAnalyticsOverview,
  getRealTimeAnalytics,
  checkBadgesFromAnalytics,
  calculateUserStats
};
