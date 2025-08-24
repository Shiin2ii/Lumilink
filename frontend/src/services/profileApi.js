/**
 * Profile API Service
 * Handles profile customization and theme updates
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

class ProfileApiService {
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
    return {
      'Content-Type': 'application/json',
      ...(this.getAuthToken() && { 'Authorization': `Bearer ${this.getAuthToken()}` })
    };
  }

  /**
   * Update profile by user ID
   * @param {string} userId - User ID
   * @param {Object} updateData - Profile update data
   * @returns {Promise<Object>} Update result
   */
  async updateProfileById(userId, updateData) {
    try {
      const response = await fetch(`${this.baseURL}/profiles/user/${userId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update theme settings
   * @param {string} userId - User ID
   * @param {Object} theme - Theme settings
   * @returns {Promise<Object>} Update result
   */
  async updateTheme(userId, theme) {
    return this.updateProfileById(userId, { theme });
  }

  /**
   * Update profile settings
   * @param {string} userId - User ID
   * @param {Object} settings - Profile settings
   * @returns {Promise<Object>} Update result
   */
  async updateSettings(userId, settings) {
    return this.updateProfileById(userId, { settings });
  }

  /**
   * Update background
   * @param {string} userId - User ID
   * @param {Object} background - Background settings
   * @returns {Promise<Object>} Update result
   */
  async updateBackground(userId, background) {
    return this.updateProfileById(userId, { background });
  }

  /**
   * Get public profile
   * @param {string} username - Username
   * @returns {Promise<Object>} Profile data
   */
  async getPublicProfile(username) {
    try {
      const response = await fetch(`${this.baseURL}/profiles/${username}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get profile');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

// Create and export singleton instance
const profileApi = new ProfileApiService();
export default profileApi;
