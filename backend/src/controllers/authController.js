/**
 * =============================================================================
 * AUTHENTICATION CONTROLLER - MCP SEQUENTIAL THINKING
 * =============================================================================
 * Comprehensive authentication logic with proper error handling,
 * validation, and security measures following MCP principles
 */

const User = require("../models/User");
const { validateEmail, validateUsername, validatePassword, validateRequired } = require("../utils/validation");
const { generateToken, verifyToken } = require("../utils/jwt");
const { supabase } = require("../config/supabase");



// =============================================================================
// MCP STEP 1: USER REGISTRATION
// =============================================================================

/**
 * Register new user with comprehensive validation
 * MCP Sequential Steps:
 * 1. Validate input data
 * 2. Check username/email availability
 * 3. Create user in database
 * 4. Generate JWT token
 * 5. Return success response
 */
const register = async (req, res) => {
  try {


    // Step 1: Extract and validate required fields
    const { username, email, password, displayName } = req.body;



    // Warn about problematic email domains
    if (email && email.includes('@lumilink.vn')) {
      console.warn('⚠️ [MCP-AUTH] Email domain .vn may be blocked by Supabase');
      console.warn('💡 [MCP-AUTH] Try using @gmail.com, @example.com, or @test.com');
    }

    const validation = validateRequired(req.body, ['username', 'email', 'password']);
    if (!validation.isValid) {

      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        missing: validation.missing
      });
    }

    // Step 2: Validate data format
    if (!validateUsername(username)) {

      return res.status(400).json({
        success: false,
        message: 'Username must be 3-20 characters, alphanumeric and underscore only'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự, chứa chữ cái, không được toàn bộ là số và không có khoảng trắng'
      });
    }

    // Step 3: Check username availability
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Step 4: Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username.toLowerCase(),
          display_name: displayName || username
        }
      }
    });

    if (authError) {
      return res.status(400).json({
        success: false,
        message: authError.message
      });
    }

    if (!authData.user) {
      return res.status(400).json({
        success: false,
        message: 'Registration failed'
      });
    }

    // Step 5: Create user profile in our database
    const userData = {
      id: authData.user.id, // Use Supabase Auth user ID
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      displayName: displayName || username
    };

    const newUser = await User.create(userData);

    // Step 6: Create profile for the new user (with duplicate handling)
    try {
      // Use upsert to handle duplicates gracefully
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .upsert([{
          user_id: newUser.id,
          theme_settings: {
            background: { type: "gradient", value: "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" },
            colors: { primary: "#3B82F6", secondary: "#8B5CF6", accent: "#F59E0B" },
            layout: "default",
            typography: {
              fontFamily: "Inter, sans-serif",
              fontSize: "16px",
              fontWeight: "400",
              color: "#ffffff",
              linkColor: "#3B82F6",
              linkHoverColor: "#1D4ED8"
            },
            overlay: { enabled: true, color: "rgba(0,0,0,0.4)", opacity: 0.6 },
            effects: { glassmorphism: true, blur: "12px", shadow: "xl", animations: true },
            customization: { linkStyle: "modern", spacing: "comfortable", borderRadius: "12px", padding: "24px", maxWidth: "400px" }
          },
          media_settings: { audio: null, video: null, autoplay: false, loop: true, muted: true },
          advanced_settings: {
            customCSS: "", customJS: "",
            tracking: { googleAnalytics: "", facebookPixel: "", customTracking: "" },
            seo: { metaTitle: "", metaDescription: "", metaKeywords: [], ogImage: "", twitterCard: "summary_large_image" },
            branding: { logo: "", favicon: "", watermark: false, customFooter: "" },
            components: { showHeader: true, showBio: true, showSocialIcons: true, showFooter: false, linkAnimation: "slide", hoverEffects: true }
          },
          profile_public: true,
          show_analytics: true,
          allow_comments: true
        }], {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (profileError) {
        console.error('❌ Profile creation failed:', profileError.message);
        // Don't fail registration, just log the error
      }
    } catch (profileCreateError) {
      console.error('❌ Profile creation error:', profileCreateError.message);
      // Don't fail registration, just log the error
    }

    // Step 7: Generate token
    const token = generateToken(newUser.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser,
      token
    });

  } catch (error) {
    console.error('❌ [MCP-AUTH] Registration failed:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// =============================================================================
// MCP STEP 2: USER LOGIN
// =============================================================================

/**
 * User login with Supabase Auth integration
 * MCP Sequential Steps:
 * 1. Validate input
 * 2. Authenticate with Supabase
 * 3. Find/create user in our database
 * 4. Generate token
 * 5. Return response
 */
const login = async (req, res) => {
  try {

    // Step 1: Validate input
    const { email, password } = req.body;

    const validation = validateRequired(req.body, ['email', 'password']);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Step 2: Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {

      // Handle email not confirmed error
      if (authError.message === 'Email not confirmed') {
        return res.status(401).json({
          success: false,
          message: 'Email chưa được xác thực. Vui lòng kiểm tra email và click link xác thực.',
          error_code: 'email_not_confirmed'
        });
      }

      return res.status(401).json({
        success: false,
        message: authError?.message || 'Invalid email or password'
      });
    }

    if (!authData.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed'
      });
    }

    // Step 3: Find or create user in our database
    let user = await User.findByEmail(email);

    if (!user) {
      // Create user profile if doesn't exist
      user = await User.create({
        id: authData.user.id,
        email: authData.user.email,
        username: authData.user.email.split('@')[0], // Default username from email
        displayName: authData.user.user_metadata?.display_name || authData.user.email.split('@')[0]
      });
    }

    // Step 4: Update last login
    await User.updateLastLogin(user.id);

    // Step 5: Generate token
    const token = generateToken(user.id);


    res.json({
      success: true,
      message: 'Login successful',
      user: user,
      token
    });

  } catch (error) {
    console.error('❌ [MCP-AUTH] Login failed:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// =============================================================================
// MCP STEP 3: USER LOGOUT
// =============================================================================

const logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error('❌ [MCP-AUTH] Logout failed:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

// =============================================================================
// MCP STEP 4: GET CURRENT USER
// =============================================================================

const getCurrentUser = async (req, res) => {
  try {

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
        message: 'Invalid or expired token'
      });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: user
    });

  } catch (error) {
    console.error('❌ [MCP-AUTH] Get current user failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user information'
    });
  }
};

// =============================================================================
// MCP STEP 5: USERNAME AVAILABILITY CHECK
// =============================================================================

const checkUsername = async (req, res) => {
  try {

    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }

    if (!validateUsername(username)) {
      return res.status(400).json({
        success: false,
        message: 'Username must be 3-20 characters, alphanumeric and underscore only',
        available: false
      });
    }

    const existingUser = await User.findByUsername(username);
    const isAvailable = !existingUser;

    res.json({
      success: true,
      available: isAvailable,
      message: isAvailable ? 'Username is available' : 'Username is already taken'
    });

  } catch (error) {
    console.error('❌ [MCP-AUTH] Username check failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check username availability'
    });
  }
};

// =============================================================================
// MCP STEP 6: EMAIL AVAILABILITY CHECK
// =============================================================================

const checkEmail = async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
        available: false
      });
    }

    const existingUser = await User.findByEmail(email);
    const isAvailable = !existingUser;

    res.json({
      success: true,
      available: isAvailable,
      message: isAvailable ? 'Email is available' : 'Email is already registered'
    });

  } catch (error) {
    console.error('❌ [MCP-AUTH] Email check failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check email availability'
    });
  }
};

// =============================================================================
// MCP STEP 7: PLACEHOLDER FUNCTIONS
// =============================================================================

const changePassword = async (req, res) => {
  try {
    console.log('🔄 [MCP-AUTH] Change password request for user:', req.user.id);

    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    // Validate new password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get user from middleware
    const user = req.user;

    // Verify current password with Supabase
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword
    });

    if (signInError) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password in Supabase
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      console.error('❌ [MCP-AUTH] Password update failed:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Failed to update password'
      });
    }


    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('❌ [MCP-AUTH] Change password failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
};

const forgotPassword = async (req, res) => {
  try {


    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Check if user exists
    const user = await User.findByEmail(email);
    if (!user) {
      // For security, don't reveal if email exists or not
      return res.json({
        success: true,
        message: 'If this email exists, a password reset link has been sent'
      });
    }

    // Send password reset email using Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password`
    });

    if (error) {
      console.error('❌ [MCP-AUTH] Supabase reset password failed:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send reset email'
      });
    }



    res.json({
      success: true,
      message: 'If this email exists, a password reset link has been sent'
    });

  } catch (error) {
    console.error('❌ [MCP-AUTH] Forgot password failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process forgot password request'
    });
  }
};

const resetPassword = async (req, res) => {
  try {


    const { token, newPassword } = req.body;

    // Validate input
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Update password using Supabase
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      console.error('❌ [MCP-AUTH] Supabase password reset failed:', error);
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }



    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('❌ [MCP-AUTH] Reset password failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
};

const refreshToken = async (req, res) => {
  res.json({ success: true, message: "Refresh token - To be implemented" });
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  checkUsername,
  checkEmail,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshToken
};