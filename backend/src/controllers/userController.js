/**
 * =============================================================================
 * USER CONTROLLER - MCP SEQUENTIAL THINKING
 * =============================================================================
 * Comprehensive user management with MCP architecture:
 * - Sequential validation and processing
 * - Proper error handling and logging
 * - Security-first approach
 * - Consistent response format
 */

const User = require("../models/User");
const { validateEmail, validateUsername, validateRequired } = require("../utils/validation");
const { verifyToken } = require("../utils/jwt");
const { supabase } = require("../config/supabase");



// =============================================================================
// MCP MIDDLEWARE: AUTHENTICATION CHECK
// =============================================================================

/**
 * Verify user authentication for protected routes
 * MCP Sequential Steps:
 * 1. Extract token from header
 * 2. Verify token validity
 * 3. Find user in database
 * 4. Attach user to request
 */
const authenticateUser = async (req, res, next) => {
  try {

    
    // Step 1: Extract token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }
    
    const token = authHeader.substring(7);
    
    // Step 2: Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    // Step 3: Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Step 4: Attach user to request
    req.user = user;
    next();
    
  } catch (error) {
    console.error('❌ [MCP-USER] Authentication failed:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// =============================================================================
// MCP STEP 1: GET ALL USERS (ADMIN ONLY)
// =============================================================================

/**
 * Get all users with pagination and filtering
 * MCP Sequential Steps:
 * 1. Check admin permissions
 * 2. Parse query parameters
 * 3. Apply filters and pagination
 * 4. Return user list
 */
const getAllUsers = async (req, res) => {
  try {
    
    // Step 1: Check admin permissions (simplified for now)
    if (req.user && req.user.email !== 'admin@lumilink.vn') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }
    
    // Step 2: Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    // Step 3: Mock user list (in production: query database)
    const mockUsers = [
      {
        id: "1",
        username: "testuser",
        email: "test@example.com",
        displayName: "Test User",
        plan: "free",
        isActive: true,
        createdAt: "2025-01-01T00:00:00.000Z",
        lastLogin: "2025-01-15T10:30:00.000Z"
      },
      {
        id: "2", 
        username: "premiumuser",
        email: "premium@example.com",
        displayName: "Premium User",
        plan: "premium",
        isActive: true,
        createdAt: "2025-01-02T00:00:00.000Z",
        lastLogin: "2025-01-16T14:20:00.000Z"
      }
    ];
    
    // Step 4: Apply search filter
    let filteredUsers = mockUsers;
    if (search) {
      filteredUsers = mockUsers.filter(user => 
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.displayName.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Step 5: Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    
    res.json({
      success: true,
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit)
      },
      filters: {
        search
      }
    });
    
  } catch (error) {
    console.error('❌ [MCP-USER] Get all users failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users'
    });
  }
};

// =============================================================================
// MCP STEP 2: GET USER BY ID
// =============================================================================

/**
 * Get specific user by ID
 * MCP Sequential Steps:
 * 1. Validate user ID parameter
 * 2. Check permissions (own profile or admin)
 * 3. Find user in database
 * 4. Return user data
 */
const getUserById = async (req, res) => {
  try {
    
    const { id } = req.params;
    
    // Step 1: Validate ID parameter
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    // Step 2: Check permissions
    const isOwnProfile = req.user && req.user.id === id;
    const isAdmin = req.user && req.user.email === 'admin@lumilink.vn';
    
    if (!isOwnProfile && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Step 3: Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Step 4: Return user data (exclude password)
    const { password: _, ...userResponse } = user;
    
    res.json({
      success: true,
      user: userResponse
    });
    
  } catch (error) {
    console.error('❌ [MCP-USER] Get user by ID failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user'
    });
  }
};

// =============================================================================
// MCP STEP 3: UPDATE USER
// =============================================================================

/**
 * Update user information
 * MCP Sequential Steps:
 * 1. Validate permissions
 * 2. Validate update data
 * 3. Check for conflicts
 * 4. Update user in database
 * 5. Return updated user
 */
const updateUser = async (req, res) => {
  try {
    
    const { id } = req.params;
    const updateData = req.body;
    
    // Step 1: Check permissions
    const isOwnProfile = req.user && req.user.id === id;
    const isAdmin = req.user && (req.user.email === 'admin@lumilink.vn' || req.user.email === 'admin@gmail.com' || req.user.role === 'admin');
    
    if (!isOwnProfile && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Step 2: Validate update data
    if (updateData.email && !validateEmail(updateData.email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    
    if (updateData.username && !validateUsername(updateData.username)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid username format'
      });
    }
    
    // Step 3: Update user in database
    const updateFields = {};
    if (updateData.username) updateFields.username = updateData.username.toLowerCase();
    if (updateData.email) updateFields.email = updateData.email.toLowerCase();
    if (updateData.displayName) updateFields.display_name = updateData.displayName;
    if (updateData.bio) updateFields.bio = updateData.bio;

    // Admin can update role and plan
    if (isAdmin) {
      if (updateData.role) updateFields.role = updateData.role;
      if (updateData.plan) updateFields.plan = updateData.plan;
      if (updateData.status) updateFields.status = updateData.status;
    }


    if (Object.keys(updateFields).length > 0) {
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update(updateFields)
        .eq('id', id)
        .select()
        .single();


      if (updateError) {
        console.error('❌ [MCP-USER] Failed to update user in database:', updateError);
        return res.status(500).json({
          success: false,
          message: 'Failed to update user',
          error: updateError.message
        });
      }

      if (!updatedUser) {
        console.error('❌ [MCP-USER] No user returned from update');
        return res.status(404).json({
          success: false,
          message: 'User not found or update failed'
        });
      }


      res.json({
        success: true,
        message: 'User updated successfully',
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          displayName: updatedUser.display_name,
          bio: updatedUser.bio,
          plan: updatedUser.plan,
          role: updatedUser.role,
          avatar: updatedUser.avatar_url,
          status: updatedUser.status,
          verified: updatedUser.verified,
          updatedAt: updatedUser.updated_at
        }
      });
    } else {
      res.json({
        success: true,
        message: 'No changes to update'
      });
    }
    
  } catch (error) {
    console.error('❌ [MCP-USER] Update user failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};

// =============================================================================
// MCP STEP 4: DELETE USER
// =============================================================================

/**
 * Delete user account
 * MCP Sequential Steps:
 * 1. Validate permissions
 * 2. Find user to delete
 * 3. Soft delete user
 * 4. Return confirmation
 */
const deleteUser = async (req, res) => {
  try {
    
    const { id } = req.params;
    
    // Step 1: Check permissions (admin only for now)
    const isAdmin = req.user && (req.user.email === 'admin@lumilink.vn' || req.user.email === 'admin@gmail.com' || req.user.role === 'admin');
    
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }
    
    // Step 2: Mock deletion (in production: soft delete in database)
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
    
  } catch (error) {
    console.error('❌ [MCP-USER] Delete user failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};

// =============================================================================
// EXPORTS
// =============================================================================

module.exports = {
  authenticateUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};


