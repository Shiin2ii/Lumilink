/**
 * =============================================================================
 * BADGE ROUTES
 * =============================================================================
 * Badge system endpoints:
 * - GET /badges - Get all badges
 * - GET /badges/categories - Get badge categories
 * - GET /badges/user - Get user badges
 * - GET /badges/leaderboard - Get badge leaderboard
 * - POST /badges/award - Award badge (admin)
 * - GET /badges/stats - Get badge statistics
 */

const express = require("express");
const router = express.Router();
const badgesController = require("../controllers/badgesController");
const { authenticateToken } = require('../middleware/auth');


// Routes are now enabled
/**
 * @swagger
 * components:
 *   schemas:
 *     Badge:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         icon:
 *           type: string
 *         category:
 *           type: string
 *         target_value:
 *           type: integer
 *         color:
 *           type: string
 *         is_active:
 *           type: boolean
 */

/**
 * @swagger
 * /api/v1/badges:
 *   get:
 *     summary: Get all badges
 *     tags: [Badges]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by badge category
 *     responses:
 *       200:
 *         description: Badges retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Badge'
 */
router.get("/", badgesController.getAllBadges);

/**
 * @swagger
 * /api/v1/badges/categories:
 *   get:
 *     summary: Get badge categories
 *     tags: [Badges]
 *     responses:
 *       200:
 *         description: Badge categories retrieved successfully
 */
// router.get("/categories", badgeController.getBadgeCategories);

/**
 * @swagger
 * /api/v1/badges/user:
 *   get:
 *     summary: Get user badges with progress
 *     tags: [Badges]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User badges retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get("/user", authenticateToken, badgesController.getUserBadges);

/**
 * @swagger
 * /api/v1/badges/leaderboard:
 *   get:
 *     summary: Get badge leaderboard
 *     tags: [Badges]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users to return
 *     responses:
 *       200:
 *         description: Badge leaderboard retrieved successfully
 */
// router.get("/leaderboard", badgeController.getBadgeLeaderboard);

/**
 * @swagger
 * /api/v1/badges/award:
 *   post:
 *     summary: Award badge to user (admin only)
 *     tags: [Badges]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               badgeId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Badge awarded successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */
// router.post("/award", badgesController.awardBadge); // TODO: Implement later

/**
 * @swagger
 * /api/v1/badges/check-awards:
 *   post:
 *     summary: Check and award badges based on user activity
 *     tags: [Badges]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               activityData:
 *                 type: object
 *     responses:
 *       200:
 *         description: Badge check completed successfully
 *       401:
 *         description: Authentication required
 */
router.post("/check-awards", authenticateToken, badgesController.checkAndAwardBadges);

/**
 * @swagger
 * /api/v1/badges/progress/:userId:
 *   get:
 *     summary: Get badge progress for user
 *     tags: [Badges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Badge progress retrieved successfully
 *       401:
 *         description: Authentication required
 */
// router.get("/progress/:userId", badgesController.getBadgeProgress); // TODO: Implement later
// router.get("/user/:userId", badgesController.getUserBadgesById); // TODO: Implement later
// router.post("/seed", badgesController.seedBadges); // TODO: Implement later

/**
 * @swagger
 * /api/v1/badges/stats:
 *   get:
 *     summary: Get badge statistics
 *     tags: [Badges]
 *     responses:
 *       200:
 *         description: Badge statistics retrieved successfully
 */
// router.get("/stats", badgeController.getBadgeStats);

// Test endpoint - now enabled
router.get("/test", async (req, res) => {
  try {
    const { supabase } = require('../config/supabase');

    // Test database connection
    const { data, error } = await supabase
      .from('badges')
      .select('count(*)')
      .single();

    res.json({
      success: true,
      message: "Badge routes are working!",
      database: error ? 'Error: ' + error.message : 'Connected',
      badgeCount: data?.count || 0,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Badge test failed",
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;

