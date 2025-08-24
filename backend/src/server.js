/**
 * =============================================================================
 * LUMILINK BACKEND API SERVER - MCP SEQUENTIAL THINKING VERSION
 * =============================================================================
 * Rebuilt from scratch with clean architecture and sequential thinking approach
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { testConnection } = require('./config/supabase');
const { setupSwagger } = require('./config/swagger');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Starting LumiLink Backend API Server with MCP Sequential Thinking Architecture

// =============================================================================
// MIDDLEWARE SETUP
// =============================================================================

// CORS configuration - Allow frontend access
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads with proper headers for video
app.use('/uploads', (req, res, next) => {
  // Set CORS headers for media files
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Range');

  // Set proper content type for video files
  if (req.path.match(/\.(mp4|webm|mov|avi|mkv)$/i)) {
    const ext = req.path.split('.').pop().toLowerCase();
    const mimeTypes = {
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'mov': 'video/quicktime',
      'avi': 'video/x-msvideo',
      'mkv': 'video/x-matroska'
    };
    res.type(mimeTypes[ext] || 'video/mp4');
  }

  next();
}, express.static(path.join(__dirname, '../uploads')));

// Request logging middleware (disabled for performance)
// app.use((req, res, next) => {
//   const timestamp = new Date().toISOString();
//   console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
//   next();
// });

// =============================================================================
// CORE ENDPOINTS
// =============================================================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// =============================================================================
// MULTER CONFIGURATION FOR FILE UPLOADS
// =============================================================================

// Create uploads directories if they don't exist
const uploadsDir = path.join(__dirname, '../uploads');
const avatarsDir = path.join(uploadsDir, 'avatars');
const backgroundsDir = path.join(uploadsDir, 'backgrounds');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}
if (!fs.existsSync(backgroundsDir)) {
  fs.mkdirSync(backgroundsDir, { recursive: true });
}

// Multer configuration moved to routes/upload.js

// =============================================================================
// UPLOAD & BACKGROUND ENDPOINTS - MOVED TO ROUTES/UPLOAD.JS
// =============================================================================

// Upload endpoints are now handled by routes/upload.js

// Update profile background endpoint
app.put('/api/v1/profile/background', async (req, res) => {


  const { backgroundType, backgroundValue } = req.body;

  // Validate input
  if (!backgroundType) {
    return res.status(400).json({
      success: false,
      message: 'Background type is required'
    });
  }

  // Validate background type
  const validTypes = ['gradient', 'solid', 'image', 'video'];
  if (!validTypes.includes(backgroundType)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid background type. Must be: gradient, solid, image, or video'
    });
  }



  try {
    // For now, we'll use a demo user ID. In real app, get from JWT token
    const demoUserId = 'd5662c44-d237-41a3-ab5f-84fa97fbab2a'; // Replace with actual user ID from auth

    // Get current theme settings to merge with new background
    const { data: currentProfile, error: readError } = await supabase
      .from('profiles')
      .select('theme_settings')
      .eq('user_id', demoUserId)
      .single();

    if (readError) {
      console.error('❌ Failed to read current theme:', readError);
    }

    const currentTheme = currentProfile?.theme_settings || {};

    // Update theme_settings with new background
    const updatedTheme = {
      ...currentTheme,
      background: {
        type: backgroundType,
        value: backgroundValue
      }
    };

    // Update profile in database
    const { data, error } = await supabase
      .from('profiles')
      .update({
        theme_settings: updatedTheme,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', demoUserId)
      .select();

    if (error) {
      console.error('❌ Database update error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update background in database',
        error: error.message
      });
    }



    res.json({
      success: true,
      message: 'Background updated successfully',
      data: {
        backgroundType,
        backgroundValue,
        updatedAt: new Date().toISOString(),
        profile: data[0]
      }
    });

  } catch (error) {
    console.error('❌ Update background error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get profile background endpoint
app.get('/api/v1/profile/background', async (req, res) => {


  try {
    // For now, we'll use a demo user ID. In real app, get from JWT token
    const demoUserId = 'd5662c44-d237-41a3-ab5f-84fa97fbab2a'; // Replace with actual user ID from auth

    // Query profile from database
    const { data, error } = await supabase
      .from('profiles')
      .select('theme_settings')
      .eq('user_id', demoUserId)
      .single();

    if (error) {
      console.error('❌ Database query error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get background from database',
        error: error.message
      });
    }

    // Extract background from theme_settings
    const background = data?.theme_settings?.background || {
      type: 'gradient',
      value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    };

    // Convert database format to API format
    const backgroundData = {
      backgroundType: background.type,
      backgroundValue: background.value
    };

    res.json({
      success: true,
      data: backgroundData
    });

  } catch (error) {
    console.error('❌ Get background error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// =============================================================================
// API ROUTES LOADING - SEQUENTIAL APPROACH
// =============================================================================

// Loading API routes sequentially

// Define routes to load in order
const routesToLoad = [
  { path: '/api/v1/auth', file: './routes/auth', name: 'Authentication' },
  { path: '/api/v1/users', file: './routes/users', name: 'User Management' },
  { path: '/api/v1/profiles', file: './routes/profiles', name: 'Public Profiles' },
  { path: '/api/v1/links', file: './routes/links', name: 'Link Management' },
  { path: '/api/v1/badges', file: './routes/badges', name: 'Badge System' },
  { path: '/api/v1/analytics', file: './routes/analytics', name: 'Analytics' },
  { path: '/api/v1/upload', file: './routes/upload', name: 'File Upload' },
  { path: '/api/v1/premium', file: './routes/premium', name: 'Premium Features' },
  { path: '/api/v1/admin', file: './routes/admin', name: 'Administration' }
];

// Load each route with error handling
let loadedRoutes = 0;
routesToLoad.forEach((route, index) => {
  try {
    const routeModule = require(route.file);
    app.use(route.path, routeModule);
    // Route loaded successfully
    loadedRoutes++;
  } catch (error) {
    console.warn(`⚠️ [${index + 1}/${routesToLoad.length}] Failed to load ${route.name}:`, error.message);
  }
});

// Routes loading completed

// =============================================================================
// SWAGGER API DOCUMENTATION
// =============================================================================

try {
  setupSwagger(app);
  // Swagger UI setup successful
} catch (error) {
  console.warn('⚠️ Swagger setup failed:', error.message);
}

// Basic API info endpoint
app.get('/api/v1', (req, res) => {
  res.json({
    message: 'LumiLink API v1',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      profiles: '/api/v1/profiles',
      links: '/api/v1/links',
      analytics: '/api/v1/analytics',
      upload: '/api/v1/upload',
      premium: '/api/v1/premium',
      // admin: '/api/v1/admin' // Hidden for security
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server with Supabase initialization
const startServer = async () => {
  // Initializing database connection

  // Test Supabase connection
  const isConnected = await testConnection();

  if (!isConnected) {
    console.warn('⚠️ Database connection failed - using fallback mode');
  }

  // Start HTTP server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 LumiLink Backend running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
    if (!isConnected) {
      console.warn('⚠️ Running in fallback mode - database connection failed');
    }
  });
};

// Initialize server
startServer().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

module.exports = app;