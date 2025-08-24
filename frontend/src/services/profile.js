// =============================================================================
// PROFILE SERVICE
// =============================================================================
// Handle user profile management and public profile access

import apiClient from './api';

export const profileService = {
  // Get public profile by username
  async getPublicProfile(username) {
    try {
      const response = await apiClient.get(`/profiles/${username}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current user's profile
  async getMyProfile() {
    try {
      const response = await apiClient.get('/profiles/me/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update profile settings
  async updateProfile(profileData) {
    try {
      const response = await apiClient.put('/profiles/me/profile', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update profile appearance
  async updateAppearance(appearanceData) {
    try {
      const response = await apiClient.put('/profiles/me/appearance', appearanceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get profile analytics
  async getAnalytics(days = 30) {
    try {
      const response = await apiClient.get(`/profiles/me/analytics?days=${days}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check username availability
  async checkUsername(username) {
    try {
      const response = await apiClient.post('/profiles/check-username', { username });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search profiles
  async searchProfiles(query, limit = 10, offset = 0) {
    try {
      const response = await apiClient.get(`/profiles/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get profile settings
  async getSettings() {
    try {
      const response = await apiClient.get('/profiles/me/settings');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update profile settings
  async updateSettings(settings) {
    try {
      const response = await apiClient.put('/profiles/me/settings', settings);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get profile themes
  async getThemes() {
    try {
      const response = await apiClient.get('/profiles/themes');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Apply theme to profile
  async applyTheme(themeId) {
    try {
      const response = await apiClient.post('/profiles/me/theme', { themeId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get profile statistics
  async getStats() {
    try {
      const response = await apiClient.get('/profiles/me/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Export profile data
  async exportData() {
    try {
      const response = await apiClient.get('/profiles/me/export');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete profile
  async deleteProfile() {
    try {
      const response = await apiClient.delete('/profiles/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default profileService;
