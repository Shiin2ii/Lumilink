/**
 * =============================================================================
 * AUTHENTICATION ROUTES - WITH SWAGGER DOCUMENTATION
 * =============================================================================
 */

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Đăng ký tài khoản mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: "testuser"
 *               email:
 *                 type: string
 *                 example: "test@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               displayName:
 *                 type: string
 *                 example: "Test User"
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       409:
 *         description: Email hoặc username đã tồn tại
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Đăng nhập
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "test@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Email hoặc password không đúng
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: Đăng xuất
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 */
router.post("/logout", authController.logout);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     tags: [Authentication]
 *     summary: Lấy thông tin user hiện tại
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin user
 *       401:
 *         description: Token không hợp lệ
 */
router.get("/me", authenticateToken, authController.getCurrentUser);

/**
 * @swagger
 * /api/v1/auth/check-username:
 *   post:
 *     tags: [Authentication]
 *     summary: Kiểm tra username có sẵn
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username]
 *             properties:
 *               username:
 *                 type: string
 *                 example: "testuser"
 *     responses:
 *       200:
 *         description: Kết quả kiểm tra
 */
router.post("/check-username", authController.checkUsername);

/**
 * @swagger
 * /api/v1/auth/check-email:
 *   post:
 *     tags: [Authentication]
 *     summary: Kiểm tra email có sẵn
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "test@example.com"
 *     responses:
 *       200:
 *         description: Kết quả kiểm tra
 */
router.post("/check-email", authController.checkEmail);

/**
 * @swagger
 * /api/v1/auth/change-password:
 *   post:
 *     summary: Đổi mật khẩu
 *     description: Đổi mật khẩu cho user đã đăng nhập
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Mật khẩu hiện tại
 *                 example: oldpassword123
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 description: Mật khẩu mới (tối thiểu 6 ký tự)
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc mật khẩu hiện tại sai
 *       401:
 *         description: Chưa đăng nhập
 *       500:
 *         description: Lỗi server
 */
router.post("/change-password", authenticateToken, authController.changePassword);

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Quên mật khẩu
 *     description: Gửi email reset mật khẩu cho user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email của user
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Email reset đã được gửi (nếu email tồn tại)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: If this email exists, a password reset link has been sent
 *       400:
 *         description: Email không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post("/forgot-password", authController.forgotPassword);

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset mật khẩu
 *     description: Reset mật khẩu với token từ email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: Reset token từ email
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 description: Mật khẩu mới (tối thiểu 6 ký tự)
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Reset mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       400:
 *         description: Token không hợp lệ hoặc hết hạn
 *       500:
 *         description: Lỗi server
 */
router.post("/reset-password", authController.resetPassword);
router.post("/refresh", authController.refreshToken);

module.exports = router;
