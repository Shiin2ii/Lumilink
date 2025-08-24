/**
 * =============================================================================
 * PROFILE ROUTES - MCP SEQUENTIAL THINKING
 * =============================================================================
 * Public profile routes with comprehensive functionality
 */

const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const { authenticateToken } = require("../middleware/auth");

// Loading Profile routes with MCP Sequential Thinking

// =============================================================================
// MCP PROFILE ROUTES WITH SWAGGER DOCUMENTATION
// =============================================================================

/**
 * @swagger
 * /api/v1/profiles/{username}:
 *   get:
 *     tags: [Profiles]
 *     summary: Lấy profile công khai
 *     description: Lấy thông tin profile công khai của user theo username (không cần authentication)
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username của user
 *         example: "testuser"
 *     responses:
 *       200:
 *         description: Profile công khai
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 profile:
 *                   $ref: '#/components/schemas/Profile'
 *       404:
 *         description: Profile không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:username", profileController.getPublicProfile);

/**
 * @swagger
 * /api/v1/profiles/{username}:
 *   put:
 *     tags: [Profiles]
 *     summary: Cập nhật profile
 *     description: Cập nhật thông tin profile (chỉ chủ sở hữu)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username của user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *                 example: "New Display Name"
 *               bio:
 *                 type: string
 *                 example: "Updated biography"
 *               avatar:
 *                 type: string
 *                 example: "https://example.com/avatar.jpg"
 *               theme:
 *                 type: object
 *                 properties:
 *                   backgroundColor:
 *                     type: string
 *                     example: "#ffffff"
 *                   textColor:
 *                     type: string
 *                     example: "#000000"
 *                   buttonStyle:
 *                     type: string
 *                     example: "rounded"
 *                   fontFamily:
 *                     type: string
 *                     example: "Inter"
 *     responses:
 *       200:
 *         description: Profile cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 profile:
 *                   $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Profile không tồn tại
 */
// IMPORTANT: More specific routes must come before generic routes
// /user/:userId must come before /:username to avoid route conflicts
/**
 * @swagger
 * /api/v1/profiles/user/{userId}:
 *   put:
 *     tags: [Profiles]
 *     summary: Cập nhật profile theo user ID
 *     description: Cập nhật thông tin profile của user theo user ID (yêu cầu authentication)
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID của user
 *     responses:
 *       200:
 *         description: Profile đã được cập nhật
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Profile không tồn tại
 */
router.put("/user/:userId", authenticateToken, profileController.updateProfileByUserId);

// Test endpoint to check if routes are working
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: 'Profile routes are working',
    timestamp: new Date().toISOString()
  });
});

// Update current user's profile (authenticated)
router.put("/update", authenticateToken, async (req, res) => {
  try {


    const userId = req.user.id;

    // Forward to updateProfileById with user ID from token
    req.params.userId = userId;
    return profileController.updateProfileById(req, res);
  } catch (error) {
    console.error('❌ [PROFILE] Update profile failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

router.put("/:username", profileController.updateProfile);

/**
 * @swagger
 * /api/v1/profiles/{username}/analytics:
 *   get:
 *     tags: [Profiles]
 *     summary: Lấy analytics của profile
 *     description: Lấy thống kê chi tiết của profile (chỉ chủ sở hữu)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username của user
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month, year, all]
 *           default: month
 *         description: Khoảng thời gian thống kê
 *     responses:
 *       200:
 *         description: Analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 analytics:
 *                   type: object
 *                   properties:
 *                     profileViews:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         thisWeek:
 *                           type: integer
 *                         thisMonth:
 *                           type: integer
 *                     linkClicks:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         thisWeek:
 *                           type: integer
 *                         thisMonth:
 *                           type: integer
 *                     topLinks:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                           clicks:
 *                             type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */
router.get("/:username/analytics", profileController.getProfileAnalytics);

/**
 * @swagger
 * /api/v1/profiles/{username}/badges:
 *   get:
 *     summary: Get user badges
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User badges retrieved successfully
 */
router.get("/:username/badges", profileController.getUserBadges);

/**
 * @swagger
 * /api/v1/profiles/badges/sync:
 *   post:
 *     summary: Sync user badges
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Badges synced successfully
 */
router.post("/badges/sync", profileController.syncUserBadges);

/**
 * @swagger
 * /api/v1/profiles/analytics/enhanced:
 *   get:
 *     summary: Get enhanced analytics with badges
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Enhanced analytics retrieved successfully
 */
router.get("/analytics/enhanced", profileController.getEnhancedAnalytics);

// Background endpoint removed - now using theme_settings.background via updateProfileById

/**
 * Get profile background
 */
router.get("/background", authenticateToken, async (req, res) => {
  try {


    const userId = req.user.id;

    // Get user's profile
    const { supabase } = require('../config/supabase');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('theme_settings')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    const background = profile.theme_settings?.background || {
      type: 'gradient',
      value: 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'
    };

    res.json({
      success: true,
      data: {
        background
      }
    });

  } catch (error) {
    console.error('❌ [PROFILE] Get background failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get background'
    });
  }
});

module.exports = router;

// Profile routes with MCP Sequential Thinking loaded successfully
