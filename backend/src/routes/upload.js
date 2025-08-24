const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { verifyToken } = require("../utils/jwt");
const { supabase } = require("../config/supabase");
const User = require("../models/User");

const router = express.Router();

// Configure multer for avatar uploads
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `avatar-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Configure multer for background uploads (images and videos)
const backgroundStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/backgrounds');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const isVideo = file.mimetype.startsWith('video/');
    const prefix = isVideo ? 'video' : 'image';
    cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Avatar upload configuration
const avatarUpload = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for avatars
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for avatars!'), false);
    }
  }
});

// Background upload configuration (supports both images and videos)
const backgroundUpload = multer({
  storage: backgroundStorage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for backgrounds
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'), false);
    }
  }
});

// Avatar upload endpoint
router.post("/avatar", avatarUpload.single('avatar'), async (req, res) => {
  try {

    // Check authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate avatar URL (in production, this would be a proper URL)
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Update user avatar in database

    const { data: updateData, error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: avatarUrl })
      .eq('id', user.id)
      .select()
      .single();


    if (updateError) {
      console.error('❌ [UPLOAD] Failed to update avatar in database:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Failed to update avatar',
        error: updateError.message
      });
    }

    if (!updateData) {
      console.error('❌ [UPLOAD] No user data returned from update');
      return res.status(404).json({
        success: false,
        message: 'User not found or update failed'
      });
    }


    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatarUrl: avatarUrl,
        filename: req.file.filename
      }
    });

  } catch (error) {
    console.error('❌ [UPLOAD] Avatar upload failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload avatar'
    });
  }
});

// Delete avatar endpoint
router.delete("/avatar", async (req, res) => {
  try {

    // Check authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove avatar from database
    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: null })
      .eq('id', user.id);

    if (updateError) {
      console.error('❌ [UPLOAD] Failed to remove avatar from database:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Failed to remove avatar'
      });
    }


    res.json({
      success: true,
      message: 'Avatar removed successfully'
    });

  } catch (error) {
    console.error('❌ [UPLOAD] Avatar deletion failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove avatar'
    });
  }
});

// Background upload endpoint (images and videos)
router.post("/background", backgroundUpload.single('file'), async (req, res) => {
  try {
    console.log('📁 [UPLOAD] Background upload request:', {
      file: req.file ? {
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        originalname: req.file.originalname,
        path: req.file.path,
        destination: req.file.destination
      } : 'No file',
      headers: {
        contentType: req.headers['content-type'],
        contentLength: req.headers['content-length']
      }
    });

    // Check authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Generate correct background URL
    const backgroundUrl = `/uploads/backgrounds/${req.file.filename}`;

    // Check if file actually exists on disk
    const fs = require('fs');
    const filePath = req.file.path;
    const fileExists = fs.existsSync(filePath);
    const fileStats = fileExists ? fs.statSync(filePath) : null;

    console.log('✅ [UPLOAD] Background uploaded successfully:', {
      filename: req.file.filename,
      url: backgroundUrl,
      size: req.file.size,
      type: req.file.mimetype,
      filePath: filePath,
      fileExists: fileExists,
      actualFileSize: fileStats ? fileStats.size : 'N/A',
      isVideo: req.file.mimetype.startsWith('video/')
    });

    res.json({
      success: true,
      message: 'Background uploaded successfully',
      data: {
        url: backgroundUrl,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        type: req.file.mimetype.startsWith('video/') ? 'video' : 'image'
      }
    });

  } catch (error) {
    console.error('❌ [UPLOAD] Background upload failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload background',
      error: error.message
    });
  }
});

// Test endpoint to check if uploaded file exists
router.get("/test/:type/:filename", (req, res) => {
  try {
    const { type, filename } = req.params;
    const fs = require('fs');
    const path = require('path');

    const filePath = path.join(__dirname, `../../uploads/${type}s`, filename);
    const fileExists = fs.existsSync(filePath);

    if (!fileExists) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
        path: filePath
      });
    }

    const stats = fs.statSync(filePath);

    res.json({
      success: true,
      message: 'File exists',
      data: {
        filename: filename,
        path: filePath,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      }
    });

  } catch (error) {
    console.error('❌ [UPLOAD] File test error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking file',
      error: error.message
    });
  }
});

router.post("/image", (req, res) => {
  res.json({ success: true, message: "Image upload endpoint" });
});

module.exports = router;
