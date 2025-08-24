/**
 * USER MODEL WITH SUPABASE
 */

const { supabase } = require('../config/supabase');

// =============================================================================
// USER OPERATIONS WITH SUPABASE
// =============================================================================

const create = async (userData) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        id: userData.id, // Sử dụng ID từ Supabase Auth
        username: userData.username,
        email: userData.email,
        display_name: userData.displayName,
        bio: userData.bio || '',
        plan: 'Free',
        avatar_url: null,
        status: 'active',
        role: 'user_free'
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Create user error:', error);
      throw new Error(error.message);
    }

    return {
      id: data.id,
      username: data.username,
      email: data.email,
      displayName: data.display_name,
      bio: data.bio,
      plan: data.plan,
      role: data.role,
      avatar: data.avatar_url,
      status: data.status,
      verified: data.verified,
      createdAt: data.created_at
    };

  } catch (error) {
    console.error('❌ Create user failed:', error);
    throw error;
  }
};

const findById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows found
      }
      throw new Error(error.message);
    }

    return {
      id: data.id,
      username: data.username,
      email: data.email,
      displayName: data.display_name,
      bio: data.bio,
      plan: data.plan,
      role: data.role,
      avatar: data.avatar_url,
      status: data.status,
      verified: data.verified,
      location: data.location,
      website: data.website,
      permissions: data.permissions,
      lastLogin: data.last_login,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

  } catch (error) {
    console.error('❌ Find user by ID failed:', error);
    return null;
  }
};

const findByEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('status', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(error.message);
    }

    return {
      id: data.id,
      username: data.username,
      email: data.email,
      displayName: data.display_name,
      bio: data.bio,
      plan: data.plan,
      role: data.role,
      avatar: data.avatar_url,
      status: data.status,
      verified: data.verified,
      location: data.location,
      website: data.website,
      permissions: data.permissions,
      lastLogin: data.last_login,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

  } catch (error) {
    console.error('❌ Find user by email failed:', error);
    return null;
  }
};

const findByUsername = async (username) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username.toLowerCase())
      .eq('status', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(error.message);
    }

    return {
      id: data.id,
      username: data.username,
      email: data.email,
      displayName: data.display_name,
      bio: data.bio,
      plan: data.plan,
      role: data.role,
      avatar: data.avatar_url,
      status: data.status,
      verified: data.verified,
      location: data.location,
      website: data.website,
      permissions: data.permissions,
      lastLogin: data.last_login,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

  } catch (error) {
    console.error('❌ Find user by username failed:', error);
    return null;
  }
};

const findByEmailOrUsername = async (email, username) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`email.eq.${email.toLowerCase()},username.eq.${username.toLowerCase()}`)
      .eq('status', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(error.message);
    }

    return {
      id: data.id,
      username: data.username,
      email: data.email,
      displayName: data.display_name,
      bio: data.bio,
      plan: data.plan,
      role: data.role,
      avatar: data.avatar_url,
      status: data.status,
      verified: data.verified,
      location: data.location,
      website: data.website,
      permissions: data.permissions,
      lastLogin: data.last_login,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

  } catch (error) {
    console.error('❌ Find user by email/username failed:', error);
    return null;
  }
};

// Password verification is handled by Supabase Auth
// No need for custom password verification

const updateLastLogin = async (userId) => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      console.error('❌ Update last login failed:', error);
    } else {
    }

  } catch (error) {
    console.error('❌ Update last login error:', error);
  }
};

module.exports = {
  create,
  findById,
  findByEmail,
  findByUsername,
  findByEmailOrUsername,
  updateLastLogin
};
