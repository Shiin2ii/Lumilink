/**
 * =============================================================================
 * ADMIN ROUTES - MCP SEQUENTIAL THINKING
 * =============================================================================
 * Administrative routes with comprehensive functionality and security
 */

const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");


// =============================================================================
// MCP ADMIN ROUTES WITH SWAGGER DOCUMENTATION
// =============================================================================

/**
 * @swagger
 * /api/v1/admin/stats:
 *   get:
 *     tags: [Admin]
 *     summary: Lấy thống kê hệ thống (Admin only)
 *     description: Lấy thống kê toàn diện về hệ thống, users, links và analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thống kê hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 stats:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         active:
 *                           type: integer
 *                         newThisWeek:
 *                           type: integer
 *                     links:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         active:
 *                           type: integer
 *                         newThisWeek:
 *                           type: integer
 *                     analytics:
 *                       type: object
 *                       properties:
 *                         totalViews:
 *                           type: integer
 *                         totalClicks:
 *                           type: integer
 *                         conversionRate:
 *                           type: number
 *                     system:
 *                       type: object
 *                       properties:
 *                         uptime:
 *                           type: number
 *                         memoryUsage:
 *                           type: object
 *                         databaseStatus:
 *                           type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get("/stats", adminController.authenticateAdmin, adminController.getSystemStats);

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Lấy danh sách users cho admin (Admin only)
 *     description: Lấy danh sách users với thông tin chi tiết cho quản lý
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Số lượng users per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo username, email, displayName
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, active, inactive]
 *           default: all
 *         description: Lọc theo trạng thái
 *       - in: query
 *         name: plan
 *         schema:
 *           type: string
 *           enum: [all, free, premium]
 *           default: all
 *         description: Lọc theo plan
 *     responses:
 *       200:
 *         description: Danh sách users cho admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       plan:
 *                         type: string
 *                       isActive:
 *                         type: boolean
 *                       profileViews:
 *                         type: integer
 *                       totalLinks:
 *                         type: integer
 *                       totalClicks:
 *                         type: integer
 *                       lastLogin:
 *                         type: string
 *                 pagination:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get("/users", adminController.authenticateAdmin, adminController.getAdminUsers);

/**
 * @swagger
 * /api/v1/admin/users/{id}/moderate:
 *   post:
 *     tags: [Admin]
 *     summary: Kiểm duyệt user (Admin only)
 *     description: Thực hiện các hành động kiểm duyệt user (activate, deactivate, ban)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [action]
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [activate, deactivate, ban, unban]
 *                 description: Hành động kiểm duyệt
 *               reason:
 *                 type: string
 *                 description: Lý do kiểm duyệt
 *                 example: "Violation of terms of service"
 *     responses:
 *       200:
 *         description: Kiểm duyệt thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 moderation:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     action:
 *                       type: string
 *                     reason:
 *                       type: string
 *                     moderatedBy:
 *                       type: string
 *                     moderatedAt:
 *                       type: string
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 */
router.post("/users/:id/moderate", adminController.authenticateAdmin, adminController.moderateUser);

// =============================================================================
// BADGE MANAGEMENT ROUTES (ADMIN ONLY)
// =============================================================================

/**
 * @swagger
 * /api/v1/admin/badges:
 *   get:
 *     tags: [Admin]
 *     summary: Lấy danh sách tất cả huy hiệu (Admin only)
 *     description: Lấy danh sách tất cả huy hiệu trong hệ thống để quản lý
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách huy hiệu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 badges:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get("/badges", adminController.authenticateAdmin, adminController.getAllBadgesAdmin);

/**
 * @swagger
 * /api/v1/admin/badges:
 *   post:
 *     tags: [Admin]
 *     summary: Tạo huy hiệu mới (Admin only)
 *     description: Tạo huy hiệu mới với các thông tin chi tiết
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *               color:
 *                 type: string
 *               category:
 *                 type: string
 *               criteria:
 *                 type: object
 *               reward:
 *                 type: object
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Huy hiệu được tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post("/badges", adminController.authenticateAdmin, adminController.createBadge);

/**
 * @swagger
 * /api/v1/admin/badges/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Cập nhật huy hiệu (Admin only)
 *     description: Cập nhật thông tin huy hiệu
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Badge ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *               color:
 *                 type: string
 *               category:
 *                 type: string
 *               criteria:
 *                 type: object
 *               reward:
 *                 type: object
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Huy hiệu được cập nhật thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Badge not found
 */
router.put("/badges/:id", adminController.authenticateAdmin, adminController.updateBadge);

/**
 * @swagger
 * /api/v1/admin/badges/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Xóa huy hiệu (Admin only)
 *     description: Xóa huy hiệu khỏi hệ thống
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Badge ID
 *     responses:
 *       200:
 *         description: Huy hiệu được xóa thành công
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Badge not found
 */
router.delete("/badges/:id", adminController.authenticateAdmin, adminController.deleteBadge);

module.exports = router;

