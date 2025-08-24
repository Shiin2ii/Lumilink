/**
 * Enhanced Analytics Service with Badge Integration
 * Uses existing database schema with JSONB columns for rich metadata
 */
class EnhancedAnalyticsService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';
    this.sessionId = this.generateSessionId();
    this.eventQueue = [];
    this.batchSize = 5;
    this.flushInterval = 3000; // 3 seconds
    this.intervalId = null; // Store interval ID for cleanup
    this.startBatchProcessor();
  }

  /**
   * Track profile view with enhanced data using existing columns
   */
  async trackProfileView(profileId, metadata = {}) {
    if (!profileId) {
      console.warn('Profile ID is required for tracking profile view');
      return { success: false, error: 'Profile ID is required' };
    }

    return this.trackEvent({
      eventType: 'view',
      profileId,
      // Use existing JSONB columns for additional data
      deviceInfo: {
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        screen: `${window.screen.width}x${window.screen.height}`,
        colorDepth: window.screen.colorDepth,
        pixelRatio: window.devicePixelRatio,
        ...metadata.deviceInfo
      },
      locationInfo: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        languages: navigator.languages,
        ...metadata.locationInfo
      },
      referrerInfo: {
        referrer: document.referrer,
        source: this.extractSource(document.referrer),
        campaign: this.extractCampaign(window.location.search),
        pageUrl: window.location.href,
        ...metadata.referrerInfo
      }
    });
  }

  /**
   * Track link click with position and context
   */
  async trackLinkClick(linkId, profileId, linkData = {}) {
    if (!linkId || !profileId) {
      console.warn('Link ID and Profile ID are required for tracking link click');
      return { success: false, error: 'Link ID and Profile ID are required' };
    }

    return this.trackEvent({
      eventType: 'click',
      profileId,
      linkId,
      // Store click context in existing JSONB columns
      deviceInfo: {
        clickPosition: linkData.position || 0,
        linkTitle: linkData.title || '',
        linkUrl: linkData.url || '',
        viewport: `${window.innerWidth}x${window.innerHeight}`
      },
      referrerInfo: {
        pageUrl: window.location.href,
        clickTime: new Date().toISOString(),
        clickCoordinates: linkData.coordinates || null
      }
    });
  }

  /**
   * Track share events
   */
  async trackShare(profileId, shareData = {}) {
    if (!profileId) {
      console.warn('Profile ID is required for tracking share');
      return { success: false, error: 'Profile ID is required' };
    }

    return this.trackEvent({
      eventType: 'share',
      profileId,
      deviceInfo: {
        shareMethod: shareData.method || 'unknown',
        shareTarget: shareData.target || 'unknown'
      },
      referrerInfo: {
        sharedUrl: shareData.url || window.location.href,
        shareTime: new Date().toISOString()
      }
    });
  }

  /**
   * Track custom events
   */
  async trackCustomEvent(eventType, profileId, data = {}) {
    if (!eventType || !profileId) {
      console.warn('Event type and Profile ID are required for tracking custom event');
      return { success: false, error: 'Event type and Profile ID are required' };
    }

    return this.trackEvent({
      eventType,
      profileId,
      deviceInfo: data.deviceInfo || {},
      locationInfo: data.locationInfo || {},
      referrerInfo: data.referrerInfo || {}
    });
  }

  /**
   * Enhanced batch tracking
   */
  async trackEvent(eventData) {
    const enhancedEvent = {
      ...eventData,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      // Add browser info to existing columns
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };

    this.eventQueue.push(enhancedEvent);

    // Immediate flush for important events
    if (eventData.eventType === 'view' || eventData.immediate) {
      return this.flushEvents();
    }

    return Promise.resolve({ queued: true });
  }

  /**
   * Batch processor with badge handling
   */
  async flushEvents() {
    if (this.eventQueue.length === 0) return { success: true, message: 'No events to flush' };

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      const response = await fetch(`${this.baseURL}/analytics/track-with-badges`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify({
          batchEvents: events,
          sessionId: this.sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Handle badge updates
      if (result.success && result.data?.badgeUpdates?.newBadges?.length > 0) {
        this.handleBadgeUpdates(result.data.badgeUpdates);
      }

      return result;
    } catch (error) {
      console.error('❌ Analytics flush failed:', error);
      // Re-queue failed events
      this.eventQueue.unshift(...events);
      throw error;
    }
  }

  /**
   * Handle badge notifications - only in dashboard/account context
   */
  handleBadgeUpdates(badgeUpdates) {
    // Only show notifications if user is in dashboard/account area
    const isDashboardContext = window.location.pathname.includes('/dashboard') ||
                              window.location.pathname.includes('/account');

    if (!isDashboardContext) {
      return;
    }

    // Dispatch custom event for badge notifications
    window.dispatchEvent(new CustomEvent('newBadgesEarned', {
      detail: {
        badges: badgeUpdates.newBadges,
        totalBadges: badgeUpdates.totalBadges
      }
    }));

    // Show toast notifications only in dashboard
    badgeUpdates.newBadges.forEach(badge => {
      this.showBadgeNotification(badge);
    });
  }

  /**
   * Show badge notification
   */
  showBadgeNotification(badge) {
    if (!badge || !badge.name) {
      console.warn('Invalid badge data for notification');
      return;
    }

    // Create and show badge notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 animate-bounce';

    // Escape HTML to prevent XSS
    const escapeHtml = (text) => {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };

    notification.innerHTML = `
      <div class="flex items-center space-x-3">
        <span class="text-2xl animate-pulse">${escapeHtml(badge.icon || '🏆')}</span>
        <div>
          <h4 class="font-bold text-sm">🎉 Huy hiệu mới!</h4>
          <p class="text-xs">${escapeHtml(badge.name)}</p>
          <p class="text-xs opacity-75">${escapeHtml(badge.description || '')}</p>
        </div>
        <button type="button" class="text-black hover:text-gray-700 font-bold text-lg close-btn">&times;</button>
      </div>
    `;

    // Add event listener for close button
    const closeBtn = notification.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        notification.remove();
      });
    }

    document.body.appendChild(notification);

    // Auto remove after 8 seconds
    const timeoutId = setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 8000);

    // Store timeout ID for potential cleanup
    notification.dataset.timeoutId = timeoutId;
  }

  /**
   * Helper methods
   */
  extractSource(referrer) {
    if (!referrer) return 'direct';
    try {
      const url = new URL(referrer);
      return url.hostname;
    } catch {
      return 'unknown';
    }
  }

  extractCampaign(search) {
    const params = new URLSearchParams(search);
    return {
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_content: params.get('utm_content'),
      utm_term: params.get('utm_term')
    };
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
  }

  getAuthHeaders() {
    const token = localStorage.getItem('lumilink_token') || localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  startBatchProcessor() {
    // Clear existing interval if any
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.flushEvents().catch(console.error);
      }
    }, this.flushInterval);
  }

  /**
   * Stop batch processor and cleanup
   */
  stopBatchProcessor() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Force flush all queued events
   */
  async forceFlush() {
    return this.flushEvents();
  }

  /**
   * Get current session info
   */
  getSessionInfo() {
    return {
      sessionId: this.sessionId,
      queuedEvents: this.eventQueue.length,
      batchSize: this.batchSize,
      flushInterval: this.flushInterval,
      isProcessorRunning: this.intervalId !== null
    };
  }

  /**
   * Cleanup method for proper disposal
   */
  destroy() {
    this.stopBatchProcessor();
    this.eventQueue = [];
  }
}

// Export singleton instance
const enhancedAnalyticsService = new EnhancedAnalyticsService();
export default enhancedAnalyticsService;
