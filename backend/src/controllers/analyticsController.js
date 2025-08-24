const { supabase } = require('../config/supabase');
const Analytics = require('../models/Analytics');

// Helper function to get date range
const getDateRange = (timeRange) => {
  const now = new Date();
  let startDate;

  switch (timeRange) {
    case '24h':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  return { startDate, endDate: now };
};

/**
 * Get dashboard analytics overview
 * Provides summary statistics for the user's dashboard
 */
const getDashboardOverview = async (req, res) => {
  try {
    
    const userId = req.user.id;
    
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

    // Get analytics for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: analyticsData, error: analyticsError } = await supabase
      .from('analytics')
      .select('*')
      .eq('profile_id', profile.id)
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (analyticsError) {
      console.error('❌ [ANALYTICS] Failed to fetch analytics:', analyticsError);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch analytics data'
      });
    }

    const analytics = analyticsData || [];

    // Calculate statistics
    const profileViews = analytics.filter(item => item.event_type === 'view');
    const linkClicks = analytics.filter(item => item.event_type === 'click');
    
    // Get this week's data
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const thisWeekViews = profileViews.filter(item => 
      new Date(item.created_at) >= oneWeekAgo
    );
    const thisWeekClicks = linkClicks.filter(item => 
      new Date(item.created_at) >= oneWeekAgo
    );

    // Get today's data
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayViews = profileViews.filter(item => 
      new Date(item.created_at) >= today
    );
    const todayClicks = linkClicks.filter(item => 
      new Date(item.created_at) >= today
    );

    // Calculate unique visitors
    const uniqueVisitors = new Set(profileViews.map(item => item.ip_address)).size;
    const uniqueVisitorsThisWeek = new Set(thisWeekViews.map(item => item.ip_address)).size;

    // Get top countries
    const countryCount = {};
    profileViews.forEach(item => {
      if (item.country) {
        countryCount[item.country] = (countryCount[item.country] || 0) + 1;
      }
    });
    const topCountries = Object.entries(countryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([country, count]) => ({ country, count }));

    // Get device breakdown
    const deviceCount = { mobile: 0, desktop: 0, tablet: 0 };
    profileViews.forEach(item => {
      if (item.device_type) {
        deviceCount[item.device_type] = (deviceCount[item.device_type] || 0) + 1;
      }
    });

    // Get daily stats for the last 7 days
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayViews = profileViews.filter(item => {
        const itemDate = new Date(item.created_at);
        return itemDate >= date && itemDate < nextDate;
      }).length;
      
      const dayClicks = linkClicks.filter(item => {
        const itemDate = new Date(item.created_at);
        return itemDate >= date && itemDate < nextDate;
      }).length;
      
      dailyStats.push({
        date: date.toISOString().split('T')[0],
        views: dayViews,
        clicks: dayClicks
      });
    }

    const overview = {
      profileViews: {
        total: profileViews.length,
        thisWeek: thisWeekViews.length,
        today: todayViews.length,
        uniqueVisitors: uniqueVisitors,
        uniqueVisitorsThisWeek: uniqueVisitorsThisWeek
      },
      linkClicks: {
        total: linkClicks.length,
        thisWeek: thisWeekClicks.length,
        today: todayClicks.length
      },
      conversionRate: profileViews.length > 0 ? 
        ((linkClicks.length / profileViews.length) * 100).toFixed(1) : 0,
      topCountries,
      devices: deviceCount,
      dailyStats
    };

    
    res.json({
      success: true,
      data: overview
    });

  } catch (error) {
    console.error('❌ [ANALYTICS] Get dashboard overview failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve analytics overview'
    });
  }
};

/**
 * Get detailed profile analytics
 */
const getProfileAnalytics = async (req, res) => {
  try {

    const userId = req.user.id;
    const { timeRange = '7d' } = req.query;
    const { startDate, endDate } = getDateRange(timeRange);

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

    // Get profile views
    const { data: viewsData, error: viewsError } = await supabase
      .from('analytics')
      .select('*')
      .eq('profile_id', profile.id)
      .eq('event_type', 'view')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false });

    if (viewsError) {
      console.error('❌ [ANALYTICS] Views query error:', viewsError);
    }

    const views = viewsData || [];

    // Calculate metrics
    const totalViews = views.length;
    const todayViews = views.filter(v => {
      const viewDate = new Date(v.created_at);
      const today = new Date();
      return viewDate.toDateString() === today.toDateString();
    }).length;

    const thisWeekViews = views.filter(v => {
      const viewDate = new Date(v.created_at);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return viewDate >= weekAgo;
    }).length;

    // Calculate change percentage (mock for now)
    const change = totalViews > 0 ? '+12%' : '0%';
    const weeklyChange = thisWeekViews > 0 ? '+8%' : '0%';


    res.json({
      success: true,
      data: {
        profileViews: {
          total: totalViews,
          today: todayViews,
          thisWeek: thisWeekViews,
          change: change,
          weeklyChange: weeklyChange
        },
        timeRange,
        period: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      }
    });

  } catch (error) {
    console.error('❌ [ANALYTICS] Get profile analytics failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile analytics'
    });
  }
};

/**
 * Get links analytics (all links for user)
 */
const getLinksAnalytics = async (req, res) => {
  try {

    const userId = req.user.id;
    const { timeRange = '7d' } = req.query;
    const { startDate, endDate } = getDateRange(timeRange);

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

    // Get link clicks
    const { data: clicksData, error: clicksError } = await supabase
      .from('analytics')
      .select('*, links(title, url)')
      .eq('profile_id', profile.id)
      .eq('event_type', 'click')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false });

    if (clicksError) {
      console.error('❌ [ANALYTICS] Clicks query error:', clicksError);
    }

    const clicks = clicksData || [];

    // Calculate metrics
    const totalClicks = clicks.length;
    const todayClicks = clicks.filter(c => {
      const clickDate = new Date(c.created_at);
      const today = new Date();
      return clickDate.toDateString() === today.toDateString();
    }).length;

    // Calculate change percentage (mock for now)
    const change = totalClicks > 0 ? '+15%' : '0%';


    res.json({
      success: true,
      data: {
        linkClicks: {
          total: totalClicks,
          today: todayClicks,
          change: change
        },
        timeRange,
        period: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      }
    });

  } catch (error) {
    console.error('❌ [ANALYTICS] Get links analytics failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get links analytics'
    });
  }
};

/**
 * Get single link analytics
 */
const getLinkAnalytics = async (req, res) => {
  try {

    const userId = req.user.id;
    const { linkId } = req.params;
    const { timeRange = '7d' } = req.query;
    const { startDate, endDate } = getDateRange(timeRange);

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

    // Verify link belongs to user
    const { data: link, error: linkError } = await supabase
      .from('links')
      .select('*')
      .eq('id', linkId)
      .eq('profile_id', profile.id)
      .single();

    if (linkError || !link) {
      return res.status(404).json({
        success: false,
        message: 'Link not found'
      });
    }

    // Get analytics data
    const { data: analytics, error: analyticsError } = await supabase
      .from('analytics')
      .select('*')
      .eq('link_id', linkId)
      .eq('event_type', 'click')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false });

    if (analyticsError) {
      console.error('❌ [ANALYTICS] Analytics query error:', analyticsError);
    }

    const clicks = analytics || [];
    const totalClicks = clicks.length;
    const todayClicks = clicks.filter(c => {
      const clickDate = new Date(c.created_at);
      const today = new Date();
      return clickDate.toDateString() === today.toDateString();
    }).length;


    res.json({
      success: true,
      data: {
        link: {
          id: link.id,
          title: link.title,
          url: link.url,
          totalClicks: link.click_count || 0
        },
        analytics: {
          totalClicks,
          todayClicks,
          timeRange,
          period: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
          }
        }
      }
    });

  } catch (error) {
    console.error('❌ [ANALYTICS] Get link analytics failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get link analytics'
    });
  }
};

/**
 * Get real-time analytics
 */
const getRealTimeAnalytics = async (req, res) => {
  try {

    const userId = req.user.id;
    const now = new Date();
    const last5Minutes = new Date(now.getTime() - 5 * 60 * 1000);

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

    // Get recent activity
    const { data: recentActivity } = await supabase
      .from('analytics')
      .select('*')
      .eq('profile_id', profile.id)
      .gte('created_at', last5Minutes.toISOString())
      .order('created_at', { ascending: false });

    const activeUsers = recentActivity?.length || 0;
    const recentViews = recentActivity?.filter(a => a.event_type === 'view').length || 0;
    const recentClicks = recentActivity?.filter(a => a.event_type === 'click').length || 0;


    res.json({
      success: true,
      data: {
        activeUsers,
        recentViews,
        recentClicks,
        lastUpdated: now.toISOString()
      }
    });

  } catch (error) {
    console.error('❌ [ANALYTICS] Get real-time analytics failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get real-time analytics'
    });
  }
};

/**
 * Simple track endpoint - NO BADGE INTEGRATION
 */
const trackEventWithBadges = async (req, res) => {
  try {

    const {
      eventType,
      profileId,
      linkId,
      sessionId,
      batchEvents = []
    } = req.body;

    // Get visitor info from request
    const visitorInfo = {
      userAgent: req.get('User-Agent') || '',
      referrer: req.get('Referer') || '',
      ipAddress: req.ip || '127.0.0.1',
      deviceType: getDeviceType(req.get('User-Agent'))
    };

    // Handle batch events or single event
    const eventsToTrack = batchEvents.length > 0 ? batchEvents : [{
      eventType,
      profileId,
      linkId,
      sessionId,
      ...visitorInfo
    }];

    const results = [];
    let allBadgeUpdates = { newBadges: [], totalBadges: 0 };

    // Process each event
    for (const event of eventsToTrack) {
      const result = await Analytics.trackEventSimple({
        profileId: event.profileId,
        linkId: event.linkId,
        eventType: event.eventType,
        sessionId: event.sessionId || sessionId,
        referrer: event.referrer || visitorInfo.referrer,
        userAgent: event.userAgent || visitorInfo.userAgent,
        deviceType: event.deviceType || visitorInfo.deviceType,
        ipAddress: event.ipAddress || visitorInfo.ipAddress,
        // Use existing JSONB columns for additional data
        deviceInfo: {
          userAgent: event.userAgent || visitorInfo.userAgent,
          platform: req.get('sec-ch-ua-platform'),
          mobile: req.get('sec-ch-ua-mobile') === '?1',
          viewport: event.deviceInfo?.viewport,
          screen: event.deviceInfo?.screen,
          colorDepth: event.deviceInfo?.colorDepth,
          pixelRatio: event.deviceInfo?.pixelRatio
        },
        locationInfo: {
          timezone: req.get('timezone') || event.locationInfo?.timezone || 'UTC',
          language: event.locationInfo?.language || 'en',
          languages: event.locationInfo?.languages || ['en']
        },
        referrerInfo: {
          referrer: event.referrer || visitorInfo.referrer,
          source: extractSource(event.referrer || visitorInfo.referrer),
          pageUrl: event.referrerInfo?.pageUrl,
          clickTime: event.referrerInfo?.clickTime,
          shareMethod: event.referrerInfo?.shareMethod,
          shareTarget: event.referrerInfo?.shareTarget
        }
      });

      if (result.success) {
        results.push(result.analytics);

        // Collect badge updates
        if (result.badgeUpdates && result.badgeUpdates.newBadges.length > 0) {
          allBadgeUpdates.newBadges.push(...result.badgeUpdates.newBadges);
          allBadgeUpdates.totalBadges = result.badgeUpdates.totalBadges;
        }
      }
    }

    res.json({
      success: true,
      message: 'Events tracked successfully',
      data: {
        eventsTracked: results.length,
        badgeUpdates: allBadgeUpdates,
        analytics: results
      }
    });

  } catch (error) {
    console.error('❌ Track events with badges failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track events'
    });
  }
};

// Helper function to detect device type
const getDeviceType = (userAgent) => {
  if (!userAgent) return 'unknown';

  const ua = userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
};

// Helper function to extract traffic source
const extractSource = (referrer) => {
  if (!referrer) return 'direct';

  try {
    const url = new URL(referrer);
    const domain = url.hostname.toLowerCase();

    if (domain.includes('google')) return 'google';
    if (domain.includes('facebook')) return 'facebook';
    if (domain.includes('twitter')) return 'twitter';
    if (domain.includes('instagram')) return 'instagram';
    if (domain.includes('linkedin')) return 'linkedin';

    return domain;
  } catch {
    return 'unknown';
  }
};

/**
 * Get analytics overview (alias for getDashboardOverview)
 */
const getAnalyticsOverview = getDashboardOverview;

/**
 * Get real-time stats (alias for getRealTimeAnalytics)
 */
const getRealTimeStats = getRealTimeAnalytics;

module.exports = {
  getDashboardOverview,
  getProfileAnalytics,
  getLinkAnalytics,
  getLinksAnalytics,
  getAnalyticsOverview,
  getRealTimeAnalytics,
  getRealTimeStats,
  trackEventWithBadges // Add new enhanced function
};
