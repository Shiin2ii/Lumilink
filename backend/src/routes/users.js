/**
 * =============================================================================
 * USER ROUTES - MCP SEQUENTIAL THINKING
 * =============================================================================
 * User management routes with comprehensive Swagger documentation
 */

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");


// =============================================================================
// MCP USER ROUTES WITH SWAGGER DOCUMENTATION
// =============================================================================

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     tags: [Users]
 *     summary: Lấy danh sách users (Admin only)
 *     description: Lấy danh sách tất cả users với pagination và filtering
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
 *           default: 10
 *         description: Số lượng users per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo username, email, displayName
 *     responses:
 *       200:
 *         description: Danh sách users thành công
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
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get("/", userController.authenticateUser, userController.getAllUsers);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Lấy user theo ID
 *     description: Lấy thông tin chi tiết của user (chỉ admin hoặc chính user đó)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Thông tin user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 */
router.get("/:id", userController.authenticateUser, userController.getUserById);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Cập nhật user
 *     description: Cập nhật thông tin user (chỉ admin hoặc chính user đó)
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
 *             properties:
 *               username:
 *                 type: string
 *                 example: "newusername"
 *               email:
 *                 type: string
 *                 example: "newemail@example.com"
 *               displayName:
 *                 type: string
 *                 example: "New Display Name"
 *               bio:
 *                 type: string
 *                 example: "Updated bio"
 *     responses:
 *       200:
 *         description: User cập nhật thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 */
router.put("/:id", userController.authenticateUser, userController.updateUser);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Xóa user (Admin only)
 *     description: Xóa user khỏi hệ thống (soft delete)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User xóa thành công
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 */
router.delete("/:id", userController.authenticateUser, userController.deleteUser);

module.exports = router;

