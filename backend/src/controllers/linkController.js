/**
 * =============================================================================
 * LINK CONTROLLER - SUPABASE INTEGRATION
 * =============================================================================
 * Handle link operations with proper validation and error handling
 */

const Link = require('../models/Link');
const { validateRequired, validateUrl } = require('../utils/validation');

/**
 * Get all links for current user
 */
const getMyLinks = async (req, res) => {
  try {
    const userId = req.user.id;
    const links = await Link.findByUserId(userId);

    res.json({
      success: true,
      data: links
    });

  } catch (error) {
    console.error('❌ Get my links failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get links',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Create new link
 */
const createLink = async (req, res) => {
  try {


    const { title, url, description, type, icon, isVisible, sortOrder } = req.body;
    const userId = req.user.id;

    // Get user's profile_id
    const { supabase } = require('../config/supabase');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    const profileId = profile.id;


    // Validate required fields
    const validation = validateRequired(req.body, ['title', 'url']);
    if (!validation.isValid) {

      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        missing: validation.missing
      });
    }

    // Validate URL format
    if (!validateUrl(url)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format'
      });
    }

    const linkData = {
      profileId,
      title,
      url,
      description,
      type,
      icon,
      isVisible,
      sortOrder
    };

    const newLink = await Link.create(linkData);

    res.status(201).json({
      success: true,
      message: 'Link created successfully',
      link: newLink
    });

  } catch (error) {
    console.error('❌ Create link failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create link',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Update link
 */
const updateLink = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;



    // Check if this is actually a reorder request that got misrouted
    if (id === 'reorder') {
      return res.status(400).json({
        success: false,
        message: 'Route conflict detected. Please restart the server.',
        debug: {
          issue: 'reorder request hit updateLink controller',
          solution: 'Restart backend server to apply route changes'
        }
      });
    }

    // Get user's profile_id first
    const { supabase } = require('../config/supabase');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    // Check if link exists and belongs to user
    const existingLink = await Link.findById(id);

    if (!existingLink) {
      return res.status(404).json({
        success: false,
        message: 'Link not found'
      });
    }

    // Check ownership using profile_id
    if (existingLink.profileId !== profile.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Validate URL if provided
    if (updateData.url && !validateUrl(updateData.url)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format'
      });
    }

    const updatedLink = await Link.update(id, updateData);

    res.json({
      success: true,
      message: 'Link updated successfully',
      link: updatedLink
    });

  } catch (error) {
    console.error('❌ Update link failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update link',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Delete link
 */
const deleteLink = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;


    // Get user's profile_id first
    const { supabase } = require('../config/supabase');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    // Check if link exists and belongs to user
    const existingLink = await Link.findById(id);

    if (!existingLink) {
      return res.status(404).json({
        success: false,
        message: 'Link not found'
      });
    }

    // Check ownership using profile_id
    if (existingLink.profileId !== profile.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Link.deleteLink(id);

    res.json({
      success: true,
      message: 'Link deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete link failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete link',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Track link click
 */
const trackClick = async (req, res) => {
  try {
    const { id } = req.params;

    const link = await Link.findById(id);
    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Link not found'
      });
    }

    if (!link.isVisible) {
      return res.status(403).json({
        success: false,
        message: 'Link is not visible'
      });
    }

    const newClickCount = await Link.incrementClickCount(id);

    res.json({
      success: true,
      message: 'Click tracked successfully',
      data: {
        clickCount: newClickCount
      }
    });

  } catch (error) {
    console.error('❌ Track click failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track click',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Reorder links
 */
const reorderLinks = async (req, res) => {
  try {

    const { links } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(links)) {
      return res.status(400).json({
        success: false,
        message: 'Links must be an array'
      });
    }

    if (links.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Links array cannot be empty'
      });
    }

    // Validate link format
    for (const link of links) {
      if (!link.id || typeof link.sortOrder !== 'number') {
        return res.status(400).json({
          success: false,
          message: 'Each link must have id and sortOrder'
        });
      }
    }

    // Get user's profile_id
    const { supabase } = require('../config/supabase');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }


    await Link.reorderLinks(profile.id, links);

    res.json({
      success: true,
      message: 'Links reordered successfully'
    });

  } catch (error) {
    console.error('❌ Reorder links failed:', error.message);
    console.error('❌ Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder links',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Toggle link visibility
 */
const toggleVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;


    // Get user's profile_id
    const { supabase } = require('../config/supabase');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    const existingLink = await Link.findById(id);
    if (!existingLink) {
      return res.status(404).json({
        success: false,
        message: 'Link not found'
      });
    }

    // Check ownership using profile_id
    if (existingLink.profileId !== profile.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updatedLink = await Link.update(id, {
      active: !existingLink.active // Use 'active' field instead of 'isVisible'
    });


    res.json({
      success: true,
      message: 'Link visibility toggled successfully',
      data: updatedLink
    });

  } catch (error) {
    console.error('❌ Toggle visibility failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle visibility',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Duplicate link
 */
const duplicateLink = async (req, res) => {
  try {

    const { id } = req.params;
    const userId = req.user.id;

    // Get user's profile_id
    const { supabase } = require('../config/supabase');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    // Get the original link
    const { data: originalLink, error: linkError } = await supabase
      .from('links')
      .select('*')
      .eq('id', id)
      .eq('profile_id', profile.id)
      .single();

    if (linkError || !originalLink) {
      return res.status(404).json({
        success: false,
        message: 'Link not found'
      });
    }

    // Create duplicate with modified title
    const duplicateData = {
      profile_id: originalLink.profile_id,
      title: `${originalLink.title} (Copy)`,
      url: originalLink.url,
      description: originalLink.description,
      icon: originalLink.icon,
      active: originalLink.active,
      sort_order: originalLink.sort_order + 1,
      click_count: 0
    };

    const { data: newLink, error: createError } = await supabase
      .from('links')
      .insert([duplicateData])
      .select()
      .single();

    if (createError) {
      throw new Error(createError.message);
    }

    res.json({
      success: true,
      message: 'Link duplicated successfully',
      data: newLink
    });

  } catch (error) {
    console.error('❌ [LINK] Duplicate link failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to duplicate link'
    });
  }
};

module.exports = {
  getMyLinks,
  createLink,
  updateLink,
  deleteLink,
  trackClick,
  reorderLinks,
  toggleVisibility,
  duplicateLink
};
