import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShareIcon,
  ClipboardDocumentIcon,
  UserIcon,
  ArrowTopRightOnSquareIcon,
  EyeIcon,
  SpeakerWaveIcon,
} from '@heroicons/react/24/outline';

import { BrandIcon } from '../components/icons/BrandIcons';
import { useProfile } from '../contexts/ProfileContext';
import MediaBackground from '../components/profile/MediaBackground';
import AudioLinkCard from '../components/links/AudioLinkCard';
import BadgeDisplay from '../components/profile/BadgeDisplay';
import BadgeNotificationSystem from '../components/badges/BadgeNotificationSystem';
// import RingAvatar from '../components/ui/RingAvatar'; // Removed ring avatar
import { isAudioUrl } from '../utils/audioValidators';
import enhancedAnalyticsService from '../services/enhancedAnalyticsService';
import analyticsApi from '../services/analyticsApi';

const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { getProfile } = useProfile();
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [volume, setVolume] = useState(100); // Volume state (0-100)
  const [refreshKey, setRefreshKey] = useState(0);
  const videoRef = useRef(null); // Ref to access video element
  const [backgroundStyle, setBackgroundStyle] = useState({
    background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', // Dark neutral instead of purple
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  });

  // Animated title effect
  useEffect(() => {
    if (!profile?.username && !username) return;

    const usernameText = profile?.username || username;
    const titleText = `@${usernameText}`;
    let currentIndex = 0;
    let isDeleting = false;
    let currentText = '';

    const typeEffect = () => {
      if (!isDeleting) {
        // Typing effect
        currentText = titleText.substring(0, currentIndex + 1);
        currentIndex++;

        if (currentIndex === titleText.length) {
          // Pause at full text, then start deleting after 3 seconds
          setTimeout(() => {
            isDeleting = true;
          }, 3000);
        }
      } else {
        // Deleting effect
        currentText = titleText.substring(0, currentIndex - 1);
        currentIndex--;

        if (currentIndex === 0) {
          // Reset and start typing again
          isDeleting = false;
        }
      }

      document.title = currentText || '@';

      // Continue animation with very slow speed
      setTimeout(typeEffect, isDeleting ? 150 : 500);
    };

    // Start the animation
    typeEffect();

    // Cleanup function to reset title
    return () => {
      document.title = 'LumiLink';
    };
  }, [profile, username]);

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    if (!profile?.id) return;

    try {
      console.log('🔍 [DEBUG] Fetching analytics for profile:', profile.id);
      const result = await analyticsApi.getProfileAnalytics(profile.id, '30d');
      console.log('📊 [DEBUG] Analytics result:', result);
      setAnalytics(result.data || result);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Set fallback analytics data
      setAnalytics({
        profileViews: { total: profile.total_views || 0 },
        linkClicks: { total: 0 }
      });
    }
  }, [profile?.id, profile?.total_views]);

  // Fetch user data based on username
  const fetchUserProfile = useCallback(async () => {
      setError(null);

      const currentUsername = username || 'demo';

      try {
        // Use correct API endpoint - backend is running on port 3001
        const apiUrl = `http://localhost:3001/api/v1/profiles/${currentUsername}?t=${Date.now()}`;

        const response = await fetch(apiUrl);
        const data = await response.json();



        if (response.ok && data.success && data.data) {
          const { user, profile, links } = data.data;

          // Try multiple avatar sources
          let avatarUrl = user.avatar_url || user.avatar || profile.avatar_url || profile.avatar;

          // Convert relative path to full URL if needed
          if (avatarUrl && !avatarUrl.startsWith('http')) {
            avatarUrl = `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001'}${avatarUrl}`;
          }

          const profileData = {
            id: user.username,
            username: user.username,
            displayName: user.display_name,
            bio: user.bio,
            avatar: avatarUrl ? `${avatarUrl}?t=${Date.now()}` : null,
            verified: user.verified,
            viewCount: profile.total_views,
            total_views: profile.total_views, // Add explicit field
            memberSince: user.member_since,
            settings: {
              showAnalytics: profile.show_analytics,
              allowComments: profile.allow_comments
            },
            // Legacy background fields removed - now using theme_settings.background only
            theme: profile.theme_settings,
            advancedSettings: profile.advanced_settings
          };

          console.log('🔍 [DEBUG] ProfilePage loaded theme data:', {
            theme: profileData.theme,
            background: profileData.theme?.background,
            timestamp: new Date().toISOString()
          });



          // Preload background before setting profile to prevent flashing
          await preloadBackground(profileData);

          setProfile(profileData);

          // Force apply theme background if available
          const themeBackground = profileData?.theme?.background;
          console.log('🎨 [DEBUG] Applying theme background:', themeBackground);

          if (themeBackground?.type && themeBackground?.value) {
            if (themeBackground.type === 'solid' || themeBackground.type === 'gradient') {
              console.log('🎨 [DEBUG] Setting background style:', themeBackground.value);
              setBackgroundStyle({
                background: themeBackground.value,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              });
            } else if (themeBackground.type === 'image' || themeBackground.type === 'video') {
              console.log('🖼️ [DEBUG] Media background detected, will be handled by MediaBackground component');
            }
          } else {
            console.log('⚠️ [DEBUG] No theme background found, using default');
            setBackgroundStyle({
              background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            });
          }

          // Set links from API response
          setLinks(links || []);

          // 🎯 ENHANCED ANALYTICS: Track profile view with rich metadata
          if (profile?.id) {
            try {
              await enhancedAnalyticsService.trackProfileView(profile.id, {
                profileUsername: currentUsername,
                profileName: profileData.displayName,
                linksCount: links?.length || 0,
                hasCustomTheme: !!profileData.theme,
                deviceInfo: {
                  connectionType: navigator.connection?.effectiveType || 'unknown',
                  onlineStatus: navigator.onLine
                },
                locationInfo: {
                  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                }
              });
            } catch (analyticsError) {
              console.error('Analytics tracking failed:', analyticsError);
            }
          }


        } else if (response.status === 404) {
          // Only redirect to 404 for actual "not found" responses
          navigate('/404', { replace: true });
          return;
        } else {
          // For other errors, show error state but don't redirect
          setError(`Server error: ${response.status} ${response.statusText}`);

        }
      } catch (networkError) {
        setError('Unable to connect to server. Please check your connection.');

      }
    }, [username]); // Only depend on username

    useEffect(() => {
      fetchUserProfile();
    }, [fetchUserProfile, refreshKey]);

    // Listen for theme updates from CustomizeTab
    useEffect(() => {
      const handleStorageChange = (e) => {
        if (e.key === 'theme_updated' && username) {
          console.log('🔄 [DEBUG] Theme update detected via localStorage, refreshing profile...');
          // Add a small delay to ensure backend has processed the update
          setTimeout(() => {
            fetchUserProfile();
          }, 500);
        }
      };

      // BroadcastChannel listener (better for same-origin)
      let channel;
      if (window.BroadcastChannel) {
        channel = new BroadcastChannel('theme_updates');
        channel.onmessage = (event) => {
          if (event.data.type === 'theme_updated' && username) {
            console.log('🔄 [DEBUG] Theme update detected via BroadcastChannel, refreshing profile...');
            // Add a small delay to ensure backend has processed the update
            setTimeout(() => {
              fetchUserProfile();
            }, 500);
          }
        };
      }

      window.addEventListener('storage', handleStorageChange);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        if (channel) {
          channel.close();
        }
      };
    }, [username, fetchUserProfile]);

  // Fetch analytics when profile is loaded
  useEffect(() => {
    if (profile?.id) {
      fetchAnalytics();
    }
  }, [profile?.id, fetchAnalytics]);

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  // Handle volume change
  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    // Update video volume if video exists
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100; // Convert to 0-1 range
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareMenu(false);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleLinkClick = async (link, position = 0) => {
    // 🎯 ENHANCED ANALYTICS: Track link click with context
    if (profile?.id && link?.id) {
      try {
        await enhancedAnalyticsService.trackLinkClick(link.id, profile.id, {
          title: link.title,
          url: link.url,
          position: position,
          coordinates: { x: 0, y: 0 } // Could be enhanced with actual click coordinates
        });
      } catch (analyticsError) {
        console.error('Link click analytics failed:', analyticsError);
      }
    }

    // Open link
    window.open(link.url, '_blank');
  };

  // Helper function to get enhanced typography styles
  const getTypographyStyles = () => {
    // Handle multiple possible data sources
    const theme = profile?.theme || profile?.theme_settings || {};

    // Handle both data structures:
    // 1. New structure: theme.typography.linkColor
    // 2. Legacy structure: theme.linkColor (direct)
    // 3. Profile direct properties: profile.fontFamily, profile.nameSize, etc.
    const typography = theme.typography || {};
    const customization = theme.customization || {};



    // Priority order: theme.typography > profile direct properties > defaults
    const linkColor = typography.linkColor || profile?.linkColor || theme.linkColor || customization.accentColor || '#3B82F6';

    const result = {
      // Font Family: theme.typography.fontFamily > profile.fontFamily > default
      fontFamily: typography.fontFamily || profile?.fontFamily || 'Inter, sans-serif',

      // Font Sizes: theme.typography > profile direct > defaults
      fontSize: typography.fontSize || (profile?.linkSize ? `${profile.linkSize}px` : '16px'),
      nameSize: typography.nameSize ? `${typography.nameSize}px` : (profile?.nameSize ? `${profile.nameSize}px` : '2.25rem'),
      bioSize: typography.bioSize ? `${typography.bioSize}px` : (profile?.bioSize ? `${profile.bioSize}px` : '1rem'),

      // Font Weights: theme.typography > profile direct > defaults
      fontWeight: typography.fontWeight || typography.linkWeight || profile?.linkWeight || '400',
      nameWeight: typography.nameWeight || profile?.nameWeight || 'bold',
      bioWeight: typography.bioWeight || profile?.bioWeight || 'normal',

      // Font Styles (italic): theme.typography > profile direct > defaults
      nameItalic: typography.nameItalic !== undefined ? typography.nameItalic : (profile?.nameItalic || false),
      bioItalic: typography.bioItalic !== undefined ? typography.bioItalic : (profile?.bioItalic || false),
      linkItalic: typography.linkItalic !== undefined ? typography.linkItalic : (profile?.linkItalic || false),

      // Colors: theme.typography > profile direct > defaults
      nameColor: typography.nameColor || typography.linkColor || typography.color || profile?.textColor || '#ffffff',
      bioColor: typography.bioColor || typography.color || profile?.bioColor || '#d1d5db',
      textColor: typography.linkColor || typography.color || profile?.textColor || '#ffffff',
      linkColor: linkColor,
      linkHoverColor: typography.linkHoverColor || linkColor || '#1D4ED8',

      // Layout settings
      linkStyle: customization.linkStyle || 'modern',
      spacing: customization.spacing || 'comfortable',
      borderRadius: customization.borderRadius || '12px',
      padding: customization.padding || '16px',
      maxWidth: customization.maxWidth || '400px'
    };

    return result;
  };

  // Helper function to get glassmorphism effects
  const getEffectStyles = () => {
    const theme = profile?.theme || {};
    const effects = theme.effects || {};

    return {
      glassmorphism: effects.glassmorphism !== false,
      blur: effects.blur || '12px',
      shadow: effects.shadow || 'xl',
      animations: effects.animations !== false
    };
  };

  // Preload background to prevent flashing
  const preloadBackground = (profile) => {
    return new Promise((resolve) => {
      const backgroundData = (() => {
        // Check theme.background first (from CustomizeTab)
        const themeBackground = profile?.theme?.background;
        if (themeBackground?.type && themeBackground?.value) {

          if (themeBackground.type === 'image') {
            const theme = profile?.theme || {};
            const overlay = theme.overlay || { enabled: true, color: 'rgba(0,0,0,0.4)', opacity: 0.6 };
            const overlayStyle = overlay.enabled
              ? `linear-gradient(${overlay.color}, ${overlay.color}), `
              : '';

            return {
              background: `${overlayStyle}url(${themeBackground.value})`,
              isImage: true,
              imageUrl: themeBackground.value,
              theme: theme
            };
          } else if (themeBackground.type === 'solid') {
            return {
              background: themeBackground.value,
              isImage: false
            };
          } else if (themeBackground.type === 'gradient') {
            return {
              background: themeBackground.value,
              isImage: false
            };
          } else if (themeBackground.type === 'video') {
            return {
              background: `url(${themeBackground.value})`, // Fallback poster
              isVideo: true,
              videoUrl: themeBackground.value,
              theme: profile?.theme || {}
            };
          }
        }

        // Legacy fallback code removed - now using theme_settings.background only

        // Default fallback
        return {
          background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', // Dark neutral
          isImage: false
        };
      })();

      // If it's an image background, preload the image
      if (backgroundData.isImage && backgroundData.imageUrl) {
        const img = new Image();
        img.onload = () => {
          setBackgroundStyle({
            background: backgroundData.background,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          });
          resolve();
        };
        img.onerror = () => {
          setBackgroundStyle({
            background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', // Dark neutral
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          });
          resolve();
        };
        img.src = backgroundData.imageUrl;
      } else {
        // For gradients and solid colors, no preloading needed
        setBackgroundStyle({
          background: backgroundData.background,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        });
        resolve();
      }
    });
  };







  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  // Remove loading screen to prevent flash effect
  if (!profile) {
    return null; // Return nothing while loading
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <div className="text-white text-2xl mb-4">Oops! Something went wrong</div>
          <div className="text-gray-300 text-lg mb-6">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Badge Notification System */}
      <BadgeNotificationSystem />

      {/* Background Layer */}
      {(() => {
        // Check theme background first (from CustomizeTab)
        const themeBackground = profile?.theme?.background;
        console.log('🎨 [DEBUG] ProfilePage rendering background:', {
          themeBackground,
          profileTheme: profile?.theme,
          profileId: profile?.id,
          isVideo: themeBackground?.type === 'video',
          hasVideoValue: !!themeBackground?.value,
          videoUrl: themeBackground?.value
        });

        if (themeBackground?.type === 'video' && themeBackground?.value) {
          console.log('🎥 [DEBUG] Rendering video background:', themeBackground.value);
          return (
            <MediaBackground
              background={{
                type: 'video',
                url: themeBackground.value,
                poster: null
              }}
              className="absolute inset-0 z-0"
              videoRef={videoRef}
            />
          );
        } else if (themeBackground?.type === 'image' && themeBackground?.value) {
          console.log('🖼️ [DEBUG] Rendering image background:', themeBackground.value);
          return (
            <MediaBackground
              background={{
                type: 'image',
                url: themeBackground.value,
                poster: null
              }}
              className="absolute inset-0 z-0"
            />
          );
        }

        // Handle gradient/solid backgrounds from theme_settings
        if (themeBackground?.type === 'gradient' && themeBackground?.value) {
          console.log('🌈 [DEBUG] Rendering gradient background:', themeBackground.value);
          return (
            <div
              className="absolute inset-0 z-0"
              style={{
                background: themeBackground.value,
                transition: 'background 0.3s ease-in-out, opacity 0.3s ease-in-out'
              }}
            />
          );
        } else if (themeBackground?.type === 'solid' && themeBackground?.value) {
          console.log('🎨 [DEBUG] Rendering solid background:', themeBackground.value);
          return (
            <div
              className="absolute inset-0 z-0"
              style={{
                background: themeBackground.value,
                transition: 'background 0.3s ease-in-out, opacity 0.3s ease-in-out'
              }}
            />
          );
        }

        // Default fallback background
        console.log('🔄 [DEBUG] Using default background, no theme background found');
        return (
          <div
            className="absolute inset-0 z-0"
            style={{
              background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
              transition: 'background 0.3s ease-in-out, opacity 0.3s ease-in-out'
            }}
          />
        );
      })()}

      {/* Background Effects */}
      <div className="absolute inset-0 z-1">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(rgba(29, 185, 84, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(29, 185, 84, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            animation: 'none'
          }}></div>
        </div>
        
        {/* Spotify green glows */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-green-500/15 to-purple-500/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-500/8 to-violet-500/8 rounded-full blur-3xl"></div>
      </div>

      {/* Top Controls */}
      <div className="absolute top-6 right-6 z-20">
        <div className="flex space-x-2">
          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRefresh}
            className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
            title="Refresh Profile"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </motion.button>

          {/* Volume Control Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowVolumeControl(!showVolumeControl)}
            className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
          >
            <SpeakerWaveIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          {/* Profile Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            {/* Avatar with decoration support */}
            <div className="relative mx-auto mb-6 flex justify-center">
              <div className="relative">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  src={profile.avatar || '/default-avatar.png'}
                  alt={profile.displayName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-2xl"
                />
                {/* Avatar Decoration Overlay */}
                {profile?.theme?.avatarDecoration && (
                  <div
                    className="absolute inset-0 w-32 h-32 rounded-full pointer-events-none"
                    style={{
                      backgroundImage: `url(${profile.theme.avatarDecoration})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      mixBlendMode: 'screen',
                      opacity: 0.8
                    }}
                  />
                )}
              </div>
            </div>

            {/* Username with copy button */}
            <div className="mb-2">
              {(() => {
                const typographyStyles = getTypographyStyles();

                return (
                  <h1
                    className="mb-1 tracking-tight relative inline-block"
                    style={{
                      fontSize: typographyStyles.nameSize || '2.25rem',
                      fontWeight: typographyStyles.nameWeight || 'bold',
                      color: typographyStyles.nameColor || '#ffffff',
                      fontFamily: typographyStyles.fontFamily || 'Inter, sans-serif',
                      fontStyle: typographyStyles.nameItalic ? 'italic' : 'normal'
                    }}
                  >
                    <span className="relative z-10">{profile.displayName}</span>
                    {/* Sparkle overlay */}
                    <div className="sparkle-overlay" />
                  </h1>
                );
              })()}
              <div className="flex items-center justify-center space-x-2">
                {profile.verified && (
                  <span className="text-blue-400 text-sm">✓ Verified</span>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCopyLink}
                  className="w-6 h-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all duration-300"
                >
                  <ClipboardDocumentIcon className="w-3 h-3" />
                </motion.button>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (() => {
              const typographyStyles = getTypographyStyles();

              return (
                <p
                  className="mb-4"
                  style={{
                    fontSize: typographyStyles.bioSize || '1rem',
                    fontWeight: typographyStyles.bioWeight || 'normal',
                    color: typographyStyles.bioColor || '#d1d5db',
                    fontFamily: typographyStyles.fontFamily || 'Inter, sans-serif',
                    fontStyle: typographyStyles.bioItalic ? 'italic' : 'normal'
                  }}
                >
                  {profile.bio}
                </p>
              );
            })()}
            
            {/* Total Views - Only show eye icon, views on hover */}
            {profile.settings?.showAnalytics && (
              <div className="flex items-center justify-center mb-4 group">
                <div className="relative">
                  <EyeIcon className="w-6 h-6 text-white cursor-pointer drop-shadow-lg" />
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {(() => {
                      const viewCount = analytics?.profileViews?.total ||
                                       analytics?.total_views ||
                                       profile.viewCount ||
                                       profile.total_views ||
                                       0;
                      return `${viewCount.toLocaleString()} views`;
                    })()}
                  </div>
                </div>
              </div>
            )}
            
            {/* Location */}
            {profile.location && (
              <div className="flex items-center justify-center space-x-1 mb-4 text-gray-400 text-sm">
                <span>📍</span>
                <span>{profile.location}</span>
              </div>
            )}

            {/* Badges Display - Hidden when no badges */}
            <div className="mb-6" style={{ display: 'none' }}>
              <BadgeDisplay username={profile.username} limit={3} />
            </div>
          </motion.div>



          {/* Links */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10 mt-6"
          >
            {links.map((link, index) => {
              // Check if this is an audio URL
              if (isAudioUrl(link.url)) {
                return (
                  <AudioLinkCard
                    key={link.id}
                    link={link}
                    index={index}
                    theme={profile?.theme}
                    showPreview={true}
                    onClick={handleLinkClick}
                  />
                );
              }

              // Regular link card with enhanced styling
              const typoStyles = getTypographyStyles();
              const effectStyles = getEffectStyles();

              return (
                <motion.button
                  key={link.id}
                  onClick={() => handleLinkClick(link, index)}
                  variants={itemVariants}
                  whileHover={{
                    scale: effectStyles.animations ? 1.02 : 1,
                    y: effectStyles.animations ? -2 : 0,
                    boxShadow: `0 0 30px ${typoStyles.linkColor}30`
                  }}
                  whileTap={{ scale: effectStyles.animations ? 0.98 : 1 }}
                  className={`profile-link block w-full backdrop-blur-xl border border-white/20 transition-all duration-300 group text-left relative overflow-hidden`}
                  style={{
                    // Use theme link background color (separate from text color)
                    backgroundColor: (() => {
                      const theme = profile?.theme || {};
                      const linkBgColor = theme.colors?.secondary || 'rgba(255, 255, 255, 0.1)'; // Default background
                      return linkBgColor;
                    })(),
                    padding: typoStyles.padding,
                    borderRadius: typoStyles.borderRadius,
                    fontFamily: typoStyles.fontFamily,
                    maxWidth: typoStyles.maxWidth,
                    margin: '0 auto 20px auto',
                    backdropFilter: effectStyles.glassmorphism ? `blur(${effectStyles.blur})` : 'none'
                  }}
                >
                  {/* Spotify-style glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="flex items-center space-x-3 relative z-10">
                    {/* Icon with Spotify-style glow */}
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 relative overflow-hidden">
                      <BrandIcon brand={link.icon} size={40} className="w-full h-full" />
                      </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div
                        className="font-medium transition-colors text-left"
                        style={{
                          color: typoStyles.textColor,
                          fontSize: typoStyles.fontSize,
                          fontWeight: typoStyles.fontWeight,
                          fontFamily: typoStyles.fontFamily,
                          fontStyle: typoStyles.linkItalic ? 'italic' : 'normal'
                        }}
                      >
                        {link.title}
                      </div>
                      {/* Description */}
                      {link.description && (
                        <div
                          className="text-sm mt-1 text-left opacity-80"
                          style={{
                            color: typoStyles.textColor,
                            fontFamily: typoStyles.fontFamily
                          }}
                        >
                          {link.description}
                        </div>
                      )}
                    </div>
                    
                    {/* Arrow with Spotify glow effect */}
                    <div className="relative">
                      <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-500 group-hover:text-green-400 transition-colors" />
                      <div className="absolute inset-0 bg-green-400 blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>



          {/* Footer - Only show if watermark is not hidden */}
          {(() => {
            const shouldHideWatermark = profile?.advancedSettings?.branding?.hideWatermark === true;

            return !shouldHideWatermark;
          })() && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-center mt-8"
            >
              <p className="text-gray-500 text-xs font-mono">
                Powered by <span className="text-green-400 font-semibold">LumiLink</span>
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Volume Control Modal */}
      {showVolumeControl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          className="fixed top-24 right-6 bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl p-4 z-50 shadow-2xl min-w-[200px]"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm">Volume</h3>
              <button
                onClick={() => setShowVolumeControl(false)}
                className="text-white/60 hover:text-white transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-xs">🔊</span>
                <span className="text-white text-xs">{volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Custom CSS for sliders */}
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .slider::-webkit-slider-track {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
        }

        .slider::-moz-range-track {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
        }
      `}</style>

    </div>
  );
};

// Add CSS for sparkle effect and enhanced hover effects
const profilePageStyles = `
  /* Sparkle effect for profile name */
  .sparkle-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('https://assets.guns.lol/sparkle_white.gif');
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    mix-blend-mode: screen;
    pointer-events: none;
    z-index: 20;
    opacity: 0.85;
    animation: sparkle-stretch 4s ease-in-out infinite;
  }

  @keyframes sparkle-stretch {
    0%, 100% {
      transform: scale(1);
      opacity: 0.85;
    }
    25% {
      transform: scaleX(1.02) scaleY(0.98);
      opacity: 0.9;
    }
    50% {
      transform: scale(1.01);
      opacity: 1;
    }
    75% {
      transform: scaleX(0.98) scaleY(1.02);
      opacity: 0.9;
    }
  }

  /* Enhanced link hover effects */
  .profile-link {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .profile-link:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .profile-link:active {
    transform: translateY(-2px) scale(1.01);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = profilePageStyles;
  document.head.appendChild(styleElement);
}

export default ProfilePage;
