const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const axios = require('axios');
// Simple middleware for testing
const authenticateToken = (req, res, next) => {
  // Mock user for testing
  req.user = { id: 1, username: 'testuser', email: 'test@example.com' };
  next();
};

const checkPremium = (req, res, next) => {
  // Allow all for testing
  next();
};
const Subscription = require('../models/Subscription');
const router = express.Router();

// MoMo Payment Configuration
const MOMO_CONFIG = {
  partnerCode: process.env.MOMO_PARTNER_CODE || 'MOMO',
  accessKey: process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85',
  secretKey: process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
  endpoint: process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create',
  redirectUrl: process.env.MOMO_REDIRECT_URL || 'http://localhost:3000/premium/payment/success',
  ipnUrl: process.env.MOMO_IPN_URL || 'http://localhost:3001/api/v1/premium/momo/callback'
};

// Premium Plans Configuration
const PREMIUM_PLANS = {
  monthly: {
    id: 'monthly',
    name: 'Premium Hàng Tháng',
    price: 50000,
    duration: 30, // days
    description: 'Tất cả tính năng Premium với thanh toán hàng tháng'
  },
  yearly: {
    id: 'yearly',
    name: 'Premium Hàng Năm',
    price: 399000,
    duration: 365, // days
    description: 'Tiết kiệm 33% với thanh toán hàng năm'
  },
  lifetime: {
    id: 'lifetime',
    name: 'Premium Trọn Đời',
    price: 999999,
    duration: -1, // unlimited
    description: 'Thanh toán một lần, sử dụng trọn đời'
  }
};

// Helper function to create MoMo signature
function createMoMoSignature(rawData) {
  return crypto.createHmac('sha256', MOMO_CONFIG.secretKey)
    .update(rawData)
    .digest('hex');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/backgrounds');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `background-${uniqueSuffix}${ext}`);
  }
});

// File filter for images and videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

/**
 * @swagger
 * /api/v1/premium/upload-background:
 *   post:
 *     summary: Upload background image/video
 *     description: Upload background image hoặc video cho Premium users
 *     tags: [Premium]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Background image hoặc video file
 *               backgroundType:
 *                 type: string
 *                 enum: [image, video]
 *                 description: Loại background
 *                 example: image
 *     responses:
 *       200:
 *         description: Background uploaded successfully
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
 *                   example: Background uploaded successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                       example: background_1234567890.jpg
 *                     url:
 *                       type: string
 *                       example: /uploads/backgrounds/background_1234567890.jpg
 *                     type:
 *                       type: string
 *                       example: image
 *                     size:
 *                       type: integer
 *                       example: 1024000
 *       400:
 *         description: Invalid file or missing file
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Premium subscription required
 *       500:
 *         description: Upload failed
 */
// Premium background upload endpoint
router.post('/upload-background', authenticateToken, checkPremium, upload.single('file'), async (req, res) => {
  try {
    console.log('📁 [PREMIUM] Upload request:', {
      userId: req.user.id,
      file: req.file ? {
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : 'No file'
    });

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Determine background type
    const isImage = req.file.mimetype.startsWith('image/');
    const isVideo = req.file.mimetype.startsWith('video/');
    const backgroundType = isImage ? 'image' : 'video';

    // Generate file URL
    const fileUrl = `/uploads/backgrounds/${req.file.filename}`;

    console.log('✅ [PREMIUM] File processed:', {
      filename: req.file.filename,
      type: backgroundType,
      url: fileUrl,
      size: req.file.size
    });

    // Return success response
    res.json({
      success: true,
      message: 'Background uploaded successfully',
      data: {
        url: fileUrl,
        type: backgroundType,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });

  } catch (error) {
    console.error('❌ [PREMIUM] Upload error:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Failed to clean up uploaded file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Upload failed: ' + error.message
    });
  }
});

// Get uploaded backgrounds for user
router.get('/backgrounds', authenticateToken, checkPremium, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // In a real app, you'd query database for user's uploaded backgrounds
    // For now, we'll return a simple response
    res.json({
      success: true,
      data: {
        backgrounds: []
      }
    });

  } catch (error) {
    console.error('❌ [PREMIUM] Get backgrounds error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get backgrounds'
    });
  }
});

// Delete uploaded background
router.delete('/background/:filename', authenticateToken, checkPremium, async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../../uploads/backgrounds', filename);

    // Check if file exists and delete it
    try {
      await fs.unlink(filePath);
      
      res.json({
        success: true,
        message: 'Background deleted successfully'
      });
    } catch (error) {
      if (error.code === 'ENOENT') {
        res.status(404).json({
          success: false,
          message: 'Background not found'
        });
      } else {
        throw error;
      }
    }

  } catch (error) {
    console.error('❌ [PREMIUM] Delete background error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete background'
    });
  }
});

// ==================== MOMO PAYMENT ENDPOINTS ====================

/**
 * @swagger
 * /api/v1/premium/payment/momo/create:
 *   post:
 *     summary: Create MoMo payment request
 *     description: Tạo yêu cầu thanh toán MoMo cho gói Premium
 *     tags: [Premium]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planId
 *             properties:
 *               planId:
 *                 type: string
 *                 enum: [monthly, yearly, lifetime]
 *                 description: ID của gói Premium
 *                 example: yearly
 *     responses:
 *       200:
 *         description: Payment URL created successfully
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
 *                   example: Payment URL created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     payUrl:
 *                       type: string
 *                       example: https://test-payment.momo.vn/v2/gateway/pay?t=...
 *                     orderId:
 *                       type: string
 *                       example: LUMILINK_1_yearly_1755622347142
 *                     amount:
 *                       type: integer
 *                       example: 399000
 *                     planId:
 *                       type: string
 *                       example: yearly
 *       400:
 *         description: Invalid plan or request
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
// Create MoMo payment request
router.post('/payment/momo/create', authenticateToken, async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user.id;

    // Validate plan
    const plan = PREMIUM_PLANS[planId];
    if (!plan) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan selected'
      });
    }

    // Generate unique order ID
    const orderId = `LUMILINK_${userId}_${planId}_${Date.now()}`;
    const requestId = `REQ_${Date.now()}`;
    const amount = plan.price;
    const orderInfo = `Thanh toán ${plan.name} - LumiLink Premium`;

    // Create raw signature string
    const rawSignature = `accessKey=${MOMO_CONFIG.accessKey}&amount=${amount}&extraData=&ipnUrl=${MOMO_CONFIG.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_CONFIG.partnerCode}&redirectUrl=${MOMO_CONFIG.redirectUrl}&requestId=${requestId}&requestType=captureWallet`;

    // Generate signature
    const signature = createMoMoSignature(rawSignature);

    // Prepare MoMo request body
    const requestBody = {
      partnerCode: MOMO_CONFIG.partnerCode,
      accessKey: MOMO_CONFIG.accessKey,
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: MOMO_CONFIG.redirectUrl,
      ipnUrl: MOMO_CONFIG.ipnUrl,
      extraData: '',
      requestType: 'captureWallet',
      signature: signature,
      lang: 'vi'
    };

    console.log('🔄 [MOMO] Creating payment request:', {
      orderId,
      amount,
      planId,
      userId
    });

    // Send request to MoMo
    const response = await axios.post(MOMO_CONFIG.endpoint, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const momoResponse = response.data;

    if (momoResponse.resultCode === 0) {
      // TODO: Save payment request to database
      console.log('✅ [MOMO] Payment URL created:', momoResponse.payUrl);

      res.json({
        success: true,
        message: 'Payment URL created successfully',
        data: {
          payUrl: momoResponse.payUrl,
          orderId: orderId,
          amount: amount,
          planId: planId
        }
      });
    } else {
      console.error('❌ [MOMO] Payment creation failed:', momoResponse);
      res.status(400).json({
        success: false,
        message: 'Failed to create payment URL',
        error: momoResponse.message
      });
    }

  } catch (error) {
    console.error('❌ [MOMO] Payment creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/v1/premium/momo/callback:
 *   post:
 *     summary: MoMo payment callback (IPN)
 *     description: Webhook endpoint để nhận thông báo từ MoMo về trạng thái thanh toán
 *     tags: [Premium]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               partnerCode:
 *                 type: string
 *               orderId:
 *                 type: string
 *               requestId:
 *                 type: string
 *               amount:
 *                 type: integer
 *               orderInfo:
 *                 type: string
 *               orderType:
 *                 type: string
 *               transId:
 *                 type: string
 *               resultCode:
 *                 type: integer
 *               message:
 *                 type: string
 *               payType:
 *                 type: string
 *               responseTime:
 *                 type: integer
 *               extraData:
 *                 type: string
 *               signature:
 *                 type: string
 *     responses:
 *       200:
 *         description: IPN processed successfully
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
 *                   example: IPN processed successfully
 *       400:
 *         description: Invalid signature
 *       500:
 *         description: IPN processing failed
 */
// MoMo IPN (Instant Payment Notification) callback
router.post('/momo/callback', async (req, res) => {
  try {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature
    } = req.body;

    console.log('📞 [MOMO] IPN Callback received:', {
      orderId,
      resultCode,
      message,
      transId
    });

    // Verify signature
    const rawSignature = `accessKey=${MOMO_CONFIG.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
    const expectedSignature = createMoMoSignature(rawSignature);

    if (signature !== expectedSignature) {
      console.error('❌ [MOMO] Invalid signature');
      return res.status(400).json({
        success: false,
        message: 'Invalid signature'
      });
    }

    // Process payment result
    if (resultCode === 0) {
      // Payment successful
      console.log('✅ [MOMO] Payment successful:', orderId);

      // Extract user ID and plan from order ID
      const orderParts = orderId.split('_');
      const userId = orderParts[1];
      const planId = orderParts[2];

      // Get plan details
      const plan = PREMIUM_PLANS[planId];
      if (!plan) {
        console.error('❌ [MOMO] Invalid plan ID:', planId);
        return res.json({ success: true, message: 'IPN processed but invalid plan' });
      }

      // Calculate end date
      let endDate;
      if (plan.duration === -1) {
        // Lifetime subscription - set to 100 years from now
        endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 100);
      } else {
        // Regular subscription
        endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.duration);
      }

      try {
        // Create subscription record
        await Subscription.create({
          userId: parseInt(userId),
          planId: planId,
          status: 'active',
          startDate: new Date().toISOString(),
          endDate: endDate.toISOString(),
          orderId: orderId,
          transactionId: transId,
          amount: parseInt(amount),
          paymentMethod: 'momo'
        });


      } catch (error) {
        console.error('❌ [MOMO] Error creating subscription:', error);
      }
    } else {
      // Payment failed

    }

    // Always return success to MoMo
    res.json({
      success: true,
      message: 'IPN processed successfully'
    });

  } catch (error) {
    console.error('❌ [MOMO] IPN processing error:', error);
    res.status(500).json({
      success: false,
      message: 'IPN processing failed'
    });
  }
});

/**
 * @swagger
 * /api/v1/premium/payment/status/{orderId}:
 *   get:
 *     summary: Check payment status
 *     description: Kiểm tra trạng thái thanh toán theo order ID
 *     tags: [Premium]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID từ MoMo payment
 *         example: LUMILINK_1_yearly_1755622347142
 *     responses:
 *       200:
 *         description: Payment status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     orderId:
 *                       type: string
 *                       example: LUMILINK_1_yearly_1755622347142
 *                     status:
 *                       type: string
 *                       enum: [pending, completed, failed]
 *                       example: completed
 *                     subscription:
 *                       type: object
 *                       description: Subscription details if payment completed
 *                     message:
 *                       type: string
 *                       example: Payment completed successfully
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Failed to check payment status
 */
// Check payment status
router.get('/payment/status/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;

    // Query subscription by order ID
    const subscription = await Subscription.getByOrderId(orderId);

    if (subscription) {
      res.json({
        success: true,
        data: {
          orderId,
          status: subscription.status,
          subscription: subscription.toJSON(),
          message: 'Payment completed successfully'
        }
      });
    } else {
      res.json({
        success: true,
        data: {
          orderId,
          status: 'pending',
          message: 'Payment is being processed'
        }
      });
    }

  } catch (error) {
    console.error('❌ [PREMIUM] Payment status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check payment status'
    });
  }
});

/**
 * @swagger
 * /api/v1/premium/subscription:
 *   get:
 *     summary: Get user subscription status
 *     description: Lấy thông tin subscription hiện tại của user
 *     tags: [Premium]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     hasSubscription:
 *                       type: boolean
 *                       example: true
 *                     subscription:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         planId:
 *                           type: string
 *                           example: yearly
 *                         status:
 *                           type: string
 *                           example: active
 *                         startDate:
 *                           type: string
 *                           format: date-time
 *                         endDate:
 *                           type: string
 *                           format: date-time
 *                         daysRemaining:
 *                           type: integer
 *                           example: 365
 *                         isActive:
 *                           type: boolean
 *                           example: true
 *                     isPremium:
 *                       type: boolean
 *                       example: true
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Failed to get subscription status
 */
// Get user subscription status
router.get('/subscription', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get active subscription
    const activeSubscription = await Subscription.getActiveByUserId(userId);

    if (activeSubscription) {
      res.json({
        success: true,
        data: {
          hasSubscription: true,
          subscription: activeSubscription.toJSON(),
          isPremium: true
        }
      });
    } else {
      res.json({
        success: true,
        data: {
          hasSubscription: false,
          subscription: null,
          isPremium: false
        }
      });
    }

  } catch (error) {
    console.error('❌ [PREMIUM] Get subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription status'
    });
  }
});

/**
 * @swagger
 * /api/v1/premium/plans:
 *   get:
 *     summary: Get available premium plans
 *     description: Lấy danh sách các gói Premium có sẵn
 *     tags: [Premium]
 *     responses:
 *       200:
 *         description: Premium plans retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     plans:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: yearly
 *                           name:
 *                             type: string
 *                             example: Premium Hàng Năm
 *                           price:
 *                             type: integer
 *                             example: 399000
 *                           duration:
 *                             type: integer
 *                             description: Số ngày, -1 cho lifetime
 *                             example: 365
 *                           description:
 *                             type: string
 *                             example: Tiết kiệm 33% với thanh toán hàng năm
 *                           popular:
 *                             type: boolean
 *                             example: true
 *       500:
 *         description: Failed to get premium plans
 */
// Get available premium plans
router.get('/plans', async (_req, res) => {
  try {
    const plans = Object.values(PREMIUM_PLANS).map(plan => ({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      description: plan.description,
      popular: plan.id === 'yearly' // Mark yearly as popular
    }));

    res.json({
      success: true,
      data: { plans }
    });

  } catch (error) {
    console.error('❌ [PREMIUM] Get plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get premium plans'
    });
  }
});

module.exports = router;
