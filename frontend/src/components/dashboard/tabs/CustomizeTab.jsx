import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PaintBrushIcon,
  PhotoIcon,
  SwatchIcon,
  EyeIcon,
  CheckIcon,
  StarIcon,
  FilmIcon,

  EyeSlashIcon,
  CloudArrowUpIcon,
  SparklesIcon,
  LockClosedIcon,
  UserCircleIcon,


} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Reusable UI Components
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import VideoBackground from '../../ui/VideoBackground';
import Avatar from '../../ui/Avatar';


// API Services
import premiumApi from '../../../services/premiumApi';
import profileApi from '../../../services/profileApi';

const CustomizeTab = ({ refreshData, user, profile }) => {
  const [activeSection, setActiveSection] = useState('background');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedPremiumFeature, setSelectedPremiumFeature] = useState(null);

  const isPremium = user?.plan === 'Premium';
  const [saving, setSaving] = useState(false);
  const [changedFields, setChangedFields] = useState(new Set());

  // Avatar decoration states
  const [selectedDecoration, setSelectedDecoration] = useState(null);
  const [decorations, setDecorations] = useState([]);


  // Watermark setting
  const [hideWatermark, setHideWatermark] = useState(profile?.hideWatermark || false);

  // Load decorations from public folder
  useEffect(() => {
    const loadDecorations = () => {
      const decorationList = [
        'a_duck.png',
        'angel.png',
        'angry.png',
        'arcane_sigil.png',
        'astronaut_helmet.png',
        'aurora.png',
        'autumn_crown.png',
        'baby_displacer_beast.png',
        'balance.png',
        'ballerina.png',
        'batarang.png',
        'beach_hat.png',
        'berry_bunny.png',
        'black_hole.png',
        'blade_storm.png',
        'bloodthirsty.png',
        'blue_gyroscope.png',
        'blue_hyper_helmet.png',
        'blue_mana.png',
        'blueberry_jam.png',
        'cat_ears.png',
        'cat_ears_blue.png',
        'cat_ears_green.png',
        'cat_ears_purple.png',
        'cat_ears_yellow.png',
        'crystal_ball_blue.png',
        'crystal_ball_purple.png',
        'cyber_katana.png',
        'devil.png',
        'dragon_balls.png',
        'fire.png',
        'fox_hat.png',
        'golden_hex.png',
        'heart_to_heart.png',
        'ice_cube.png',
        'kitsune.png',
        'lightning.png',
        'magic_portal_blue.png',
        'magic_portal_purple.png',
        'phoenix.png',
        'sakura.png',
        'skull_medallion.png',
        'snowglobe.png',
        'unicorn.png',
        'wizard_hat_blue.png',
        'wizard_hat_purple.png'
      ];

      const decorationObjects = decorationList.map((filename, index) => ({
        id: index + 1,
        name: filename.replace('.png', '').replace(/_/g, ' '),
        filename,
        path: `/decorations/${filename}`,
        category: 'misc'
      }));

      setDecorations(decorationObjects);
    };

    loadDecorations();
  }, []);

  // Load theme from profile or use defaults - ALL FROM theme_settings
  const [customization, setCustomization] = useState({
    // Background settings - READ FROM theme_settings.background
    backgroundType: profile?.theme_settings?.background?.type || 'gradient',
    backgroundGradient: (() => {
      const bg = profile?.theme_settings?.background;
      return bg?.type === 'gradient' ? bg.value : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    })(),
    backgroundColor: (() => {
      const bg = profile?.theme_settings?.background;
      return bg?.type === 'solid' ? bg.value : (profile?.theme_settings?.colors?.primary || '#1F2937');
    })(),
    backgroundImage: (() => {
      const bg = profile?.theme_settings?.background;
      return bg?.type === 'image' ? bg.value : null;
    })(),
    backgroundVideo: (() => {
      const bg = profile?.theme_settings?.background;
      return bg?.type === 'video' ? bg.value : null;
    })(),
    backgroundValue: (() => {
      const bg = profile?.theme_settings?.background;
      return (bg?.type === 'image' || bg?.type === 'video') ? bg.value : null;
    })(),

    // Link background settings
    linkBackgroundType: 'solid',
    linkBackgroundColor: profile?.theme_settings?.colors?.secondary || '#374151',
    linkBackgroundGradient: 'linear-gradient(135deg, #374151 0%, #4B5563 100%)',

    // Text colors
    usernameColor: '#FFFFFF',
    bioColor: '#D1D5DB',
    linkTextColor: '#FFFFFF',

    // Typography
    fontFamily: profile?.theme_settings?.typography?.fontFamily || 'Inter',
    nameSize: 24,
    bioSize: 16,
    linkSize: 16,

    hasUnsavedChanges: false
  });



  // Load theme from profile when component mounts
  useEffect(() => {
    if (profile?.theme_settings) {
      const theme = profile.theme_settings;
      console.log('🔄 [DEBUG] Loading theme from profile.theme_settings:', theme);

      setCustomization(prev => ({
        ...prev,
        // Background settings - READ FROM theme_settings.background
        backgroundType: theme.background?.type || 'gradient',
        backgroundGradient: theme.background?.type === 'gradient' ? theme.background.value : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundColor: theme.background?.type === 'solid' ? theme.background.value : theme.colors?.primary || '#1F2937',
        backgroundValue: (theme.background?.type === 'image' || theme.background?.type === 'video') ? theme.background.value : null,
        backgroundImage: theme.background?.type === 'image' ? theme.background.value : null,
        backgroundVideo: theme.background?.type === 'video' ? theme.background.value : null,

        // Colors
        linkBackgroundColor: theme.colors?.secondary || '#374151',
        linkTextColor: theme.colors?.accent || '#FFFFFF',

        // Typography
        fontFamily: theme.typography?.fontFamily || 'Inter',
        nameSize: theme.typography?.nameSize || 24,
        bioSize: theme.typography?.bioSize || 16,
        linkSize: theme.typography?.linkSize || 16,

        hasUnsavedChanges: false
      }));

      console.log('✅ [DEBUG] Theme loaded from theme_settings.background:', {
        type: theme.background?.type,
        value: theme.background?.value
      });

      // Reset change tracking when loading from profile
      setChangedFields(new Set());
    }
  }, [profile]);

  // Update customization and track changes
  const updateCustomization = (updates) => {
    // Clear conflicting fields when switching background types
    const cleanedUpdates = { ...updates };

    if (updates.backgroundType) {
      console.log('🔄 [DEBUG] Switching background type to:', updates.backgroundType);

      // When switching background type, clear ALL conflicting fields
      if (updates.backgroundType === 'image') {
        // Clear video-specific fields and backgroundValue if not setting new image
        if (!updates.backgroundValue) {
          cleanedUpdates.backgroundValue = null;
        }
        cleanedUpdates.backgroundVideo = null;
        console.log('🧹 [DEBUG] Cleared video fields for image');
      } else if (updates.backgroundType === 'video') {
        // Clear image-specific fields and backgroundValue if not setting new video
        if (!updates.backgroundValue) {
          cleanedUpdates.backgroundValue = null;
        }
        cleanedUpdates.backgroundImage = null;
        console.log('🧹 [DEBUG] Cleared image fields for video');
      } else if (updates.backgroundType === 'gradient' || updates.backgroundType === 'solid') {
        // Clear ALL upload-related fields when switching to gradient/solid
        cleanedUpdates.backgroundImage = null;
        cleanedUpdates.backgroundVideo = null;
        cleanedUpdates.backgroundValue = null;
        console.log('🧹 [DEBUG] Cleared all upload fields for gradient/solid');
      }
    }

    setCustomization(prev => ({
      ...prev,
      ...cleanedUpdates,
      hasUnsavedChanges: true
    }));

    // Track which fields have changed
    setChangedFields(prev => {
      const newSet = new Set(prev);
      Object.keys(cleanedUpdates).forEach(key => {
        if (key !== 'hasUnsavedChanges') {
          newSet.add(key);
        }
      });
      return newSet;
    });
  };

  // Save theme to backend (only changed fields)
  const saveTheme = async () => {
    if (!user?.id) {
      toast.error('Không thể lưu: Thiếu thông tin user');
      return;
    }

    if (changedFields.size === 0) {
      toast('Không có thay đổi nào để lưu', {
        icon: 'ℹ️',
        style: {
          background: '#3B82F6',
          color: 'white',
        },
      });
      return;
    }

    try {
      setSaving(true);
      console.log('🔍 [DEBUG] Saving theme with changed fields:', Array.from(changedFields));

      // Build theme data with only changed fields - send direct theme properties
      const themeData = {};

      // Background changes - send directly as background property (not nested in theme_settings)
      if (changedFields.has('backgroundType') || changedFields.has('backgroundGradient') || changedFields.has('backgroundColor') || changedFields.has('backgroundValue')) {
        console.log('🎨 [DEBUG] Processing background changes:', {
          type: customization.backgroundType,
          value: customization.backgroundValue,
          gradient: customization.backgroundGradient,
          color: customization.backgroundColor
        });

        themeData.background = {
          type: customization.backgroundType,
          value: (() => {
            // Priority: video > image > gradient > solid color
            if (customization.backgroundType === 'video' && customization.backgroundValue) {
              console.log('🎥 [DEBUG] Using video:', customization.backgroundValue);
              return customization.backgroundValue;
            } else if (customization.backgroundType === 'image' && customization.backgroundValue) {
              console.log('🖼️ [DEBUG] Using image:', customization.backgroundValue);
              return customization.backgroundValue;
            } else if (customization.backgroundType === 'gradient') {
              console.log('🌈 [DEBUG] Using gradient:', customization.backgroundGradient);
              return customization.backgroundGradient;
            } else if (customization.backgroundType === 'solid') {
              console.log('🎨 [DEBUG] Using solid color:', customization.backgroundColor);
              return customization.backgroundColor;
            } else {
              // Fallback based on backgroundValue if exists
              if (customization.backgroundValue) {
                console.log('📁 [DEBUG] Using fallback uploaded file:', customization.backgroundValue);
                return customization.backgroundValue;
              } else {
                console.log('🌈 [DEBUG] Using fallback gradient:', customization.backgroundGradient);
                return customization.backgroundGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
              }
            }
          })()
        };

        console.log('💾 [DEBUG] Final background:', themeData.background);
      }

      // Color changes (background colors only)
      const colorChanges = {};
      if (changedFields.has('backgroundColor')) {
        colorChanges.primary = customization.backgroundColor;
      }
      if (changedFields.has('linkBackgroundColor')) {
        colorChanges.secondary = customization.linkBackgroundColor;
      }
      // Note: linkTextColor is handled in typography section, not here
      if (Object.keys(colorChanges).length > 0) {
        themeData.colors = colorChanges;
      }

      // Typography changes
      const typographyChanges = {};
      if (changedFields.has('fontFamily')) {
        typographyChanges.fontFamily = customization.fontFamily;
      }
      if (changedFields.has('nameSize')) {
        typographyChanges.nameSize = customization.nameSize;
      }
      if (changedFields.has('bioSize')) {
        typographyChanges.bioSize = customization.bioSize;
      }
      if (changedFields.has('linkSize')) {
        typographyChanges.linkSize = customization.linkSize;
      }
      // Text colors
      if (changedFields.has('usernameColor')) {
        typographyChanges.nameColor = customization.usernameColor;
      }
      if (changedFields.has('bioColor')) {
        typographyChanges.bioColor = customization.bioColor;
      }
      if (changedFields.has('linkTextColor')) {
        typographyChanges.linkColor = customization.linkTextColor;
      }
      if (Object.keys(typographyChanges).length > 0) {
        themeData.typography = typographyChanges;
      }



      console.log('📡 [DEBUG] Sending theme data to API:', themeData);
      console.log('🔗 [DEBUG] API call: profileApi.updateTheme(', user.id, ', themeData)');
      const result = await profileApi.updateTheme(user.id, themeData);
      console.log('📨 [DEBUG] API response:', result);

      // Reset change tracking
      setCustomization(prev => ({ ...prev, hasUnsavedChanges: false }));
      setChangedFields(new Set());

      console.log('✅ [DEBUG] Theme saved successfully');

      // Broadcast theme update to ProfilePage
      if (window.BroadcastChannel) {
        const channel = new BroadcastChannel('theme_updates');
        channel.postMessage({ type: 'theme_updated', userId: user.id });
        channel.close();
      }

      // Also use localStorage as fallback
      localStorage.setItem('theme_updated', Date.now().toString());

      toast.success('Đã lưu theme thành công!');

      // Notify ProfilePage to reload (if open in another tab)
      if (typeof window !== 'undefined') {
        // Method 1: localStorage
        window.localStorage.setItem('theme_updated', Date.now().toString());
        setTimeout(() => window.localStorage.removeItem('theme_updated'), 100);

        // Method 2: BroadcastChannel (better for same-origin)
        if (window.BroadcastChannel) {
          const channel = new BroadcastChannel('theme_updates');
          channel.postMessage({ type: 'theme_updated', timestamp: Date.now() });
          channel.close();
        }
      }
    } catch (error) {
      console.error('❌ [DEBUG] Theme save failed:', error);
      console.error('❌ [DEBUG] Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.message || 'Không thể lưu theme');
    } finally {
      setSaving(false);
    }
  };





  const sections = [
    { id: 'background', name: 'Nền Profile', icon: PhotoIcon },
    { id: 'link-background', name: 'Nền Link', icon: SwatchIcon },
    { id: 'colors', name: 'Màu Chữ', icon: PaintBrushIcon },
    { id: 'typography', name: 'Typography', icon: PaintBrushIcon },
    { id: 'premium', name: 'Premium', icon: SparklesIcon, premium: true }
  ];

  // Premium features data
  const premiumFeatures = [
    {
      id: 'avatar-decoration',
      title: 'Avatar Decoration',
      description: 'Trang trí avatar với ring effects và decorations độc đáo',
      icon: UserCircleIcon,
      color: 'purple',
      demo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=200&fit=crop&crop=center',
      enabled: true,
      canSave: isPremium
    },
    {
      id: 'animated-background',
      title: 'Hình Ảnh + GIF Background',
      description: 'Upload hình ảnh tĩnh hoặc GIF động',
      icon: PhotoIcon,
      color: 'purple',
      demo: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=300&h=200&fit=crop&crop=center',
      enabled: true,
      canSave: isPremium
    },
    {
      id: 'video-background',
      title: 'Video Background',
      description: 'URL Cloudinary hoặc upload video',
      icon: FilmIcon,
      color: 'blue',
      demo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=200&fit=crop&crop=center',
      enabled: true,
      canSave: isPremium
    },
    {
      id: 'hide-watermark',
      title: 'Ẩn Watermark',
      description: 'Loại bỏ watermark LumiLink',
      icon: EyeSlashIcon,
      color: 'green',
      demo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=150&fit=crop&crop=center',
      enabled: true,
      canSave: isPremium
    }
  ];

  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  ];

  const colors = [
    '#1F2937', '#374151', '#4B5563', '#6B7280',
    '#EF4444', '#F97316', '#F59E0B', '#EAB308',
    '#84CC16', '#22C55E', '#10B981', '#14B8A6',
    '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
    '#8B5CF6', '#A855F7', '#C026D3', '#DB2777'
  ];

  const fonts = [
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif' },
    { name: 'Lato', value: 'Lato, sans-serif' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif' },
    { name: 'Poppins', value: 'Poppins, sans-serif' }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">Tùy Chỉnh Giao Diện</h2>
          <p className="text-gray-400 text-sm sm:text-base">Cá nhân hóa profile của bạn với các tùy chọn thiết kế</p>
        </div>

        {customization.hasUnsavedChanges && (
          <div className="flex space-x-2 sm:space-x-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => {
                setCustomization(prev => ({ ...prev, hasUnsavedChanges: false }));
                setChangedFields(new Set());
              }}
              className="flex-1 sm:flex-none text-sm"
            >
              Đặt Lại
            </Button>
            <Button
              onClick={saveTheme}
              disabled={saving}
              className={`flex-1 sm:flex-none text-sm ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {saving ? 'Đang Lưu...' : 'Lưu Thay Đổi'}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Customization Options */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Section Tabs */}
          <div className="flex flex-wrap sm:flex-nowrap gap-1 bg-gray-800 rounded-lg p-1 border border-gray-700 overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-md transition-all relative flex-shrink-0 ${
                  activeSection === section.id
                    ? section.premium
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <section.icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{section.name}</span>

                {/* Premium Badge */}
                {section.premium && (
                  <div className="absolute -top-1 -right-1">
                    <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                      <StarIcon className="w-2 h-2 text-white" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Background Section */}
          {activeSection === 'background' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <h3 className="text-lg font-semibold text-white mb-6">Nền Profile</h3>
              
              {/* Background Type */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-3">Loại Nền</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'gradient', name: 'Gradient', icon: '🌈' },
                    { id: 'solid', name: 'Màu Đơn', icon: '🎨' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => updateCustomization({ backgroundType: type.id })}
                      className={`p-4 rounded-lg border transition-all ${
                        customization.backgroundType === type.id
                          ? 'border-purple-500 bg-purple-600/20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <div className="text-white font-medium">{type.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gradient Options */}
              {customization.backgroundType === 'gradient' && (
                <div className="mb-6">
                  <label className="block text-gray-300 text-sm font-medium mb-3">Gradient</label>
                  <div className="grid grid-cols-4 gap-3">
                    {gradients.map((gradient, index) => (
                      <button
                        key={index}
                        onClick={() => updateCustomization({ backgroundGradient: gradient })}
                        className={`relative w-full h-12 rounded-lg border-2 transition-all ${
                          customization.backgroundGradient === gradient
                            ? 'border-white shadow-lg'
                            : 'border-gray-600 hover:border-gray-400'
                        }`}
                        style={{ background: gradient }}
                      >
                        {customization.backgroundGradient === gradient && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckIcon className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Solid Color Options */}
              {customization.backgroundType === 'solid' && (
                <div className="mb-6">
                  <label className="block text-gray-300 text-sm font-medium mb-3">Màu Nền</label>
                  <div className="grid grid-cols-10 gap-2">
                    {colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => updateCustomization({ backgroundColor: color })}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          customization.backgroundColor === color
                            ? 'border-white shadow-lg'
                            : 'border-gray-600 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        {customization.backgroundColor === color && (
                          <CheckIcon className="w-4 h-4 text-white mx-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}


            </motion.div>
          )}

          {/* Link Background Section */}
          {activeSection === 'link-background' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <h3 className="text-lg font-semibold text-white mb-6">Nền Link</h3>

              {/* Link Background Type */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-3">Loại Nền Link</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'solid', name: 'Màu Đơn', icon: '🎨' },
                    { id: 'gradient', name: 'Gradient', icon: '🌈' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => updateCustomization({ linkBackgroundType: type.id })}
                      className={`p-4 rounded-lg border transition-all ${
                        customization.linkBackgroundType === type.id
                          ? 'border-purple-500 bg-purple-600/20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <div className="text-white font-medium">{type.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Link Solid Color */}
              {customization.linkBackgroundType === 'solid' && (
                <div className="mb-6">
                  <label className="block text-gray-300 text-sm font-medium mb-3">Màu Nền Link</label>
                  <div className="grid grid-cols-8 gap-2">
                    {[
                      '#374151', '#4B5563', '#6B7280', '#9CA3AF',
                      '#1F2937', '#111827', '#0F172A', '#1E293B',
                      '#7C3AED', '#8B5CF6', '#A855F7', '#C084FC',
                      '#DC2626', '#EF4444', '#F87171', '#FCA5A5',
                      '#059669', '#10B981', '#34D399', '#6EE7B7',
                      '#D97706', '#F59E0B', '#FBBF24', '#FCD34D'
                    ].map((color, index) => (
                      <button
                        key={index}
                        onClick={() => updateCustomization({ linkBackgroundColor: color })}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          customization.linkBackgroundColor === color
                            ? 'border-white shadow-lg'
                            : 'border-gray-600 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        {customization.linkBackgroundColor === color && (
                          <CheckIcon className="w-4 h-4 text-white mx-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Link Gradient */}
              {customization.linkBackgroundType === 'gradient' && (
                <div className="mb-6">
                  <label className="block text-gray-300 text-sm font-medium mb-3">Gradient Nền Link</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      'linear-gradient(135deg, #374151 0%, #4B5563 100%)',
                      'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
                      'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
                      'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                      'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
                      'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)'
                    ].map((gradient, index) => (
                      <button
                        key={index}
                        onClick={() => updateCustomization({ linkBackgroundGradient: gradient })}
                        className={`h-12 rounded-lg border-2 transition-all ${
                          customization.linkBackgroundGradient === gradient
                            ? 'border-white shadow-lg'
                            : 'border-gray-600 hover:border-gray-400'
                        }`}
                        style={{ background: gradient }}
                      >
                        {customization.linkBackgroundGradient === gradient && (
                          <CheckIcon className="w-6 h-6 text-white mx-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Colors Section */}
          {activeSection === 'colors' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <h3 className="text-lg font-semibold text-white mb-6">Màu Chữ</h3>

              {/* Username Color */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-3">Màu Chữ Username</label>
                <div className="grid grid-cols-10 gap-2 mb-3">
                  {colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => updateCustomization({ usernameColor: color })}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        customization.usernameColor === color
                          ? 'border-white shadow-lg'
                          : 'border-gray-600 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {customization.usernameColor === color && (
                        <CheckIcon className="w-4 h-4 text-white mx-auto" />
                      )}
                    </button>
                  ))}
                </div>
                {/* Custom Color Picker */}
                <div className="flex items-center space-x-3">
                  <label className="text-gray-400 text-sm">Màu tùy chỉnh:</label>
                  <input
                    type="color"
                    value={customization.usernameColor}
                    onChange={(e) => updateCustomization({ usernameColor: e.target.value })}
                    className="w-10 h-8 rounded border border-gray-600 bg-transparent cursor-pointer"
                  />
                  <span className="text-gray-400 text-sm font-mono">{customization.usernameColor}</span>
                </div>
              </div>

              {/* Bio Color */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-3">Màu Chữ Bio</label>
                <div className="grid grid-cols-10 gap-2 mb-3">
                  {colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => updateCustomization({ bioColor: color })}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        customization.bioColor === color
                          ? 'border-white shadow-lg'
                          : 'border-gray-600 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {customization.bioColor === color && (
                        <CheckIcon className="w-4 h-4 text-white mx-auto" />
                      )}
                    </button>
                  ))}
                </div>
                {/* Custom Color Picker */}
                <div className="flex items-center space-x-3">
                  <label className="text-gray-400 text-sm">Màu tùy chỉnh:</label>
                  <input
                    type="color"
                    value={customization.bioColor}
                    onChange={(e) => updateCustomization({ bioColor: e.target.value })}
                    className="w-10 h-8 rounded border border-gray-600 bg-transparent cursor-pointer"
                  />
                  <span className="text-gray-400 text-sm font-mono">{customization.bioColor}</span>
                </div>
              </div>

              {/* Link Text Color */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-3">Màu Chữ Link</label>
                <div className="grid grid-cols-10 gap-2 mb-3">
                  {colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => updateCustomization({ linkTextColor: color })}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        customization.linkTextColor === color
                          ? 'border-white shadow-lg'
                          : 'border-gray-600 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {customization.linkTextColor === color && (
                        <CheckIcon className="w-4 h-4 text-white mx-auto" />
                      )}
                    </button>
                  ))}
                </div>
                {/* Custom Color Picker */}
                <div className="flex items-center space-x-3">
                  <label className="text-gray-400 text-sm">Màu tùy chỉnh:</label>
                  <input
                    type="color"
                    value={customization.linkTextColor}
                    onChange={(e) => updateCustomization({ linkTextColor: e.target.value })}
                    className="w-10 h-8 rounded border border-gray-600 bg-transparent cursor-pointer"
                  />
                  <span className="text-gray-400 text-sm font-mono">{customization.linkTextColor}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Typography Section */}
          {activeSection === 'typography' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <h3 className="text-lg font-semibold text-white mb-6">Typography</h3>
              
              {/* Font Family */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-3">Font</label>
                <div className="grid grid-cols-2 gap-3">
                  {fonts.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => updateCustomization({ fontFamily: font.value })}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        customization.fontFamily === font.value
                          ? 'border-purple-500 bg-purple-600/20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      style={{ fontFamily: font.value }}
                    >
                      <div className="text-white font-medium">{font.name}</div>
                      <div className="text-gray-400 text-sm">Aa Bb Cc</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Sizes */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Kích Thước Tên: {customization.nameSize}px
                  </label>
                  <input
                    type="range"
                    min="16"
                    max="48"
                    value={customization.nameSize}
                    onChange={(e) => updateCustomization({ nameSize: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Kích Thước Bio: {customization.bioSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={customization.bioSize}
                    onChange={(e) => updateCustomization({ bioSize: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Kích Thước Liên Kết: {customization.linkSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="20"
                    value={customization.linkSize}
                    onChange={(e) => updateCustomization({ linkSize: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Premium Section */}
          {activeSection === 'premium' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Premium Header - Redesigned */}
              <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-pink-900/40 rounded-2xl border border-purple-500/20 backdrop-blur-sm">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                </div>

                <div className="relative p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="relative">
                        <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                          <SparklesIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                          <StarIcon className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-yellow-900" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                          Tính Năng Premium
                        </h3>
                        <p className="text-purple-200/80 text-xs sm:text-sm mt-1">
                          Mở khóa sức mạnh tùy chỉnh không giới hạn
                        </p>
                      </div>
                    </div>

                    {isPremium && (
                      <div className="flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500/20 text-green-300 rounded-full border border-green-400/30 backdrop-blur-sm self-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs sm:text-sm font-semibold">Premium Active</span>
                      </div>
                    )}
                  </div>

                  {!isPremium && (
                    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-400/30 rounded-xl p-4 sm:p-5 backdrop-blur-sm">
                      <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-3">
                        <div className="p-2 bg-amber-500/20 rounded-lg self-start">
                          <LockClosedIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-amber-300 mb-2 text-sm sm:text-base">Nâng cấp để mở khóa</h4>
                          <p className="text-amber-200/80 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                            Trải nghiệm toàn bộ sức mạnh của LumiLink với video background,
                            hình ảnh tùy chỉnh và loại bỏ watermark
                          </p>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                          >
                            <SparklesIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            <span className="text-xs sm:text-sm">Nâng Cấp Premium</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Premium Features List - New Design */}
              <div className="space-y-4">
                {premiumFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl border border-gray-700/50 overflow-hidden backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300"
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
                        {/* Feature Info */}
                        <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                          <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br flex-shrink-0 ${
                            feature.color === 'purple' ? 'from-purple-500/20 to-purple-600/20 border border-purple-500/20' :
                            feature.color === 'blue' ? 'from-blue-500/20 to-blue-600/20 border border-blue-500/20' :
                            'from-green-500/20 to-green-600/20 border border-green-500/20'
                          }`}>
                            <feature.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${feature.color}-400`} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white">{feature.title}</h3>
                              <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1.5 self-start ${
                                feature.canSave
                                  ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                              }`}>
                                <StarIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                <span className="whitespace-nowrap">{feature.canSave ? 'Premium Active' : 'Cần Premium'}</span>
                              </div>
                            </div>
                            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">{feature.description}</p>

                            {/* Feature Benefits */}
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                              {feature.id === 'avatar-decoration' && (
                                <>
                                  <span className="px-2 py-1 bg-purple-500/10 text-purple-300 rounded-md text-xs">Ring Effects</span>
                                  <span className="px-2 py-1 bg-purple-500/10 text-purple-300 rounded-md text-xs">47+ Decorations</span>
                                  <span className="px-2 py-1 bg-purple-500/10 text-purple-300 rounded-md text-xs">Real-time Preview</span>
                                </>
                              )}
                              {feature.id === 'animated-background' && (
                                <>
                                  <span className="px-2 py-1 bg-purple-500/10 text-purple-300 rounded-md text-xs">GIF Support</span>
                                  <span className="px-2 py-1 bg-purple-500/10 text-purple-300 rounded-md text-xs">Auto Loop</span>
                                  <span className="px-2 py-1 bg-purple-500/10 text-purple-300 rounded-md text-xs">Optimized</span>
                                </>
                              )}
                              {feature.id === 'video-background' && (
                                <>
                                  <span className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded-md text-xs">MP4 Support</span>
                                  <span className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded-md text-xs">Cloudinary</span>
                                  <span className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded-md text-xs">Auto Play</span>
                                </>
                              )}
                              {feature.id === 'hide-watermark' && (
                                <>
                                  <span className="px-2 py-1 bg-green-500/10 text-green-300 rounded-md text-xs">Clean Look</span>
                                  <span className="px-2 py-1 bg-green-500/10 text-green-300 rounded-md text-xs">Professional</span>
                                  <span className="px-2 py-1 bg-green-500/10 text-green-300 rounded-md text-xs">White Label</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Feature Actions */}
                        <div className="flex flex-col space-y-2 sm:ml-4 w-full sm:w-auto">
                          {feature.id === 'hide-watermark' ? (
                            // Toggle switch for Hide Watermark
                            feature.canSave ? (
                              <div className="flex items-center justify-between sm:justify-end">
                                <span className="text-sm text-gray-300 sm:hidden">Ẩn Watermark</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={hideWatermark}
                                    onChange={async (e) => {
                                      const newValue = e.target.checked;
                                      setHideWatermark(newValue);
                                      try {
                                        await premiumApi.updateProfile({
                                          settings: { hideWatermark: newValue }
                                        });
                                        toast.success(newValue ? 'Đã ẩn watermark!' : 'Đã hiển thị watermark!');
                                      } catch (error) {
                                        console.error('Error updating watermark:', error);
                                        setHideWatermark(!newValue); // Revert on error
                                        toast.error('Không thể cập nhật cài đặt!');
                                      }
                                    }}
                                    className="sr-only"
                                  />
                                  <div className={`relative w-10 h-6 sm:w-11 sm:h-6 rounded-full transition-colors duration-300 ease-in-out ${hideWatermark ? 'bg-green-500' : 'bg-gray-600'}`}>
                                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${hideWatermark ? 'translate-x-4 sm:translate-x-5' : 'translate-x-0'}`}></div>
                                  </div>
                                </label>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-all duration-300 w-full sm:w-auto"
                                onClick={() => {
                                  toast.error('Cần nâng cấp Premium để sử dụng tính năng này');
                                }}
                              >
                                <LockClosedIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                <span className="text-xs sm:text-sm">Nâng Cấp</span>
                              </Button>
                            )
                          ) : (
                            // Regular button for other features
                            feature.canSave ? (
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 w-full sm:w-auto"
                                onClick={() => {
                                  setSelectedPremiumFeature(feature);
                                  setShowPremiumModal(true);
                                }}
                              >
                                <feature.icon className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                <span className="text-xs sm:text-sm">Cài Đặt</span>
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-all duration-300 w-full sm:w-auto"
                                onClick={() => {
                                  toast.error('Cần nâng cấp Premium để sử dụng tính năng này');
                                }}
                              >
                                <LockClosedIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                <span className="text-xs sm:text-sm">Nâng Cấp</span>
                              </Button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </div>

        {/* Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <EyeIcon className="w-5 h-5 mr-2" />
              Xem Trước
            </h3>
            
            <div
              className="bg-white rounded-xl overflow-hidden relative min-h-[400px] border border-gray-600"
              style={{
                background: customization.backgroundType === 'gradient'
                  ? customization.backgroundGradient
                  : customization.backgroundColor
              }}
            >
              {/* Video Background */}
              {customization.backgroundType === 'video' && customization.backgroundValue && (
                <VideoBackground
                  src={customization.backgroundValue}
                  className="absolute inset-0 w-full h-full"
                  quality="medium"
                  enableCanvas={true}
                  fallbackImage={null}
                  onLoad={() => {}}
                  onError={(error) => console.error('Video error:', error)}
                />
              )}

              {/* Image Background */}
              {customization.backgroundType === 'image' && customization.backgroundValue && (
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${customization.backgroundValue})` }}
                />
              )}
              <div className="relative z-10 p-6 text-center">
                {/* Avatar */}
                <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                
                {/* Name */}
                <h2
                  className="mb-2 font-bold"
                  style={{
                    fontSize: `${customization.nameSize}px`,
                    fontFamily: customization.fontFamily,
                    color: customization.usernameColor
                  }}
                >
                  @{user?.username || 'username'}
                </h2>

                {/* Bio */}
                <p
                  className="mb-6"
                  style={{
                    fontSize: `${customization.bioSize}px`,
                    fontFamily: customization.fontFamily,
                    color: customization.bioColor
                  }}
                >
                  {user?.bio || 'Your bio goes here ✨'}
                </p>

                {/* Sample Links */}
                <div className="space-y-3">
                  {['Website', 'Social Media', 'Portfolio'].map((link, index) => (
                    <div
                      key={index}
                      className="w-full p-3 rounded-lg text-center font-medium"
                      style={{
                        fontSize: `${customization.linkSize}px`,
                        fontFamily: customization.fontFamily,
                        color: customization.linkTextColor,
                        background: customization.linkBackgroundType === 'gradient'
                          ? customization.linkBackgroundGradient
                          : customization.linkBackgroundColor
                      }}
                    >
                      {link}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Feature Modal */}
      {selectedPremiumFeature && (
        <Modal
          isOpen={showPremiumModal}
          onClose={() => {
            setShowPremiumModal(false);
            setSelectedPremiumFeature(null);
          }}
          title={`${selectedPremiumFeature.title} Settings`}
        >
          <div className="space-y-6">
            {/* Feature Description */}
            <div>
              <h4 className="text-white font-semibold mb-2">{selectedPremiumFeature.title}</h4>
              <p className="text-gray-400 text-sm">{selectedPremiumFeature.description}</p>
            </div>

            {/* Upload Section */}
            {selectedPremiumFeature.id === 'video-background' && (
              <div className="space-y-6">
                {/* Header with PRO Badge */}
                <div className="flex items-center space-x-3">
                  <h4 className="text-white font-semibold text-lg">Background Video</h4>
                  <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold rounded">
                    PRO
                  </span>
                </div>

                {/* URL Input Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Video URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/video.mp4 hoặc Cloudinary URL"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors"
                      value={customization.backgroundVideo || ''}
                      onChange={(e) => updateCustomization({ backgroundVideo: e.target.value })}
                    />
                  </div>

                  {/* Apply URL Button */}
                  <Button
                    onClick={() => {
                      if (customization.backgroundVideo) {
                        console.log('🔗 [DEBUG] Applying video URL:', customization.backgroundVideo);
                        updateCustomization({
                          backgroundType: 'video',
                          backgroundValue: customization.backgroundVideo,
                          // Clear image fields to avoid conflict
                          backgroundImage: null
                        });
                        toast.success('Video background đã được áp dụng!');
                      } else {
                        toast.error('Vui lòng nhập URL video');
                      }
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Áp Dụng Video URL
                  </Button>
                </div>

                {/* Divider */}
                <div className="flex items-center space-x-4">
                  <div className="flex-1 h-px bg-gray-600"></div>
                  <span className="text-gray-400 text-sm">hoặc</span>
                  <div className="flex-1 h-px bg-gray-600"></div>
                </div>

                {/* Enhanced File Upload Area */}
                <div className="border-2 border-dashed border-yellow-500/50 rounded-lg p-8 text-center bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
                  {/* Video Icon */}
                  <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z"/>
                    </svg>
                  </div>

                  {/* Upload Text */}
                  <div className="mb-4">
                    <p className="text-white text-lg font-medium mb-2">
                      Drop your video here or
                    </p>
                    <p className="text-yellow-500 font-medium">
                      Browse Video Files
                    </p>
                  </div>

                  {/* File Info */}
                  <p className="text-gray-400 text-sm mb-6">
                    MP4, WebM up to 50MB
                  </p>

                  {/* Hidden Input */}
                  <input
                    type="file"
                    accept=".mp4,.webm,.mov"
                    className="hidden"
                    id="premium-video-upload"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        if (file.size > 50 * 1024 * 1024) { // 50MB limit
                          toast.error('Video quá lớn! Vui lòng chọn video dưới 50MB.');
                          return;
                        }

                        try {
                          // Show loading toast
                          const loadingToast = toast.loading('Đang tải lên video...');

                          // Upload video to server
                          const uploadResult = await premiumApi.uploadVideoBackground(file);

                          // Update customization with server URL
                          let videoUrl = uploadResult.data?.url || uploadResult.url;

                          // Convert relative path to full URL if needed
                          if (videoUrl && !videoUrl.startsWith('http')) {
                            const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
                            videoUrl = `${baseUrl}${videoUrl}`;
                          }

                          console.log('🎥 [DEBUG] Video uploaded, updating customization:', videoUrl);
                          updateCustomization({
                            backgroundType: 'video',
                            backgroundValue: videoUrl,
                            // Clear image fields to avoid conflict
                            backgroundImage: null,
                            backgroundVideo: videoUrl // Keep for backward compatibility
                          });

                          // Dismiss loading toast first
                          toast.dismiss(loadingToast);

                          // Auto-save to theme after upload
                          try {
                            // Mark fields as changed to trigger save
                            setChangedFields(prev => new Set([...prev, 'backgroundType', 'backgroundValue']));

                            // Wait a bit for state to update, then save
                            setTimeout(async () => {
                              try {
                                await saveTheme();
                                toast.success('Video đã được tải lên và lưu thành công!');
                              } catch (saveError) {
                                console.error('Save theme error:', saveError);
                                toast.error('Lỗi khi lưu vào theme: ' + (saveError.message || 'Vui lòng thử lại'));
                              }
                            }, 100);

                          } catch (saveError) {
                            console.error('Save theme error:', saveError);
                            toast.success('Video đã tải lên thành công!');
                            toast.error('Lỗi khi lưu vào theme: ' + (saveError.message || 'Vui lòng thử lại'));
                          }

                        } catch (error) {
                          console.error('Upload error:', error);
                          toast.error('Không thể tải lên video: ' + (error.message || 'Lỗi không xác định'));
                        }
                      }
                    }}
                  />

                  {/* Browse Button */}
                  <Button
                    onClick={() => document.getElementById('premium-video-upload').click()}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                  >
                    Browse Video Files
                  </Button>
                </div>

                {/* Pro Tip */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-yellow-500 font-medium text-sm">
                        💡 Pro Tip: Use short, looping videos for best performance
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Animated Background */}
            {selectedPremiumFeature.id === 'animated-background' && (
              <div className="space-y-6">
                {/* URL Input Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Image/GIF URL</label>
                    <input
                      id="premium-image-url"
                      type="url"
                      placeholder="https://example.com/image.jpg hoặc GIF URL"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors"
                      value={customization.backgroundImage || ''}
                      onChange={(e) => updateCustomization({ backgroundImage: e.target.value })}
                    />
                  </div>

                  {/* Apply URL Button */}
                  <Button
                    onClick={() => {
                      if (customization.backgroundImage) {
                        updateCustomization({
                          backgroundType: 'image',
                          backgroundValue: customization.backgroundImage
                        });
                        toast.success('Image background đã được áp dụng!');
                      } else {
                        toast.error('Vui lòng nhập URL hình ảnh');
                      }
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Áp Dụng Image URL
                  </Button>
                </div>

                {/* Divider */}
                <div className="flex items-center space-x-4">
                  <div className="flex-1 h-px bg-gray-600"></div>
                  <span className="text-gray-400 text-sm">hoặc</span>
                  <div className="flex-1 h-px bg-gray-600"></div>
                </div>

                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                  <CloudArrowUpIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">Upload Hình Ảnh + GIF (tối đa 10MB)</p>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.webp"
                    className="hidden"
                    id="premium-image-upload"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        if (file.size > 10 * 1024 * 1024) { // 10MB limit
                          toast.error('File quá lớn! Vui lòng chọn file dưới 10MB.');
                          return;
                        }

                        try {
                          // Show loading toast
                          const loadingToast = toast.loading('Đang tải lên hình ảnh...');

                          // Upload image to server
                          const uploadResult = await premiumApi.uploadBackground(file);

                          // Update customization with server URL
                          let imageUrl = uploadResult.data?.url || uploadResult.url;

                          // Convert relative path to full URL if needed
                          if (imageUrl && !imageUrl.startsWith('http')) {
                            const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
                            imageUrl = `${baseUrl}${imageUrl}`;
                          }

                          console.log('🖼️ [DEBUG] Image uploaded, updating customization:', imageUrl);
                          console.log('🔄 [DEBUG] Updating customization with image URL:', imageUrl);
                          updateCustomization({
                            backgroundType: 'image',
                            backgroundValue: imageUrl,
                            // Clear video fields to avoid conflict
                            backgroundVideo: null,
                            backgroundImage: imageUrl // Keep for backward compatibility
                          });

                          // Dismiss loading toast first
                          toast.dismiss(loadingToast);

                          // Auto-save to theme after upload
                          try {
                            // Mark fields as changed to trigger save
                            setChangedFields(prev => new Set([...prev, 'backgroundType', 'backgroundValue']));

                            // Wait a bit for state to update, then save
                            setTimeout(async () => {
                              try {
                                await saveTheme();
                                toast.success('Hình ảnh đã được tải lên và lưu thành công!');
                              } catch (saveError) {
                                console.error('Save theme error:', saveError);
                                toast.error('Lỗi khi lưu vào theme: ' + (saveError.message || 'Vui lòng thử lại'));
                              }
                            }, 100);

                          } catch (saveError) {
                            console.error('Save theme error:', saveError);
                            toast.success('Hình ảnh đã tải lên thành công!');
                            toast.error('Lỗi khi lưu vào theme: ' + (saveError.message || 'Vui lòng thử lại'));
                          }

                        } catch (error) {
                          console.error('Upload error:', error);
                          toast.error('Không thể tải lên hình ảnh: ' + (error.message || 'Lỗi không xác định'));
                        }
                      }
                    }}
                  />
                  <Button
                    onClick={() => document.getElementById('premium-image-upload').click()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Chọn File
                  </Button>
                </div>
              </div>
            )}

            {/* Avatar Decoration Settings */}
            {selectedPremiumFeature.id === 'avatar-decoration' && (
              <div className="space-y-8">


                {/* Avatar Preview Section */}
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl border border-gray-700/50 overflow-hidden backdrop-blur-sm p-6">
                  <h4 className="text-lg font-semibold text-white mb-6 flex items-center">
                    <EyeIcon className="w-5 h-5 mr-2 text-purple-400" />
                    Avatar Preview
                  </h4>

                  {/* Centered Avatar Layout */}
                  <div className="flex flex-col items-center space-y-4">
                    {/* Avatar with Decoration Overlay */}
                    <div className="relative flex items-center justify-center">
                      {/* Base Avatar */}
                      <Avatar
                        user={user}
                        size="2xl"
                        className="relative z-10"
                      />

                      {/* Decoration Overlay */}
                      {selectedDecoration && (
                        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                          <img
                            src={selectedDecoration.path}
                            alt={selectedDecoration.name}
                            className="w-full h-full object-contain"
                            style={{
                              width: '120px', // Slightly larger than 2xl avatar (96px)
                              height: '120px'
                            }}
                            onError={(e) => {
                              console.error('Failed to load decoration image:', selectedDecoration.path);
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Status Text */}
                    <div className="text-center">
                      <p className="text-gray-300 text-sm">
                        {selectedDecoration ? (
                          <span className="text-purple-300 font-medium">
                            Applied: {selectedDecoration.name}
                          </span>
                        ) : (
                          <span className="text-gray-400">
                            No decoration selected
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>



                {/* Decorations Grid */}
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl border border-gray-700/50 overflow-hidden backdrop-blur-sm p-6">
                  <h4 className="text-lg font-semibold text-white mb-6">Avatar Decorations</h4>

                  <div className="grid grid-cols-6 gap-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-700">
                    {/* None Option */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`aspect-square bg-gray-700 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-center ${
                        !selectedDecoration ? 'border-purple-500 bg-purple-500/20' : 'border-gray-600 hover:border-gray-500'
                      }`}
                      onClick={() => {
                        setSelectedDecoration(null);
                      }}
                    >
                      <span className="text-gray-400 text-xs font-medium">None</span>
                    </motion.div>

                    {/* Decoration Items */}
                    {decorations.map((decoration) => (
                      <motion.div
                        key={decoration.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`aspect-square bg-gray-700 rounded-lg border-2 cursor-pointer overflow-hidden transition-all relative group ${
                          selectedDecoration?.id === decoration.id ? 'border-purple-500 bg-purple-500/20' : 'border-gray-600 hover:border-gray-500'
                        }`}
                        onClick={() => {
                          setSelectedDecoration(decoration);
                        }}
                      >
                        <img
                          src={decoration.path}
                          alt={decoration.name}
                          className="w-full h-full object-contain p-1 transition-transform group-hover:scale-110"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div
                          className="w-full h-full flex items-center justify-center text-gray-400 text-xs hidden"
                        >
                          {decoration.name.slice(0, 3)}
                        </div>

                        {/* Hover overlay with name */}
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-medium text-center px-1 capitalize">
                            {decoration.name}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Selected Decoration Info */}
                  {selectedDecoration && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30">
                      <div className="flex items-center space-x-3">
                        <img
                          src={selectedDecoration.path}
                          alt={selectedDecoration.name}
                          className="w-12 h-12 object-contain bg-gray-700 rounded-lg p-1"
                        />
                        <div>
                          <p className="text-white font-semibold capitalize">
                            {selectedDecoration.name}
                          </p>
                          <p className="text-purple-300 text-sm">
                            Avatar decoration applied
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {selectedPremiumFeature.id === 'hide-watermark' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <span className="text-gray-300">Ẩn Footer LumiLink</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <span className="text-gray-300">Custom Branding</span>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <span className="text-gray-300">White Label Mode</span>
                  <input type="checkbox" className="rounded" />
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPremiumModal(false);
                  setSelectedPremiumFeature(null);
                }}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                className="flex-1"
                onClick={async () => {
                  if (!selectedPremiumFeature.canSave) {
                    toast.error('Cần nâng cấp Premium để lưu cài đặt này');
                    return;
                  }

                  try {
                    // Handle different feature types - now using theme_settings
                    if (selectedPremiumFeature.id === 'video-background') {
                      // Save video background settings via theme
                      const videoUrl = customization.backgroundVideo;
                      if (videoUrl) {
                        console.log('🎥 [DEBUG] Saving video background via theme:', videoUrl);
                        updateCustomization({
                          backgroundType: 'video',
                          backgroundValue: videoUrl
                        });
                        // Auto-save theme
                        await saveTheme();
                      } else {
                        toast.error('Vui lòng nhập URL video');
                        return;
                      }
                    } else if (selectedPremiumFeature.id === 'animated-background') {
                      // Save animated background settings via theme
                      const imageUrl = customization.backgroundImage;
                      if (imageUrl) {
                        console.log('🖼️ [DEBUG] Saving image background via theme:', imageUrl);
                        updateCustomization({
                          backgroundType: 'image',
                          backgroundValue: imageUrl
                        });
                        // Auto-save theme
                        await saveTheme();
                      } else {
                        toast.error('Vui lòng nhập URL hình ảnh');
                        return;
                      }
                    } else if (selectedPremiumFeature.id === 'avatar-decoration') {
                      // Save avatar decoration path only
                      const avatarDecorationPath = selectedDecoration?.path || null;

                      // Update profile with avatar decoration path only - don't spread existing theme
                      await premiumApi.updateProfile({
                        theme: {
                          avatarDecoration: avatarDecorationPath
                        }
                      });

                      toast.success('Avatar decoration đã được lưu!');

                    } else if (selectedPremiumFeature.id === 'hide-watermark') {
                      // Save watermark settings
                      const hideWatermark = document.querySelector('input[type="checkbox"]')?.checked || false;
                      await premiumApi.updateProfile({ hideWatermark });
                      toast.success('Đã áp dụng cài đặt thành công!');
                    } else {
                      toast.success('Đã áp dụng cài đặt thành công!');
                    }
                    setShowPremiumModal(false);
                    setSelectedPremiumFeature(null);

                    // Refresh data to show changes
                    if (refreshData) {
                      refreshData('customize');
                    }
                  } catch (error) {
                    console.error('Error saving premium feature:', error);
                    toast.error('Không thể lưu cài đặt. Vui lòng thử lại.');
                  }
                }}
              >
                {selectedPremiumFeature.canSave
                  ? (selectedPremiumFeature.id === 'hide-watermark' ? 'Lưu Cài Đặt' : 'Áp Dụng')
                  : 'Nâng Cấp Premium'
                }
              </Button>
            </div>
          </div>
        </Modal>
      )}


    </div>
  );
};

export default CustomizeTab;

// Add custom CSS for purple sliders
const style = document.createElement('style');
style.textContent = `
  .slider-purple::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: linear-gradient(45deg, #8b5cf6, #ec4899);
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
  }

  .slider-purple::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: linear-gradient(45deg, #8b5cf6, #ec4899);
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
  }

  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
  }

  .scrollbar-thin::-webkit-scrollbar-track {
    background: #374151;
    border-radius: 3px;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: #8b5cf6;
    border-radius: 3px;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #7c3aed;
  }
`;

if (typeof document !== 'undefined') {
  document.head.appendChild(style);
}
