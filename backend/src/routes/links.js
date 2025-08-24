/**
 * =============================================================================
 * LINKS ROUTES - WITH SWAGGER DOCUMENTATION
 * =============================================================================
 */

const express = require("express");
const router = express.Router();
const linkController = require("../controllers/linkController");
const { authenticateToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/v1/links:
 *   get:
 *     tags: [Links]
 *     summary: Lấy danh sách links
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách links thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 links:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Link'
 */
router.get("/me", authenticateToken, linkController.getMyLinks);

// Specific routes MUST come before parameterized routes
/**
 * @swagger
 * /api/v1/links/reorder:
 *   put:
 *     tags: [Links]
 *     summary: Sắp xếp lại thứ tự links
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               links:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     sortOrder:
 *                       type: number
 *     responses:
 *       200:
 *         description: Sắp xếp thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.put("/reorder", authenticateToken, linkController.reorderLinks);

/**
 * @swagger
 * /api/v1/links:
 *   post:
 *     tags: [Links]
 *     summary: Tạo link mới
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, url]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Instagram"
 *               url:
 *                 type: string
 *                 example: "https://instagram.com/username"
 *               platform:
 *                 type: string
 *                 example: "instagram"
 *               description:
 *                 type: string
 *                 example: "Follow me on Instagram"
 *     responses:
 *       201:
 *         description: Link tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/", authenticateToken, linkController.createLink);

/**
 * @swagger
 * /api/v1/links/{id}:
 *   put:
 *     tags: [Links]
 *     summary: Cập nhật link
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               url:
 *                 type: string
 *               platform:
 *                 type: string
 *               description:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Link cập nhật thành công
 *       404:
 *         description: Link không tồn tại
 */
router.put("/:id", authenticateToken, linkController.updateLink);

/**
 * @swagger
 * /api/v1/links/{id}:
 *   delete:
 *     tags: [Links]
 *     summary: Xóa link
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Link xóa thành công
 *       404:
 *         description: Link không tồn tại
 */
router.delete("/:id", authenticateToken, linkController.deleteLink);

// Additional routes
router.post("/:id/click", linkController.trackClick);
router.patch("/:id/toggle-visibility", authenticateToken, linkController.toggleVisibility);

/**
 * @swagger
 * /api/v1/links/{id}/duplicate:
 *   post:
 *     tags: [Links]
 *     summary: Duplicate link
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Link duplicated successfully
 *       404:
 *         description: Link not found
 */
router.post("/:id/duplicate", authenticateToken, linkController.duplicateLink);



module.exports = router;
