/**
 * =============================================================================
 * AUTHENTICATION MIDDLEWARE FOR SUPABASE
 * =============================================================================
 * Handle JWT token verification and user authentication
 */

const { supabase } = require('../config/supabase');
const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

/**
 * Middleware to verify JWT token and authenticate user
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify JWT token
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Get user from database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add user to request object
    req.user = user;
    next();

  } catch (error) {
    console.error('❌ Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

/**
 * Middleware to verify Supabase Auth token (alternative method)
 */
const authenticateSupabaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Get user profile from our database
    const userProfile = await User.findById(user.id);
    if (!userProfile) {
      return res.status(401).json({
        success: false,
        message: 'User profile not found'
      });
    }

    // Add user to request object
    req.user = userProfile;
    req.supabaseUser = user;
    next();

  } catch (error) {
    console.error('❌ Supabase authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

/**
 * Middleware to check if user is admin
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
};

/**
 * Middleware to check if user is pro or admin
 */
const requirePro = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (!['admin', 'user_pro'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Pro subscription required'
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  authenticateSupabaseToken,
  requireAdmin,
  requirePro
};