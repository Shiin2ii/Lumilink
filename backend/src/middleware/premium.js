const Subscription = require('../models/Subscription');

// Premium middleware to check if user has premium access
const checkPremium = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    // Check if user has active premium subscription
    const hasPremium = await Subscription.hasPremiumAccess(userId);

    if (!hasPremium) {
      return res.status(403).json({
        success: false,
        message: 'Premium subscription required',
        code: 'PREMIUM_REQUIRED'
      });
    }

    next();

  } catch (error) {
    console.error('❌ [PREMIUM] Middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Premium check failed'
    });
  }
};

// Check if feature requires premium
const requiresPremium = (feature) => {
  const premiumFeatures = [
    'custom-background',
    'video-background', 
    'advanced-analytics',
    'custom-branding',
    'white-label',
    'priority-support'
  ];
  
  return premiumFeatures.includes(feature);
};

// Get premium features list
const getPremiumFeatures = () => {
  return {
    'custom-background': {
      name: 'Custom Background Upload',
      description: 'Upload your own images and videos as background',
      icon: 'photo'
    },
    'video-background': {
      name: 'Video Backgrounds',
      description: 'Use videos as animated backgrounds',
      icon: 'film'
    },
    'advanced-analytics': {
      name: 'Advanced Analytics',
      description: 'Detailed click tracking and visitor insights',
      icon: 'chart-bar'
    },
    'custom-branding': {
      name: 'Custom Branding',
      description: 'Remove LumiLink branding and add your own',
      icon: 'sparkles'
    },
    'white-label': {
      name: 'White Label Mode',
      description: 'Complete white-label solution',
      icon: 'star'
    },
    'priority-support': {
      name: 'Priority Support',
      description: '24/7 priority customer support',
      icon: 'support'
    }
  };
};

module.exports = {
  checkPremium,
  requiresPremium,
  getPremiumFeatures
};
