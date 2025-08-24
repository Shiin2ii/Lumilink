/**
 * Analytics API Service
 * Handles analytics data fetching and management
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

class AnalyticsApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Get auth token from localStorage
   */
  getAuthToken() {
    return localStorage.getItem('lumilink_token') || localStorage.getItem('token');
  }

  /**
   * Get auth headers
   */
  getAuthHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  /**
   * Get profile analytics
   * @param {string} timeRange - Time range (24h, 7d, 30d, 90d)
   * @returns {Promise<Object>} Analytics data
   */
  async getProfileAnalytics(timeRange = '7d') {
    try {
      const response = await fetch(`${this.baseURL}/analytics/profile?timeRange=${timeRange}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get profile analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Profile analytics error:', error);
      throw error;
    }
  }

  /**
   * Get links analytics
   * @param {string} timeRange - Time range (24h, 7d, 30d, 90d)
   * @returns {Promise<Object>} Links analytics data
   */
  async getLinksAnalytics(timeRange = '7d') {
    try {
      const response = await fetch(`${this.baseURL}/analytics/links?timeRange=${timeRange}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get links analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Links analytics error:', error);
      throw error;
    }
  }

  /**
   * Get analytics overview
   * @returns {Promise<Object>} Analytics overview
   */
  async getAnalyticsOverview() {
    try {
      const response = await fetch(`${this.baseURL}/analytics/overview`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get analytics overview');
      }

      return await response.json();
    } catch (error) {
      console.error('Analytics overview error:', error);
      throw error;
    }
  }

  /**
   * Get enhanced analytics with badges
   * @returns {Promise<Object>} Enhanced analytics data
   */
  async getEnhancedAnalytics() {
    try {
      const response = await fetch(`${this.baseURL}/profiles/analytics/enhanced`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get enhanced analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Enhanced analytics error:', error);
      throw error;
    }
  }

  /**
   * Track link click
   * @param {string} linkId - Link ID
   * @returns {Promise<Object>} Track result
   */
  async trackLinkClick(linkId) {
    try {
      const response = await fetch(`${this.baseURL}/links/${linkId}/click`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to track link click');
      }

      return await response.json();
    } catch (error) {
      console.error('Track link click error:', error);
      throw error;
    }
  }

  /**
   * Get real-time stats
   * @returns {Promise<Object>} Real-time stats
   */
  async getRealTimeStats() {
    try {
      const response = await fetch(`${this.baseURL}/analytics/realtime`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get real-time stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Real-time stats error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new AnalyticsApiService();
