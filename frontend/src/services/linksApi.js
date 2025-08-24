/**
 * Links API Service
 * Handles link management operations
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

class LinksApiService {
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
   * Get user's links
   * @returns {Promise<Object>} Links data
   */
  async getLinks() {
    try {
      const response = await fetch(`${this.baseURL}/links/me`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get links');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new link
   * @param {Object} linkData - Link data
   * @param {string} linkData.title - Link title
   * @param {string} linkData.url - Link URL
   * @param {string} linkData.description - Link description
   * @param {string} linkData.icon - Link icon
   * @param {boolean} linkData.active - Link active status
   * @returns {Promise<Object>} Created link
   */
  async createLink(linkData) {
    try {
      const response = await fetch(`${this.baseURL}/links`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(linkData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create link');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update link
   * @param {string} linkId - Link ID
   * @param {Object} linkData - Updated link data
   * @returns {Promise<Object>} Updated link
   */
  async updateLink(linkId, linkData) {
    try {
      const response = await fetch(`${this.baseURL}/links/${linkId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(linkData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update link');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete link
   * @param {string} linkId - Link ID
   * @returns {Promise<Object>} Delete result
   */
  async deleteLink(linkId) {
    try {
      const response = await fetch(`${this.baseURL}/links/${linkId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete link');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reorder links
   * @param {Array} links - Array of links with id and sortOrder
   * @returns {Promise<Object>} Reorder result
   */
  async reorderLinks(links) {
    try {
      const response = await fetch(`${this.baseURL}/links/reorder`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ links })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reorder links');
      }

      return await response.json();
    } catch (error) {
      console.error('Reorder links error:', error);
      throw error;
    }
  }

  /**
   * Track link click
   * @param {string} linkId - Link ID
   * @returns {Promise<Object>} Track result
   */
  async trackClick(linkId) {
    try {
      const response = await fetch(`${this.baseURL}/links/${linkId}/click`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to track click');
      }

      return await response.json();
    } catch (error) {
      console.error('Track click error:', error);
      throw error;
    }
  }

  /**
   * Toggle link active status
   * @param {string} linkId - Link ID
   * @param {boolean} active - Active status
   * @returns {Promise<Object>} Update result
   */
  async toggleLinkStatus(linkId, active) {
    try {
      return await this.updateLink(linkId, { active });
    } catch (error) {
      console.error('Toggle link status error:', error);
      throw error;
    }
  }

  /**
   * Duplicate link
   * @param {string} linkId - Link ID to duplicate
   * @returns {Promise<Object>} Duplicated link
   */
  async duplicateLink(linkId) {
    try {
      const response = await fetch(`${this.baseURL}/links/${linkId}/duplicate`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to duplicate link');
      }

      return await response.json();
    } catch (error) {
      console.error('Duplicate link error:', error);
      throw error;
    }
  }

  /**
   * Get link analytics
   * @param {string} linkId - Link ID
   * @param {string} timeRange - Time range (24h, 7d, 30d, 90d)
   * @returns {Promise<Object>} Link analytics
   */
  async getLinkAnalytics(linkId, timeRange = '7d') {
    try {
      const response = await fetch(`${this.baseURL}/links/${linkId}/analytics?timeRange=${timeRange}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get link analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Get link analytics error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new LinksApiService();
