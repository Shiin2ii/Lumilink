/**
 * Upload Service
 * Handles file uploads to backend
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class UploadService {
  /**
   * Upload background image
   * @param {File} file - Image file to upload
   * @returns {Promise<Object>} Upload result with URL
   */
  async uploadBackgroundImage(file) {
    try {

      // Validate file
      if (!file) {
        throw new Error('No file provided');
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
      }

      // Create FormData
      const formData = new FormData();
      formData.append('background', file);

      // Upload to backend
      const response = await fetch(`${API_BASE_URL}/upload/background`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, let browser set it with boundary
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Upload failed');
      }

      return {
        success: true,
        data: result.data
      };

    } catch (error) {
      console.error('❌ Upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete uploaded image
   * @param {string} filename - Filename to delete
   * @returns {Promise<Object>} Delete result
   */
  async deleteBackgroundImage(filename) {
    try {

      const response = await fetch(`${API_BASE_URL}/upload/background/${filename}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Delete failed');
      }

      return {
        success: true,
        message: result.message
      };

    } catch (error) {
      console.error('❌ Delete error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get image URL from filename
   * @param {string} filename - Image filename
   * @returns {string} Full image URL
   */
  getImageUrl(filename) {
    if (!filename) return null;
    return `${API_BASE_URL}/uploads/${filename}`;
  }

  /**
   * Validate image file
   * @param {File} file - File to validate
   * @returns {Object} Validation result
   */
  validateImageFile(file) {
    const errors = [];

    if (!file) {
      errors.push('No file selected');
      return { valid: false, errors };
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      errors.push('File must be an image (PNG, JPG, GIF, etc.)');
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      errors.push('File size must be less than 5MB');
    }

    // Check dimensions (optional - can be done with FileReader)
    // This would require reading the image first

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Create image preview URL
   * @param {File} file - Image file
   * @returns {string} Preview URL
   */
  createPreviewUrl(file) {
    if (!file) return null;
    return URL.createObjectURL(file);
  }

  /**
   * Revoke preview URL to free memory
   * @param {string} url - Preview URL to revoke
   */
  revokePreviewUrl(url) {
    if (url) {
      URL.revokeObjectURL(url);
    }
  }
}

// Export singleton instance
export const uploadService = new UploadService();
export default uploadService;
