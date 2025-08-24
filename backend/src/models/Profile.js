/**
 * =============================================================================
 * PROFILE MODEL - SUPABASE INTEGRATION
 * =============================================================================
 * Handle public profile operations with Supabase database
 */

const { supabase } = require('../config/supabase');

/**
 * Get public profile by username
 */
const getPublicProfile = async (username) => {
  try {
    // Get user basic info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, display_name, bio, avatar_url, verified, location, website, created_at')
      .eq('username', username.toLowerCase())
      .eq('status', 'active')
      .single();

    if (userError) {
      if (userError.code === 'PGRST116') {
        return null;
      }
      throw new Error(userError.message);
    }

    // Get user's profile settings (including theme and advanced settings)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('theme_settings, advanced_settings, show_analytics, allow_comments, total_views, total_clicks, custom_css, custom_js')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile settings:', profileError);
      // Continue without profile settings
    }

    // Get user's visible links
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('id, title, url, description, type, icon, click_count, created_at')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true });

    if (linksError) {
      console.error('Error fetching links:', linksError);
      // Don't throw error, just return empty links
    }

    return {
      id: user.id,
      username: user.username,
      displayName: user.display_name,
      bio: user.bio,
      avatar: user.avatar_url,
      verified: user.verified,
      location: user.location,
      website: user.website,
      createdAt: user.created_at,
      background: profile?.theme_settings?.background || {
        type: 'gradient',
        value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      },
      theme: profile?.theme_settings,
      advancedSettings: profile?.advanced_settings,
      customCSS: profile?.custom_css,
      customJS: profile?.custom_js,
      settings: {
        showAnalytics: profile?.show_analytics || false,
        allowComments: profile?.allow_comments || true
      },
      viewCount: profile?.total_views || 0,
      clickCount: profile?.total_clicks || 0,
      links: links || []
    };

  } catch (error) {
    console.error('❌ Get public profile failed:', error);
    return null;
  }
};

/**
 * Get profile analytics (public stats)
 */
const getProfileStats = async (username) => {
  try {
    // Get user ID first
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username.toLowerCase())
      .eq('status', 'active')
      .single();

    if (userError) {
      return null;
    }

    // Get total clicks across all links
    const { data: linksData, error: linksError } = await supabase
      .from('links')
      .select('click_count')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .eq('is_visible', true);

    if (linksError) {
      console.error('Error fetching link stats:', linksError);
      return {
        totalClicks: 0,
        totalLinks: 0
      };
    }

    const totalClicks = linksData.reduce((sum, link) => sum + (link.click_count || 0), 0);
    const totalLinks = linksData.length;

    return {
      totalClicks,
      totalLinks
    };

  } catch (error) {
    console.error('❌ Get profile stats failed:', error);
    return {
      totalClicks: 0,
      totalLinks: 0
    };
  }
};

/**
 * Check if username exists
 */
const checkUsernameExists = async (username) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('username', username.toLowerCase())
      .eq('status', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return false; // Username doesn't exist
      }
      throw new Error(error.message);
    }

    return true; // Username exists

  } catch (error) {
    console.error('❌ Check username exists failed:', error);
    return false;
  }
};

/**
 * Search profiles by username or display name
 */
const searchProfiles = async (query, limit = 10, offset = 0) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('username, display_name, bio, avatar_url, verified')
      .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
      .eq('status', 'active')
      .limit(limit)
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(error.message);
    }

    return data.map(user => ({
      username: user.username,
      displayName: user.display_name,
      bio: user.bio,
      avatar: user.avatar_url,
      verified: user.verified
    }));

  } catch (error) {
    console.error('❌ Search profiles failed:', error);
    return [];
  }
};

/**
 * Get trending profiles (most clicked links)
 */
const getTrendingProfiles = async (limit = 10, days = 7) => {
  try {
    // This would require a more complex query with analytics data
    // For now, return profiles with most total clicks
    const { data, error } = await supabase
      .from('users')
      .select(`
        username, 
        display_name, 
        bio, 
        avatar_url, 
        verified,
        links!inner(click_count)
      `)
      .eq('status', 'active')
      .eq('links.status', 'active')
      .eq('links.is_visible', true)
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }

    // Calculate total clicks for each user and sort
    const profilesWithClicks = data.map(user => {
      const totalClicks = user.links.reduce((sum, link) => sum + (link.click_count || 0), 0);
      return {
        username: user.username,
        displayName: user.display_name,
        bio: user.bio,
        avatar: user.avatar_url,
        verified: user.verified,
        totalClicks
      };
    });

    // Sort by total clicks descending
    profilesWithClicks.sort((a, b) => b.totalClicks - a.totalClicks);

    return profilesWithClicks.slice(0, limit);

  } catch (error) {
    console.error('❌ Get trending profiles failed:', error);
    return [];
  }
};

/**
 * Get profile with badges
 */
const getProfileWithBadges = async (username) => {
  try {
    // Get basic profile first
    const profile = await getPublicProfile(username);
    if (!profile) return null;

    // Get user badges
    const { data: badges, error: badgesError } = await supabase
      .from('user_badges')
      .select(`
        progress,
        is_completed,
        earned_at,
        badges (
          name,
          description,
          icon,
          category,
          target_value,
          color
        )
      `)
      .eq('user_id', profile.id)
      .eq('is_completed', true)
      .order('earned_at', { ascending: false });

    if (badgesError) {
      console.error('❌ Get badges error:', badgesError);
    }

    // Format badges
    const formattedBadges = badges?.map(ub => ({
      name: ub.badges.name,
      description: ub.badges.description,
      icon: ub.badges.icon,
      category: ub.badges.category,
      color: ub.badges.color,
      progress: ub.progress,
      target: ub.badges.target_value,
      completed: ub.is_completed,
      earnedAt: ub.earned_at
    })) || [];

    return {
      ...profile,
      badges: formattedBadges
    };

  } catch (error) {
    console.error('❌ Get profile with badges failed:', error);
    return null;
  }
};

/**
 * Get user badge progress
 */
const getUserBadgeProgress = async (userId) => {
  try {
    const { data, error } = await supabase
      .rpc('calculate_badge_progress', { user_uuid: userId });

    if (error) {
      console.error('❌ Get badge progress error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('❌ Get badge progress failed:', error);
    return [];
  }
};

/**
 * Sync user badges based on current stats
 */
const syncUserBadges = async (userId) => {
  try {
    const { error } = await supabase
      .rpc('sync_user_badges', { user_uuid: userId });

    if (error) {
      console.error('❌ Sync badges error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Sync badges failed:', error);
    return false;
  }
};

module.exports = {
  getPublicProfile,
  getProfileStats,
  checkUsernameExists,
  searchProfiles,
  getTrendingProfiles,
  getProfileWithBadges,
  getUserBadgeProgress,
  syncUserBadges
};
