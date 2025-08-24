const express = require("express");
const router = express.Router();
const Analytics = require("../models/Analytics");
const { verifyToken } = require("../utils/jwt");
const User = require("../models/User");
const analyticsController = require("../controllers/analyticsController");
const { authenticateToken } = require("../middleware/auth");

/**
 * Track analytics event
 */
router.post("/track", async (req, res) => {
  try {
    const eventData = req.body;
    const result = await Analytics.trackEvent(eventData);

    if (result) {
      res.json({
        success: true,
        message: 'Event tracked successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to track event'
      });
    }
  } catch (error) {
    console.error('❌ Track event failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track event'
    });
  }
});

// Old routes removed - using controller-based routes below

/**
 * New Analytics Routes using Controller
 */

// Dashboard overview - main analytics for dashboard
router.get("/dashboard/overview", authenticateToken, analyticsController.getDashboardOverview);

// Profile analytics - detailed profile stats with time range
router.get("/profile", authenticateToken, analyticsController.getProfileAnalytics);

// Links analytics - all links performance
router.get("/links", authenticateToken, analyticsController.getLinksAnalytics);

// Analytics overview - summary stats
router.get("/overview", authenticateToken, analyticsController.getAnalyticsOverview);

// Real-time analytics - live data
router.get("/realtime", authenticateToken, analyticsController.getRealTimeStats);

// 🎯 NEW: Enhanced tracking with badge integration
router.post("/track-with-badges", analyticsController.trackEventWithBadges);

// Test endpoints removed - analytics working properly

// All test endpoints removed - analytics working properly

module.exports = router;
