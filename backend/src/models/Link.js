/**
 * =============================================================================
 * LINK MODEL - SUPABASE INTEGRATION
 * =============================================================================
 * Handle link operations with Supabase database
 */

const { supabase } = require('../config/supabase');

/**
 * Create new link
 */
const create = async (linkData) => {
  try {

    const insertData = {
      profile_id: linkData.profileId || linkData.userId, 
      title: linkData.title,
      url: linkData.url,
      description: linkData.description || '',
      icon: linkData.icon || linkData.type || 'website', 
      active: linkData.isVisible !== false, 
      sort_order: linkData.sortOrder || 0,
      click_count: 0
    };


    const { data, error } = await supabase
      .from('links')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('❌ Create link error:', error);
      throw new Error(error.message);
    }

    return {
      id: data.id,
      profileId: data.profile_id,
      title: data.title,
      url: data.url,
      description: data.description,
      type: data.icon, // Map icon to type for frontend compatibility
      icon: data.icon,
      isVisible: data.active, // Map active to isVisible for frontend compatibility
      active: data.active,
      sortOrder: data.sort_order,
      clickCount: data.click_count,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

  } catch (error) {
    console.error('❌ Create link failed:', error);
    throw error;
  }
};

/**
 * Find link by ID
 */
const findById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(error.message);
    }


    return {
      id: data.id,
      profileId: data.profile_id,
      userId: data.user_id, // Keep for backward compatibility
      title: data.title,
      url: data.url,
      description: data.description,
      type: data.icon, // Map icon to type for frontend compatibility
      icon: data.icon,
      isVisible: data.active, // Map active to isVisible for frontend compatibility
      active: data.active,
      sortOrder: data.sort_order,
      clickCount: data.click_count,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

  } catch (error) {
    console.error('❌ Find link by ID failed:', error);
    return null;
  }
};

/**
 * Find all links by user ID
 */
const findByUserId = async (userId) => {
  try {
    // First get user's profile_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      throw new Error('User profile not found');
    }

    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('profile_id', profile.id)
      .order('sort_order', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data.map(link => ({
      id: link.id,
      profileId: link.profile_id,
      title: link.title,
      url: link.url,
      description: link.description,
      type: link.icon, // Map icon to type for frontend compatibility
      icon: link.icon,
      isVisible: link.active, // Map active to isVisible for frontend compatibility
      active: link.active,
      sortOrder: link.sort_order,
      clickCount: link.click_count,
      createdAt: link.created_at,
      updatedAt: link.updated_at
    }));

  } catch (error) {
    console.error('❌ Find links by user ID failed:', error);
    return [];
  }
};

/**
 * Update link
 */
const update = async (id, linkData) => {
  try {

    const updateData = {};

    if (linkData.title !== undefined) updateData.title = linkData.title;
    if (linkData.url !== undefined) updateData.url = linkData.url;
    if (linkData.description !== undefined) updateData.description = linkData.description;
    // Note: 'type' column doesn't exist in database, using 'icon' instead
    if (linkData.type !== undefined) updateData.icon = linkData.type;
    if (linkData.icon !== undefined) updateData.icon = linkData.icon;
    if (linkData.isVisible !== undefined) updateData.active = linkData.isVisible;
    if (linkData.active !== undefined) updateData.active = linkData.active;
    if (linkData.sortOrder !== undefined) updateData.sort_order = linkData.sortOrder;
    if (linkData.featured !== undefined) updateData.featured = linkData.featured;
    if (linkData.metadata !== undefined) updateData.metadata = linkData.metadata;

    updateData.updated_at = new Date().toISOString();


    const { data, error } = await supabase
      .from('links')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: data.id,
      profileId: data.profile_id,
      userId: data.user_id, // Keep for backward compatibility
      title: data.title,
      url: data.url,
      description: data.description,
      type: data.icon, // Map icon to type for frontend compatibility
      icon: data.icon,
      isVisible: data.active, // Map active to isVisible for frontend compatibility
      active: data.active,
      sortOrder: data.sort_order,
      clickCount: data.click_count,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

  } catch (error) {
    console.error('❌ Update link failed:', error);
    throw error;
  }
};

/**
 * Delete link (hard delete)
 */
const deleteLink = async (id) => {
  try {
    const { data, error } = await supabase
      .from('links')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return true;

  } catch (error) {
    console.error('❌ Delete link failed:', error);
    throw error;
  }
};

/**
 * Increment click count
 */
const incrementClickCount = async (id) => {
  try {
    // First get current click count
    const { data: currentData, error: fetchError } = await supabase
      .from('links')
      .select('click_count')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    const newClickCount = (currentData.click_count || 0) + 1;

    // Update with new count
    const { data, error } = await supabase
      .from('links')
      .update({
        click_count: newClickCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data.click_count;

  } catch (error) {
    console.error('❌ Increment click count failed:', error);
    throw error;
  }
};

/**
 * Reorder links
 */
const reorderLinks = async (profileId, linkOrders) => {
  try {

    if (!Array.isArray(linkOrders) || linkOrders.length === 0) {
      throw new Error('Invalid link orders array');
    }

    // Validate each link order
    for (const linkOrder of linkOrders) {
      if (!linkOrder.id || typeof linkOrder.sortOrder !== 'number') {
        console.error('❌ Invalid link order:', linkOrder);
        throw new Error('Invalid link order format');
      }
    }

    const updates = linkOrders.map(({ id, sortOrder }) =>
      supabase
        .from('links')
        .update({
          sort_order: sortOrder,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('profile_id', profileId)
    );

    const results = await Promise.all(updates);

    // Check for errors and log details
    const errors = results.filter(result => result.error);
    if (errors.length > 0) {
      console.error('❌ Some reorder operations failed:');
      errors.forEach((error, index) => {
        console.error(`  Error ${index + 1}:`, error.error);
      });
      throw new Error(`Failed to reorder ${errors.length} out of ${results.length} links`);
    }

    // Log successful updates
    const successCount = results.filter(result => !result.error).length;

    return true;

  } catch (error) {
    console.error('❌ Reorder links failed:', error.message);
    throw error;
  }
};

module.exports = {
  create,
  findById,
  findByUserId,
  update,
  deleteLink,
  incrementClickCount,
  reorderLinks
};
