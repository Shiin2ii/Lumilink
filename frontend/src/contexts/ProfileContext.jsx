import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { backgroundService } from '../services/background';

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState({});
  const [currentUserProfile, setCurrentUserProfile] = useState(null);

  // Load current user profile function
  const loadCurrentUserProfile = useCallback(async () => {
      if (!user) {
        setCurrentUserProfile(null);
        return;
      }

      try {
        // Load profile from backend API
        const response = await fetch(`http://localhost:3001/api/v1/profiles/${user.username}`);
        const data = await response.json();

        if (data.success && data.data) {
          const { user: userData, profile: profileData, links } = data.data;

          // Build complete profile object (same structure as getProfile)
          const result = {
            id: userData.id,
            username: userData.username,
            displayName: userData.display_name,
            bio: userData.bio,
            avatar: userData.avatar_url,
            verified: userData.verified,
            memberSince: userData.member_since,
            totalViews: profileData.total_views || 0,
            totalClicks: profileData.total_clicks || 0,
            showAnalytics: profileData.show_analytics,
            allowComments: profileData.allow_comments,
            background: profileData.theme_settings?.background || {
              type: 'gradient',
              value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            },
            theme: profileData.theme_settings,
            advancedSettings: profileData.advanced_settings,
            links: links || []
          };

          setCurrentUserProfile(result);
        } else {
          setCurrentUserProfile(null);
        }
      } catch (error) {
        setCurrentUserProfile(null);
      }
    }, [user]);

  // Initialize profiles from backend data only
  useEffect(() => {
    loadCurrentUserProfile();
  }, [loadCurrentUserProfile]);

  // Expose loadCurrentUserProfile for manual refresh
  const refreshCurrentUserProfile = () => {
    return loadCurrentUserProfile();
  };

  // Get profile by username (enhanced with background loading)
  const getProfile = async (username, forceRefresh = false) => {
    // Check if profile is already cached (unless force refresh)
    if (profiles[username] && !forceRefresh) {
      return profiles[username];
    }

    try {
      // Load from backend API with cache busting
      const response = await fetch(`http://localhost:3001/api/v1/profiles/${username}?t=${Date.now()}`);
      const data = await response.json();

      if (!data.success || !data.data) {
        return null;
      }

      const { user: userData, profile: profileData, links } = data.data;

      // Build profile object
      const result = {
        id: userData.id,
        username: userData.username,
        displayName: userData.display_name,
        bio: userData.bio,
        avatar: userData.avatar_url,
        verified: userData.verified,
        memberSince: userData.member_since,
        totalViews: profileData.total_views || 0,
        totalClicks: profileData.total_clicks || 0,
        showAnalytics: profileData.show_analytics,
        allowComments: profileData.allow_comments,
        background: profileData.theme_settings?.background || {
          type: 'gradient',
          value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        theme: profileData.theme_settings,
        advancedSettings: profileData.advanced_settings,
        links: links || []
      };

      // Load background from API if profile exists
      if (result) {
        try {
          const backgroundResult = await backgroundService.getBackground();
          if (backgroundResult.success) {
            const backgroundData = backgroundService.convertApiToProfileData(backgroundResult.data);

            // Merge background data with profile
            result = {
              ...result,
              ...backgroundData,
              background: {
                type: backgroundResult.data.backgroundType,
                value: backgroundResult.data.backgroundValue
              }
            };
          }
        } catch (error) {
          // Continue with profile without background enhancement
        }
      }

      // Cache the profile
      setProfiles(prev => ({
        ...prev,
        [username]: result
      }));

      return result;

    } catch (error) {
      return null;
    }
  };

  // Update profile
  const updateProfile = async (updatedData) => {
    if (!currentUserProfile) {
      return;
    }

    try {
      // Get auth token - check multiple sources
      const token = localStorage.getItem('token') ||
                   localStorage.getItem('lumilink_token') ||
                   localStorage.getItem('authToken');

      if (!token) {
        throw new Error('Authentication required - please login again');
      }

      // Prepare data for backend API
      const apiData = {};

      // Handle basic profile fields
      if (updatedData.displayName) apiData.displayName = updatedData.displayName;
      if (updatedData.bio) apiData.bio = updatedData.bio;
      if (updatedData.avatar) apiData.avatar = updatedData.avatar;

      // Handle theme data - check for any typography or theme-related fields
      const typographyFields = ['linkColor', 'fontFamily', 'nameSize', 'bioSize', 'linkSize', 'textColor', 'nameWeight', 'bioWeight', 'linkWeight', 'nameItalic', 'bioItalic', 'linkItalic'];
      const hasTypographyChanges = typographyFields.some(field => updatedData.hasOwnProperty(field));
      const hasThemeChanges = updatedData.theme || hasTypographyChanges;

      if (hasThemeChanges) {
        apiData.theme = updatedData.theme || {};

        // Typography settings
        if (hasTypographyChanges) {
          if (!apiData.theme.typography) apiData.theme.typography = {};

          if (updatedData.linkColor) apiData.theme.typography.linkColor = updatedData.linkColor;
          if (updatedData.fontFamily) apiData.theme.typography.fontFamily = updatedData.fontFamily;
          if (updatedData.nameSize) apiData.theme.typography.nameSize = `${updatedData.nameSize}px`;
          if (updatedData.bioSize) apiData.theme.typography.bioSize = `${updatedData.bioSize}px`;
          if (updatedData.linkSize) apiData.theme.typography.fontSize = `${updatedData.linkSize}px`;
          if (updatedData.textColor) apiData.theme.typography.color = updatedData.textColor;
          if (updatedData.nameWeight) apiData.theme.typography.nameWeight = updatedData.nameWeight;
          if (updatedData.bioWeight) apiData.theme.typography.bioWeight = updatedData.bioWeight;
          if (updatedData.linkWeight) apiData.theme.typography.linkWeight = updatedData.linkWeight;
          if (updatedData.nameItalic !== undefined) apiData.theme.typography.nameItalic = updatedData.nameItalic;
          if (updatedData.bioItalic !== undefined) apiData.theme.typography.bioItalic = updatedData.bioItalic;
          if (updatedData.linkItalic !== undefined) apiData.theme.typography.linkItalic = updatedData.linkItalic;
        }
      }

      // Get user ID from currentUserProfile - backend expects user ID
      const userId = currentUserProfile?.id;
      if (!userId) {
        throw new Error('No user ID found in current user profile');
      }

      // Call backend API
      const response = await fetch(`http://localhost:3001/api/v1/profiles/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(apiData)
      });

      const result = await response.json();

      if (result.success) {

        // Update local state
        const updatedProfile = {
          ...currentUserProfile,
          ...updatedData,
          // Preserve certain fields
          username: currentUserProfile.username,
          verified: currentUserProfile.verified,
          totalViews: currentUserProfile.totalViews,
          totalClicks: currentUserProfile.totalClicks
        };

        // Update in profiles object
        setProfiles(prev => ({
          ...prev,
          [currentUserProfile.username]: updatedProfile
        }));

        // Update current user profile
        setCurrentUserProfile(updatedProfile);

        return { success: true, data: updatedProfile };
      } else {
        throw new Error(result.message || 'Update failed');
      }

    } catch (error) {
      throw error;
    }
  };

  // Add link
  const addLink = async (linkData) => {
    // Implementation for adding links
    return { success: true };
  };

  // Update link
  const updateLink = async (linkId, linkData) => {
    // Implementation for updating links
    return { success: true };
  };

  // Delete link
  const deleteLink = async (linkId) => {
    // Implementation for deleting links
    return { success: true };
  };

  // Toggle link
  const toggleLink = async (linkId) => {
    // Implementation for toggling links
    return { success: true };
  };

  const value = {
    profiles,
    currentUserProfile,
    getProfile,
    getCurrentUserProfile: refreshCurrentUserProfile,
    updateProfile,
    addLink,
    updateLink,
    deleteLink,
    toggleLink
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
