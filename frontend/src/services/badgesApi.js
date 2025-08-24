/**
 * Badges API Service
 * Handles badge system operations
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

class BadgesApiService {
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
   * Get all badges
   * @returns {Promise<Object>} All badges data
   */
  async getAllBadges() {
    try {
      const response = await fetch(`${this.baseURL}/badges`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get badges');
      }

      return await response.json();
    } catch (error) {
      console.error('Get all badges error:', error);
      throw error;
    }
  }

  /**
   * Get user badges
   * @returns {Promise<Object>} User badges data
   */
  async getUserBadges() {
    try {
      const response = await fetch(`${this.baseURL}/badges/user`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get user badges');
      }

      return await response.json();
    } catch (error) {
      console.error('Get user badges error:', error);
      throw error;
    }
  }

  /**
   * Get badge categories
   * @returns {Promise<Object>} Badge categories
   */
  async getBadgeCategories() {
    try {
      const response = await fetch(`${this.baseURL}/badges/categories`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get badge categories');
      }

      return await response.json();
    } catch (error) {
      console.error('Get badge categories error:', error);
      throw error;
    }
  }

  /**
   * Get badge leaderboard
   * @param {string} category - Badge category (optional)
   * @returns {Promise<Object>} Badge leaderboard
   */
  async getBadgeLeaderboard(category = null) {
    try {
      const url = category 
        ? `${this.baseURL}/badges/leaderboard?category=${category}`
        : `${this.baseURL}/badges/leaderboard`;

      const response = await fetch(url, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get badge leaderboard');
      }

      return await response.json();
    } catch (error) {
      console.error('Get badge leaderboard error:', error);
      throw error;
    }
  }

  /**
   * Check and award badges based on user activity
   * @param {Object} activityData - User activity data
   * @returns {Promise<Object>} Badge check result
   */
  async checkAndAwardBadges(activityData) {
    try {
      const response = await fetch(`${this.baseURL}/badges/check-awards`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ activityData })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check badges');
      }

      return await response.json();
    } catch (error) {
      console.error('Check badges error:', error);
      throw error;
    }
  }

  /**
   * Get badge statistics
   * @returns {Promise<Object>} Badge statistics
   */
  async getBadgeStats() {
    try {
      const response = await fetch(`${this.baseURL}/badges/stats`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get badge stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Get badge stats error:', error);
      throw error;
    }
  }

  /**
   * Sync user badges (refresh badge status)
   * @returns {Promise<Object>} Sync result
   */
  async syncUserBadges() {
    try {
      const response = await fetch(`${this.baseURL}/profiles/badges/sync`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to sync badges');
      }

      return await response.json();
    } catch (error) {
      console.error('Sync badges error:', error);
      throw error;
    }
  }

  /**
   * Get user badges by username (for profile view)
   * @param {string} username - Username
   * @returns {Promise<Object>} User badges
   */
  async getUserBadgesByUsername(username) {
    try {
      const response = await fetch(`${this.baseURL}/profiles/${username}/badges`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get user badges');
      }

      return await response.json();
    } catch (error) {
      console.error('Get user badges by username error:', error);
      throw error;
    }
  }

  /**
   * Get badge progress for user
   * @returns {Promise<Object>} Badge progress data
   */
  async getBadgeProgress() {
    try {
      const response = await fetch(`${this.baseURL}/badges/progress`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get badge progress');
      }

      return await response.json();
    } catch (error) {
      console.error('Get badge progress error:', error);
      throw error;
    }
  }

  /**
   * Claim badge reward
   * @param {string} badgeId - Badge ID
   * @returns {Promise<Object>} Claim result
   */
  async claimBadgeReward(badgeId) {
    try {
      const response = await fetch(`${this.baseURL}/badges/${badgeId}/claim`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to claim badge reward');
      }

      return await response.json();
    } catch (error) {
      console.error('Claim badge reward error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new BadgesApiService();
