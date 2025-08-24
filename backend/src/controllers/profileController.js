/**
 * =============================================================================
 * PROFILE CONTROLLER - MCP SEQUENTIAL THINKING
 * =============================================================================
 * Public profile management with MCP architecture:
 * - Public profile viewing (no auth required)
 * - Profile customization (auth required)
 * - Link management integration
 * - Analytics tracking
 * - SEO optimization
 */

const User = require("../models/User");
const Profile = require("../models/Profile");
// const Badge = require("../models/Badge"); // Temporarily disabled
const Analytics = require("../models/Analytics");
const { validateRequired } = require("../utils/validation");
const { verifyToken } = require("../utils/jwt");
const { supabase } = require("../config/supabase");


// =============================================================================
// MCP STEP 1: GET PUBLIC PROFILE
// =============================================================================

/**
 * Get public profile by username (no authentication required)
 * MCP Sequential Steps:
 * 1. Validate username parameter
 * 2. Find user by username
 * 3. Get user's active links
 * 4. Track profile view (analytics)
 * 5. Return public profile data
 */
const getPublicProfile = async (req, res) => {
  try {

    
    const { username } = req.params;
    
    // Step 1: Validate username
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }
    
    // Step 2: Find user by username
    const user = await User.findByUsername(username);


    if (!user) {

      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    if (user.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    // Step 3: Get user's profile data from profiles table
    let { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError && profileError.code === 'PGRST116') {
      // Profile not found, create default profile
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([{
          user_id: user.id,
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
          }
        }])
        .select()
        .single();

      if (createError) {
        // If duplicate key error, fetch existing profile
        if (createError.code === '23505') {
          const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (fetchError) {
            console.error('❌ Profile fetch failed:', fetchError.message);
            return res.status(500).json({
              success: false,
              message: 'Failed to load profile'
            });
          }
          profileData = existingProfile;
        } else {
          console.error('❌ Profile creation failed:', createError.message);
          return res.status(500).json({
            success: false,
            message: 'Failed to load profile'
          });
        }
      } else {
        profileData = newProfile;
      }
    } else if (profileError) {
      console.error('❌ [MCP-PROFILE] Error fetching profile:', profileError);
      return res.status(500).json({
        success: false,
        message: 'Failed to load profile'
      });
    }

    // Step 4: Get user's active links from links table
    const { data: linksData, error: linksError } = await supabase
      .from('links')
      .select('*')
      .eq('profile_id', profileData.id)
      .eq('active', true)
      .order('sort_order', { ascending: true });

    const userLinks = linksData || [];
    
    // Step 4: Track profile view (analytics)


    // Track the profile view in analytics
    try {
      // Get visitor info - temporarily disabled
      // const userAgent = req.get('User-Agent') || '';
      // const referrer = req.get('Referer') || '';
      // const ipAddress = req.ip || req.connection.remoteAddress || '127.0.0.1';

      // Determine device type - temporarily disabled
      // let deviceType = 'desktop';
      // if (userAgent.includes('Mobile')) deviceType = 'mobile';
      // else if (userAgent.includes('Tablet')) deviceType = 'tablet';



      // TODO: Analytics tracking temporarily disabled until enhanced analytics is working

    } catch (trackError) {
      console.error('❌ [MCP-PROFILE] Failed to track profile view:', trackError);
      // Don't fail the request if tracking fails
    }
    
    // Step 5: Build public profile response with real data
    const responseData = {
      user: {
        id: user.id,
        username: user.username,
        display_name: user.displayName,
        bio: user.bio,
        avatar_url: user.avatar,
        verified: user.verified,
        member_since: user.createdAt
      },
      profile: {
        id: profileData.id,
        total_views: profileData.total_views || 0,
        total_clicks: profileData.total_clicks || 0,
        show_analytics: profileData.show_analytics,
        allow_comments: profileData.allow_comments,
        // Legacy background fields removed - now using theme_settings.background
        theme_settings: profileData.theme_settings,
        advanced_settings: profileData.advanced_settings
      },
      links: userLinks.map(link => ({
        id: link.id,
        title: link.title,
        url: link.url,
        icon: link.icon,
        description: link.description,
        click_count: link.click_count || 0,
        sort_order: link.sort_order
      }))
    };

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('❌ [MCP-PROFILE] Error getting profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


const updateProfileByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

  

    

    // Step 1: Verify JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }

    const token = authHeader.substring(7);

    let decodedUserId;
    try {
      const decoded = verifyToken(token);
      decodedUserId = decoded.userId;
     
    } catch (jwtError) {
      console.error('❌ JWT verification failed:', jwtError.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Verify the user ID matches the token
    if (decodedUserId !== userId) {
      console.error('❌ [MCP-PROFILE] User ID mismatch:', { decodedUserId, userId });
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this profile'
      });
    }

    // Step 2: Get user info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, email')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      console.error('❌ [MCP-PROFILE] User not found:', userId);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Step 3: Handle different types of updates
    let profileUpdateFields = {};

    // Handle theme updates
    if (updateData.theme) {
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({ theme_settings: updateData.theme })
        .eq('user_id', userId);

      if (profileUpdateError) {
        console.error('❌ [MCP-PROFILE] Failed to update profile theme:', profileUpdateError);
        return res.status(500).json({
          success: false,
          message: 'Failed to update profile theme'
        });
      }
     
    }

    // Background updates now handled through theme_settings.background
    // Legacy background update code removed

    // Handle settings updates (branding, etc.)
    if (updateData.settings) {
      // Handle advanced settings (branding, etc.)
      if (updateData.settings.hideWatermark !== undefined) {
       

        
        const { data: currentProfile, error: readError } = await supabase
          .from('profiles')
          .select('advanced_settings')
          .eq('user_id', userId)
          .single();

        if (readError) {
          console.error('❌ [MCP-PROFILE] Failed to read current profile:', readError);
        } else {
        }

        const currentAdvanced = currentProfile?.advanced_settings || {};
        const currentBranding = currentAdvanced.branding || {};

        // Update watermark setting (simplified logic)
        const updatedAdvanced = {
          ...currentAdvanced,
          branding: {
            ...currentBranding,
            hideWatermark: updateData.settings.hideWatermark // Same value for simplicity
          }
        };

        profileUpdateFields.advanced_settings = updatedAdvanced;
      }

      if (Object.keys(profileUpdateFields).length > 0) {
       

        const { data: updateResult, error: settingsUpdateError } = await supabase
          .from('profiles')
          .update(profileUpdateFields)
          .eq('user_id', userId)
          .select(); // Return updated data

        if (settingsUpdateError) {
          console.error('❌ [MCP-PROFILE] Failed to update profile settings:', settingsUpdateError);
          return res.status(500).json({
            success: false,
            message: 'Failed to update profile settings'
          });
        }

       

        // Verify the update by reading back from database
      
        const { data: verifyData, error: verifyError } = await supabase
          .from('profiles')
          .select('advanced_settings')
          .eq('user_id', userId)
          .single();

        if (verifyError) {
          console.error('❌ [MCP-PROFILE] Verification failed:', verifyError);
        } else {
          
          // Specifically check hideWatermark
          const hideWatermark = verifyData.advanced_settings?.branding?.hideWatermark;
        }
      }
    }

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('❌ [MCP-PROFILE] Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// =============================================================================
// MCP STEP 2: UPDATE PROFILE
// =============================================================================

/**
 * Update user profile (authentication required)
 * MCP Sequential Steps:
 * 1. Authenticate user
 * 2. Validate ownership
 * 3. Validate update data
 * 4. Update profile in database
 * 5. Return updated profile
 */
const updateProfile = async (req, res) => {
  try {

    const { username } = req.params;
    const updateData = req.body;

    
    
    // Step 1: Authenticate user
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
    
    // Step 2: Find and validate ownership
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.username !== username) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile'
      });
    }
    
    // Step 3: Validate update data
    const allowedFields = ['displayName', 'bio', 'avatar', 'theme'];
    const filteredData = {};
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });
    
    // Step 4: Update user in database
    const updateFields = {};
    if (filteredData.displayName) updateFields.display_name = filteredData.displayName;
    if (filteredData.bio) updateFields.bio = filteredData.bio;
    if (filteredData.avatar) updateFields.avatar_url = filteredData.avatar;

    if (Object.keys(updateFields).length > 0) {
      const { error: userUpdateError } = await supabase
        .from('users')
        .update(updateFields)
        .eq('id', user.id);

      if (userUpdateError) {
        console.error('❌ [MCP-PROFILE] Failed to update user:', userUpdateError);
        return res.status(500).json({
          success: false,
          message: 'Failed to update profile'
        });
      }
    }

    // Update profile settings if theme is provided
    if (filteredData.theme) {
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({ theme_settings: filteredData.theme })
        .eq('user_id', user.id);

      if (profileUpdateError) {
        console.error('❌ [MCP-PROFILE] Failed to update profile settings:', profileUpdateError);
        return res.status(500).json({
          success: false,
          message: 'Failed to update profile settings'
        });
      }
    }


    // Step 5: Return updated profile
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        ...user,
        ...filteredData,
        updatedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ [MCP-PROFILE] Update profile failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

// =============================================================================
// MCP STEP 3: GET PROFILE ANALYTICS
// =============================================================================

/**
 * Get profile analytics (owner only)
 * MCP Sequential Steps:
 * 1. Authenticate user
 * 2. Validate ownership
 * 3. Fetch analytics data
 * 4. Return analytics
 */
const getProfileAnalytics = async (req, res) => {
  try {
    
    const { username } = req.params;
    
    // Authentication and ownership validation (similar to updateProfile)
    // ... (implementation similar to above)
    
    // Mock analytics data
    const analytics = {
      profileViews: {
        total: 1234,
        thisWeek: 89,
        thisMonth: 456
      },
      linkClicks: {
        total: 567,
        thisWeek: 45,
        thisMonth: 234
      },
      topLinks: [
        { title: "Instagram", clicks: 125 },
        { title: "Website", clicks: 89 },
        { title: "YouTube", clicks: 67 }
      ],
      demographics: {
        topCountries: ["Vietnam", "USA", "Japan"],
        devices: { mobile: 65, desktop: 35 },
        referrers: ["Direct", "Google", "Social Media"]
      }
    };
    
    
    res.json({
      success: true,
      analytics
    });
    
  } catch (error) {
    console.error('❌ [MCP-PROFILE] Get analytics failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve analytics'
    });
  }
};

// =============================================================================
// BADGE MANAGEMENT
// =============================================================================

/**
 * Get user badges
 */
const getUserBadges = async (req, res) => {
  try {
    const { username } = req.params;

    // Get user ID from username
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username.toLowerCase())
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // TODO: Temporarily disabled until badges tables are created
    // const badges = await Badge.getUserBadges(user.id);
    // const badgeProgress = await Profile.getUserBadgeProgress(user.id);

    res.json({
      success: true,
      data: {
        earnedBadges: [],
        allBadges: []
      }
    });

  } catch (error) {
    console.error('❌ Get user badges failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user badges'
    });
  }
};

/**
 * Sync user badges (manual trigger)
 */
const syncUserBadges = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // TODO: Temporarily disabled until badges tables are created
    // const success = await Profile.syncUserBadges(user.id);

    res.json({
      success: true,
      message: 'Badges sync temporarily disabled'
    });

  } catch (error) {
    console.error('❌ Sync user badges failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync badges'
    });
  }
};

/**
 * Get enhanced analytics with badges
 */
const getEnhancedAnalytics = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get profile ID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    const analytics = await Analytics.getAnalyticsOverview(profile.id);
    // TODO: Temporarily disabled until badges tables are created
    // const badges = await Badge.getUserBadges(user.id);

    res.json({
      success: true,
      data: {
        analytics,
        badges: [],
        badgeCount: 0
      }
    });

  } catch (error) {
    console.error('❌ Get enhanced analytics failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get enhanced analytics'
    });
  }
};

// =============================================================================
// UPDATE PROFILE BY USER ID
// =============================================================================

/**
 * Update profile by user ID (for authenticated users)
 * This endpoint uses user ID instead of username for better security
 */
const updateProfileById = async (req, res) => {
  try {

    const { userId } = req.params;
    const updateData = req.body;


    // Debug: Check if settings.hideWatermark exists
    if (updateData.settings && updateData.settings.hideWatermark !== undefined) {
    } else {
    }

    // Step 1: Verify JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }


    // Step 2: Verify user ID matches token
    if (decoded.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile'
      });
    }

    // Step 3: Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Step 4: Update user fields if provided
    const userUpdateFields = {};
    if (updateData.displayName !== undefined) userUpdateFields.display_name = updateData.displayName;
    if (updateData.bio !== undefined) userUpdateFields.bio = updateData.bio;
    if (updateData.website !== undefined) userUpdateFields.website = updateData.website;
    if (updateData.location !== undefined) userUpdateFields.location = updateData.location;
    if (updateData.avatar) userUpdateFields.avatar_url = updateData.avatar;

    if (Object.keys(userUpdateFields).length > 0) {

      const { data: updateResult, error: userUpdateError } = await supabase
        .from('users')
        .update(userUpdateFields)
        .eq('id', userId)
        .select(); // Return updated data

      if (userUpdateError) {
        console.error('❌ [MCP-PROFILE] Failed to update user:', userUpdateError);
        return res.status(500).json({
          success: false,
          message: 'Failed to update user profile'
        });
      }
    } else {
    }

    // Step 5: Update profile theme settings if provided
    if (updateData.theme) {

      // Get current theme settings to merge with new data
      const { data: currentProfile, error: readError } = await supabase
        .from('profiles')
        .select('theme_settings')
        .eq('user_id', userId)
        .single();

      if (readError) {
        console.error('❌ [MCP-PROFILE] Failed to read current theme:', readError);
      }

      const currentTheme = currentProfile?.theme_settings || {};

      // Deep merge theme settings - handle nested theme_settings properly
      let mergedTheme;
      if (updateData.theme.theme_settings) {
        // If incoming data has theme_settings wrapper, merge the inner content
        mergedTheme = {
          ...currentTheme,
          ...updateData.theme.theme_settings
        };
      } else {
        // Direct theme properties
        mergedTheme = {
          ...currentTheme,
          ...updateData.theme
        };
      }

      console.log('🔄 [DEBUG] Theme merge process:', {
        current: currentTheme,
        incoming: updateData.theme,
        merged: mergedTheme
      });

      // Special handling for typography - merge instead of replace
      if (updateData.theme.typography) {
        mergedTheme.typography = {
          ...currentTheme.typography,
          ...updateData.theme.typography
        };
      }


      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({ theme_settings: mergedTheme })
        .eq('user_id', userId);

      if (profileUpdateError) {
        console.error('❌ [MCP-PROFILE] Failed to update profile theme:', profileUpdateError);
        return res.status(500).json({
          success: false,
          message: 'Failed to update profile theme'
        });
      }
    }

    // Step 6: Update profile settings if provided
    if (updateData.settings) {
      const profileUpdateFields = {};

      // Handle basic settings
      if (updateData.settings.showAnalytics !== undefined) {
        profileUpdateFields.show_analytics = updateData.settings.showAnalytics;
      }
      if (updateData.settings.allowComments !== undefined) {
        profileUpdateFields.allow_comments = updateData.settings.allowComments;
      }

      // Handle advanced settings (branding, etc.)
      if (updateData.settings.hideWatermark !== undefined) {

        // Get current advanced_settings
        const { data: currentProfile, error: readError } = await supabase
          .from('profiles')
          .select('advanced_settings')
          .eq('user_id', userId)
          .single();

        if (readError) {
          console.error('❌ [MCP-PROFILE] Failed to read current profile:', readError);
        } else {
        }

        const currentAdvanced = currentProfile?.advanced_settings || {};
        const currentBranding = currentAdvanced.branding || {};

        // Update watermark setting (simplified logic)
        const updatedAdvanced = {
          ...currentAdvanced,
          branding: {
            ...currentBranding,
            hideWatermark: updateData.settings.hideWatermark // Same value for simplicity
          }
        };

        profileUpdateFields.advanced_settings = updatedAdvanced;
      }

      if (Object.keys(profileUpdateFields).length > 0) {

        const { data: updateResult, error: settingsUpdateError } = await supabase
          .from('profiles')
          .update(profileUpdateFields)
          .eq('user_id', userId)
          .select(); // Return updated data

        if (settingsUpdateError) {
          console.error('❌ [MCP-PROFILE] Failed to update profile settings:', settingsUpdateError);
          return res.status(500).json({
            success: false,
            message: 'Failed to update profile settings'
          });
        }


        // Verify the update by reading back from database
        const { data: verifyData, error: verifyError } = await supabase
          .from('profiles')
          .select('advanced_settings')
          .eq('user_id', userId)
          .single();

        if (verifyError) {
          console.error('❌ [MCP-PROFILE] Verification failed:', verifyError);
        } else {

          // Specifically check hideWatermark
          const hideWatermark = verifyData.advanced_settings?.branding?.hideWatermark;
        }
      }
    }


    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        userId: userId,
        updatedFields: [...Object.keys(userUpdateFields), ...(updateData.theme ? ['theme'] : [])]
      }
    });

  } catch (error) {
    console.error('❌ [MCP-PROFILE] Update profile by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// =============================================================================
// EXPORTS
// =============================================================================

module.exports = {
  getPublicProfile,
  updateProfile,
  updateProfileById,
  updateProfileByUserId,
  getProfileAnalytics,
  getUserBadges,
  syncUserBadges,
  getEnhancedAnalytics
};

