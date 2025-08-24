/**
 * Test Enhanced Analytics System with Badge Integration
 * Use this in browser console to test the system
 */

import enhancedAnalyticsService from '../services/enhancedAnalyticsService';

/**
 * Test Analytics Tracking
 */
export const testAnalyticsTracking = async () => {
  
  try {
    // Test profile view tracking
    const profileViewResult = await enhancedAnalyticsService.trackProfileView('test-profile-id', {
      profileUsername: 'testuser',
      profileName: 'Test User',
      linksCount: 5,
      hasCustomTheme: true
    });

    // Test link click tracking
    const linkClickResult = await enhancedAnalyticsService.trackLinkClick('test-link-id', 'test-profile-id', {
      title: 'Test Link',
      url: 'https://example.com',
      position: 0
    });

    // Test share tracking
    const shareResult = await enhancedAnalyticsService.trackShare('test-profile-id', {
      method: 'copy',
      target: 'clipboard',
      url: window.location.href
    });

    // Test custom event tracking
    const customEventResult = await enhancedAnalyticsService.trackCustomEvent('test_event', 'test-profile-id', {
      customData: 'test value'
    });

    // Force flush all queued events
    const flushResult = await enhancedAnalyticsService.forceFlush();

    return true;

  } catch (error) {
    // Analytics test failed
    return false;
  }
};

/**
 * Test Badge Notification System
 */
export const testBadgeNotifications = () => {
  
  // Mock badge data
  const mockBadges = [
    {
      id: 'test-badge-1',
      name: 'Test Badge 1',
      description: 'This is a test badge for testing notifications',
      icon: '🏆',
      category: 'achievement',
      criteria_description: 'Complete test action',
      reward_type: 'points',
      reward_value: 100
    },
    {
      id: 'test-badge-2',
      name: 'Test Badge 2',
      description: 'Another test badge',
      icon: '⭐',
      category: 'milestone',
      criteria_description: 'Reach test milestone',
      reward_type: 'premium_days',
      reward_value: 7
    }
  ];

  // Simulate badge earned event
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('newBadgesEarned', {
      detail: {
        badges: [mockBadges[0]],
        totalBadges: 5
      }
    }));
  }, 1000);

  // Simulate multiple badges earned
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('newBadgesEarned', {
      detail: {
        badges: mockBadges,
        totalBadges: 7
      }
    }));
  }, 3000);

};

/**
 * Test Session Info
 */
export const testSessionInfo = () => {
  
  const sessionInfo = enhancedAnalyticsService.getSessionInfo();
  
  return sessionInfo;
};

/**
 * Run all tests
 */
export const runAllTests = async () => {
  
  try {
    // Test session info
    testSessionInfo();
    
    // Test badge notifications
    testBadgeNotifications();
    
    // Test analytics tracking
    await testAnalyticsTracking();
    
    return true;
    
  } catch (error) {
    // Test suite failed
    return false;
  }
};

/**
 * Browser console helpers
 */
if (typeof window !== 'undefined') {
  // Make test functions available in browser console
  window.testEnhancedAnalytics = {
    testAnalyticsTracking,
    testBadgeNotifications,
    testSessionInfo,
    runAllTests,
    service: enhancedAnalyticsService
  };
  
}

export default {
  testAnalyticsTracking,
  testBadgeNotifications,
  testSessionInfo,
  runAllTests
};
