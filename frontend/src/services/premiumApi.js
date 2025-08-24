/**
 * Premium API Service
 * Sử dụng các API endpoints hiện có từ backend
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

class PremiumApiService {
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
   * Upload avatar using existing /upload/avatar endpoint
   * @param {File} file - Avatar file
   * @returns {Promise<Object>} Upload result
   */
  async uploadAvatar(file) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const token = this.getAuthToken();
      const response = await fetch(`${this.baseURL}/upload/avatar`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Avatar upload failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Avatar upload error:', error);
      throw error;
    }
  }

  /**
   * Upload background image/video using /upload/background endpoint
   * @param {File} file - Background file
   * @returns {Promise<Object>} Upload result
   */
  async uploadBackground(file) {
    try {
      console.log('🔍 [DEBUG] Uploading background file:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      const formData = new FormData();
      formData.append('file', file);

      const token = this.getAuthToken();
      const response = await fetch(`${this.baseURL}/upload/background`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: formData
      });

      console.log('📡 [DEBUG] Upload response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [DEBUG] Upload error response:', errorData);
        throw new Error(errorData.message || 'Background upload failed');
      }

      const result = await response.json();
      console.log('✅ [DEBUG] Upload success:', result);
      return result;
    } catch (error) {
      console.error('Background upload error:', error);
      throw error;
    }
  }

  // updateBackground method removed - now using theme_settings.background only

  /**
   * Get profile background using existing endpoint
   * @returns {Promise<Object>} Background data
   */
  async getBackground() {
    try {
      const response = await fetch(`${this.baseURL}/profile/background`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get background');
      }

      return await response.json();
    } catch (error) {
      console.error('Get background error:', error);
      throw error;
    }
  }

  /**
   * Get user profile using existing /auth/me endpoint
   * @returns {Promise<Object>} Profile data
   */
  async getProfile() {
    try {
      const response = await fetch(`${this.baseURL}/auth/me`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  /**
   * Update profile using existing /profiles/update endpoint
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Update result
   */
  async updateProfile(profileData) {
    try {
      const response = await fetch(`${this.baseURL}/profiles/update`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  /**
   * Set video background from URL
   * @param {string} url - Video URL
   * @param {string} type - Video type (cloudinary, p2p, file)
   * @returns {Promise<Object>} Update result
   */
  async setVideoBackground(url, type = 'cloudinary') {
    try {
      let backgroundValue = url;

      // For different video types, we can store metadata in the value
      if (type === 'p2p') {
        backgroundValue = JSON.stringify({ type: 'p2p', url: url });
      } else if (type === 'cloudinary') {
        backgroundValue = JSON.stringify({ type: 'cloudinary', url: url });
      }

      // Update using theme settings instead of old background method
      return await this.updateProfile({
        theme: {
          background: {
            type: 'video',
            value: backgroundValue
          }
        }
      });
    } catch (error) {
      console.error('Set video background error:', error);
      throw error;
    }
  }

  /**
   * Upload and set video background
   * @param {File} file - Video file
   * @returns {Promise<Object>} Upload and update result
   */
  async uploadVideoBackground(file) {
    try {
      // For now, we'll use the image upload endpoint for videos
      // In production, you might want a dedicated video upload endpoint
      const uploadResult = await this.uploadBackground(file);

      // Set the uploaded video as background using theme settings
      await this.updateProfile({
        theme: {
          background: {
            type: 'video',
            value: uploadResult.url || uploadResult.data?.url
          }
        }
      });

      return uploadResult;
    } catch (error) {
      console.error('Video background upload error:', error);
      throw error;
    }
  }

  /**
   * Delete uploaded file using existing endpoints
   * @param {string} type - File type (avatar, background)
   * @returns {Promise<Object>} Delete result
   */
  async deleteFile(type) {
    try {
      const response = await fetch(`${this.baseURL}/upload/${type}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete file');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete file error:', error);
      throw error;
    }
  }

  /**
   * Get storage info using existing endpoint
   * @returns {Promise<Object>} Storage information
   */
  async getStorageInfo() {
    try {
      const response = await fetch(`${this.baseURL}/upload/storage`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get storage info');
      }

      return await response.json();
    } catch (error) {
      console.error('Get storage info error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new PremiumApiService();
