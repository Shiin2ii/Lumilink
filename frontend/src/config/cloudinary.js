/**
 * =============================================================================
 * CLOUDINARY CONFIGURATION
 * =============================================================================
 * Configuration for Cloudinary video uploads
 */

// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dodfmlnny',
  UPLOAD_PRESET: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'lumilink_videos',
  API_KEY: process.env.REACT_APP_CLOUDINARY_API_KEY,
  API_SECRET: process.env.REACT_APP_CLOUDINARY_API_SECRET
};

// Video upload constraints
export const VIDEO_CONSTRAINTS = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_DURATION: 30, // 30 seconds
  ALLOWED_FORMATS: ['video/mp4', 'video/webm', 'video/mov', 'video/avi'],
  QUALITY_PRESETS: {
    MOBILE: { width: 720, height: 480, quality: 'auto:good' },
    HD: { width: 1280, height: 720, quality: 'auto:good' },
    FULL_HD: { width: 1920, height: 1080, quality: 'auto:best' }
  }
};

// Cloudinary transformations for optimization
export const getVideoTransformations = (preset = 'HD') => {
  const qualityPreset = VIDEO_CONSTRAINTS.QUALITY_PRESETS[preset];
  
  return [
    { quality: qualityPreset.quality },
    { format: 'mp4' },
    { duration: VIDEO_CONSTRAINTS.MAX_DURATION }, // Trim to max duration
    { width: qualityPreset.width, height: qualityPreset.height, crop: 'limit' },
    { flags: 'progressive' }, // Progressive loading
    { fetch_format: 'auto' } // Auto format selection
  ];
};

// Parse Cloudinary player URL to extract cloud_name and public_id
export const parseCloudinaryPlayerUrl = (url) => {
  try {
    // Support multiple Cloudinary URL formats
    const patterns = [
      // Player embed URL: https://player.cloudinary.com/embed/?cloud_name=xxx&public_id=yyy
      /player\.cloudinary\.com\/embed\/\?.*cloud_name=([^&]+).*public_id=([^&]+)/,
      // Direct video URL: https://res.cloudinary.com/xxx/video/upload/.../yyy.mp4
      /res\.cloudinary\.com\/([^\/]+)\/video\/upload\/.*\/([^\/\.]+)/,
      // Image URL: https://res.cloudinary.com/xxx/image/upload/.../yyy.jpg
      /res\.cloudinary\.com\/([^\/]+)\/image\/upload\/.*\/([^\/\.]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          cloudName: match[1],
          publicId: match[2],
          isValid: true
        };
      }
    }

    return { isValid: false, error: 'Invalid Cloudinary URL format' };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
};

// Generate optimized video URLs from cloud_name and public_id
export const generateCloudinaryVideoUrls = (cloudName, publicId) => {
  const baseUrl = `https://res.cloudinary.com/${cloudName}/video/upload`;

  return {
    // Desktop 1440p quality (like in GunsLolProfile)
    desktop: `${baseUrl}/q_85,f_mp4,br_6000k,w_2560,h_1440/${publicId}.mp4`,
    // Mobile quality
    mobile: `${baseUrl}/q_auto:good,f_mp4,br_2000k,w_1280,h_720/${publicId}.mp4`,
    // Poster image
    poster: `https://res.cloudinary.com/${cloudName}/image/upload/w_2560,h_1440,c_fill,q_auto:best/${publicId}.jpg`,
    // Preview (smaller for upload preview)
    preview: `${baseUrl}/q_auto:good,f_mp4,br_1500k,w_720,h_480/${publicId}.mp4`
  };
};

// Generate Cloudinary upload URL
export const getCloudinaryUploadUrl = () => {
  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/video/upload`;
};

// Validate Cloudinary configuration
export const validateCloudinaryConfig = () => {
  if (!CLOUDINARY_CONFIG.CLOUD_NAME) {
    console.warn('⚠️ Cloudinary cloud name not configured.');
    return false;
  }

  if (!CLOUDINARY_CONFIG.UPLOAD_PRESET) {
    console.warn('⚠️ Cloudinary upload preset not configured.');
    return false;
  }

  return true;
};

export default {
  CLOUDINARY_CONFIG,
  VIDEO_CONSTRAINTS,
  getVideoTransformations,
  getCloudinaryUploadUrl,
  validateCloudinaryConfig,
  parseCloudinaryPlayerUrl,
  generateCloudinaryVideoUrls
};
