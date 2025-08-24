/**
 * Account API Service
 * Handles user account operations using apiClient
 */

import apiClient from './api';

const accountApi = {

  /**
   * Test connection to profiles endpoint
   */
  async testConnection() {
    try {
      const response = await apiClient.get('/profiles/test');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @param {string} profileData.displayName - Display name
   * @param {string} profileData.bio - Bio/description
   * @param {string} profileData.website - Website URL
   * @param {string} profileData.location - Location
   * @returns {Promise<Object>} Updated profile data
   */
  async updateProfile(profileData) {
    try {
      // Method 1: Try /profiles/update endpoint first
      try {
        const response = await apiClient.put('/profiles/update', profileData);

        // Validate the response
        if (response.data && response.data.success) {
          return response.data;
        } else {
          throw new Error(response.data?.message || 'Update returned success=false');
        }
      } catch (error) {
        // Continue to method 2
      }

      // Method 2: Try /profiles/:username endpoint
      try {
        const currentUser = await this.getCurrentUser();

        if (currentUser.success && currentUser.user) {
          const username = currentUser.user.username;
          const response = await apiClient.put(`/profiles/${username}`, profileData);

          // Validate the response
          if (response.data && response.data.success) {
            return response.data;
          } else {
            throw new Error(response.data?.message || 'Update returned success=false');
          }
        } else {
          throw new Error('Could not get current user');
        }
      } catch (error) {
        // Continue to method 3
      }

      // Method 3: Direct API call as last resort
      try {
        const currentUser = await this.getCurrentUser();
        if (currentUser.success && currentUser.user) {
          const userId = currentUser.user.id;
          const response = await apiClient.put(`/profiles/user/${userId}`, profileData);

          // Validate the response
          if (response.data && response.data.success) {
            return response.data;
          } else {
            throw new Error(response.data?.message || 'Update returned success=false');
          }
        } else {
          throw new Error('Could not get current user for method 3');
        }
      } catch (error) {
        // All methods failed
      }

      // If all methods failed
      throw new Error('All update methods failed');
    } catch (error) {
      throw error;
    }
  },

  /**
   * Upload avatar
   * @param {File} file - Avatar file
   * @returns {Promise<Object>} Upload result with avatar URL
   */
  async uploadAvatar(file) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      // Use apiClient for upload with proper headers
      const response = await apiClient.post('/upload/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete avatar
   * @returns {Promise<Object>} Delete result
   */
  async deleteAvatar() {
    try {
      const response = await apiClient.delete('/upload/avatar');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Change password
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @param {string} passwordData.confirmPassword - Confirm new password
   * @returns {Promise<Object>} Change result
   */
  async changePassword(passwordData) {
    try {
      const response = await apiClient.post('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update account settings
   * @param {Object} settings - Account settings
   * @param {boolean} settings.emailNotifications - Email notifications enabled
   * @param {boolean} settings.profilePublic - Profile is public
   * @param {string} settings.language - Preferred language
   * @param {string} settings.timezone - Timezone
   * @returns {Promise<Object>} Update result
   */
  async updateSettings(settings) {
    try {
      const response = await apiClient.put('/auth/settings', settings);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get account statistics
   * @returns {Promise<Object>} Account stats
   */
  async getAccountStats() {
    try {
      const response = await apiClient.get('/auth/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get storage usage
   * @returns {Promise<Object>} Storage usage data
   */
  async getStorageUsage() {
    try {
      const response = await apiClient.get('/upload/storage');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Deactivate account
   * @param {string} reason - Reason for deactivation
   * @returns {Promise<Object>} Deactivation result
   */
  async deactivateAccount(reason) {
    try {
      const response = await apiClient.post('/auth/deactivate', { reason });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get avatar URL with proper base URL
   * @param {string} avatarPath - Avatar path from user data
   * @returns {string} Full avatar URL
   */
  getAvatarUrl(avatarPath) {
    if (!avatarPath) {
      return null;
    }

    // If it's already a full URL, return as is
    if (avatarPath.startsWith('http')) {
      return avatarPath;
    }

    // Use base URL without /api/v1 for static files
    // Static files are served directly from the server root, not through /api/v1
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

    // Avatar paths like "/uploads/avatars/..." should be served from server root
    if (avatarPath.startsWith('/')) {
      const fullUrl = `${baseUrl}${avatarPath}`;
      return fullUrl;
    }

    // If no leading slash, add one
    const fullUrl = `${baseUrl}/${avatarPath}`;
    return fullUrl;
  }
};

// Export the service
export default accountApi;
