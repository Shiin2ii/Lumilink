/**
 * Background Service
 * Handles background customization API calls
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class BackgroundService {
  /**
   * Get current background settings
   * @returns {Promise<Object>} Background settings
   */
  async getBackground() {
    try {

      const response = await fetch(`${API_BASE_URL}/profile/background`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add auth header when implemented
          // 'Authorization': `Bearer ${token}`
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to get background');
      }

      return {
        success: true,
        data: result.data
      };

    } catch (error) {
      console.error('❌ Get background error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update background settings
   * @param {Object} backgroundData - Background settings
   * @param {string} backgroundData.backgroundType - Type: gradient, solid, image
   * @param {string} backgroundData.backgroundValue - Value: gradient CSS, color hex, image URL
   * @returns {Promise<Object>} Update result
   */
  async updateBackground(backgroundData) {
    try {

      // Validate input
      if (!backgroundData.backgroundType) {
        throw new Error('Background type is required');
      }

      const response = await fetch(`${API_BASE_URL}/profile/background`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add auth header when implemented
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(backgroundData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update background');
      }

      return {
        success: true,
        data: result.data
      };

    } catch (error) {
      console.error('❌ Update background error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Save gradient background
   * @param {string} gradient - CSS gradient string
   * @returns {Promise<Object>} Save result
   */
  async saveGradientBackground(gradient) {
    return this.updateBackground({
      backgroundType: 'gradient',
      backgroundValue: gradient
    });
  }

  /**
   * Save solid color background
   * @param {string} color - Hex color string
   * @returns {Promise<Object>} Save result
   */
  async saveSolidBackground(color) {
    return this.updateBackground({
      backgroundType: 'solid',
      backgroundValue: color
    });
  }

  /**
   * Save image background
   * @param {string} imageUrl - Image URL
   * @returns {Promise<Object>} Save result
   */
  async saveImageBackground(imageUrl) {
    return this.updateBackground({
      backgroundType: 'image',
      backgroundValue: imageUrl
    });
  }

  /**
   * Convert temp customization to background data
   * @param {Object} tempCustomization - Temp customization state
   * @returns {Object} Background data for API
   */
  convertTempToBackgroundData(tempCustomization) {
    const { backgroundType } = tempCustomization;
    
    let backgroundValue = null;
    
    switch (backgroundType) {
      case 'gradient':
        backgroundValue = tempCustomization.backgroundGradient;
        break;
      case 'solid':
        backgroundValue = tempCustomization.backgroundColor;
        break;
      case 'image':
        backgroundValue = tempCustomization.backgroundImage;
        break;
      case 'video':
        backgroundValue = tempCustomization.backgroundVideo;
        break;
      default:
        backgroundValue = tempCustomization.backgroundGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }

    return {
      backgroundType,
      backgroundValue
    };
  }

  /**
   * Convert API background data to profile format
   * @param {Object} backgroundData - API background data
   * @returns {Object} Profile format data
   */
  convertApiToProfileData(backgroundData) {
    const { backgroundType, backgroundValue } = backgroundData;
    
    const profileData = {
      backgroundType
    };

    switch (backgroundType) {
      case 'gradient':
        profileData.backgroundGradient = backgroundValue;
        break;
      case 'solid':
        profileData.backgroundColor = backgroundValue;
        break;
      case 'image':
        profileData.backgroundImage = backgroundValue;
        break;
      case 'video':
        profileData.backgroundVideo = backgroundValue;
        break;
    }

    return profileData;
  }
}

// Export singleton instance
export const backgroundService = new BackgroundService();
export default backgroundService;
