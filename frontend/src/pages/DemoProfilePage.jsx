import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
import RingAvatar from '../components/ui/RingAvatar';
import { isAudioUrl } from '../utils/audioValidators';
import enhancedAnalyticsService from '../services/enhancedAnalyticsService';
import analyticsApi from '../services/analyticsApi';
import '../styles/demo-custom.css';

const DemoProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { getProfile } = useProfile();
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [volume, setVolume] = useState(100);
  const [refreshKey, setRefreshKey] = useState(0);
  const videoRef = useRef(null);
  
  // Demo theme variations for testing
  const [currentTheme, setCurrentTheme] = useState(0); // Dark theme as default
  const [currentLayout, setCurrentLayout] = useState(0);
  const [showCustomCSS, setShowCustomCSS] = useState(false);
  const [customCSS, setCustomCSS] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [showDataInput, setShowDataInput] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // New features for backgrounds and decorations
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  const [showDecorationSelector, setShowDecorationSelector] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [selectedDecoration, setSelectedDecoration] = useState(null);
  const [backgroundType, setBackgroundType] = useState('gradient'); // 'gradient', 'image', 'video'

  // Sample Backgrounds
  const [sampleBackgrounds] = useState([
    {
      id: 'gradient1',
      name: 'Purple Gradient',
      type: 'gradient',
      value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 'gradient2',
      name: 'Ocean Blue',
      type: 'gradient',
      value: 'linear-gradient(45deg, #0ea5e9, #1e40af, #3b82f6)',
      preview: 'linear-gradient(45deg, #0ea5e9, #1e40af, #3b82f6)'
    },
    {
      id: 'image1',
      name: 'Cyberpunk City',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop',
      preview: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop'
    },
    {
      id: 'image2',
      name: 'Neon Lights',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop',
      preview: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop'
    },
    {
      id: 'image3',
      name: 'Abstract Art',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
      preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
    },
    {
      id: 'video1',
      name: 'Particles Flow',
      type: 'video',
      value: 'https://player.vimeo.com/external/370467553.sd.mp4?s=e90dcaba73c19e0e36f03406b47bbd6992dd6c1c&profile_id=139&oauth2_token_id=57447761',
      preview: 'https://i.vimeocdn.com/video/827016166-770x433.jpg'
    },
    {
      id: 'video2',
      name: 'Digital Rain',
      type: 'video',
      value: 'https://player.vimeo.com/external/370467553.sd.mp4?s=e90dcaba73c19e0e36f03406b47bbd6992dd6c1c&profile_id=139&oauth2_token_id=57447761',
      preview: 'https://i.vimeocdn.com/video/827016166-770x433.jpg'
    }
  ]);

  // Sample Avatar Decorations
  const [sampleDecorations] = useState([
    {
      id: 'none',
      name: 'None',
      path: null,
      preview: null
    },
    {
      id: 'crown',
      name: 'Golden Crown',
      path: '/decorations/golden_crown.png',
      preview: '/decorations/golden_crown.png'
    },
    {
      id: 'angel',
      name: 'Angel Wings',
      path: '/decorations/angel.png',
      preview: '/decorations/angel.png'
    },
    {
      id: 'devil',
      name: 'Devil Horns',
      path: '/decorations/devil.png',
      preview: '/decorations/devil.png'
    },
    {
      id: 'cat_ears',
      name: 'Cat Ears',
      path: '/decorations/cat_ears.png',
      preview: '/decorations/cat_ears.png'
    },
    {
      id: 'wizard_hat',
      name: 'Wizard Hat',
      path: '/decorations/wizard_hat_purple.png',
      preview: '/decorations/wizard_hat_purple.png'
    },
    {
      id: 'phoenix',
      name: 'Phoenix',
      path: '/decorations/phoenix.png',
      preview: '/decorations/phoenix.png'
    },
    {
      id: 'dragon',
      name: 'Dragon Aura',
      path: '/decorations/dragon_balls.png',
      preview: '/decorations/dragon_balls.png'
    }
  ]);

  // Special Templates
  const [specialTemplates] = useState([
    {
      id: 'cyberpunk',
      name: '🤖 Cyberpunk',
      description: 'Futuristic neon style',
      theme: 5, // Neon Cyber theme
      layout: 3, // Grid Compact
      css: `/* 🤖 Cyberpunk Template */
.demo-profile-link {
  background: linear-gradient(45deg, #00ffff, #ff00ff, #ffff00) !important;
  border: 2px solid #00ffff !important;
  border-radius: 0 !important;
  transform: skew(-10deg) !important;
  box-shadow: 0 0 20px #00ffff !important;
  position: relative !important;
  overflow: hidden !important;
}

.demo-profile-link::before {
  content: '' !important;
  position: absolute !important;
  top: 0 !important;
  left: -100% !important;
  width: 100% !important;
  height: 100% !important;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent) !important;
  animation: cyber-scan 2s infinite !important;
}

@keyframes cyber-scan {
  0% { left: -100%; }
  100% { left: 100%; }
}

.avatar-container {
  filter: hue-rotate(180deg) saturate(2) !important;
  animation: cyber-pulse 2s ease-in-out infinite !important;
}

@keyframes cyber-pulse {
  0%, 100% { transform: scale(1); filter: hue-rotate(180deg) saturate(2); }
  50% { transform: scale(1.05); filter: hue-rotate(200deg) saturate(3); }
}

.profile-name {
  background: linear-gradient(45deg, #00ffff, #ff00ff) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  text-shadow: 0 0 30px #00ffff !important;
  animation: cyber-glitch 3s infinite !important;
}

@keyframes cyber-glitch {
  0%, 100% { transform: translateX(0); }
  10% { transform: translateX(-2px); }
  20% { transform: translateX(2px); }
  30% { transform: translateX(-1px); }
  40% { transform: translateX(1px); }
  50% { transform: translateX(0); }
}`
    },
    {
      id: 'glassmorphism',
      name: '🌟 Glassmorphism',
      description: 'Modern glass effect',
      theme: 0, // Purple Gradient
      layout: 0, // Center Stack
      css: `/* 🌟 Glassmorphism Template */
.demo-profile-link {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 20px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease !important;
}

.demo-profile-link:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  transform: translateY(-5px) !important;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.2) !important;
}

.avatar-container {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(20px) !important;
  border-radius: 50% !important;
  padding: 10px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
}

.profile-text-section {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(10px) !important;
  border-radius: 20px !important;
  padding: 2rem !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

body::before {
  content: '' !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3), transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3), transparent 50%) !important;
  pointer-events: none !important;
  z-index: -1 !important;
}`
    },
    {
      id: 'retro',
      name: '🕹️ Retro Gaming',
      description: '80s arcade style',
      theme: 2, // Sunset Orange
      layout: 1, // Left Align
      css: `/* 🕹️ Retro Gaming Template */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

* {
  font-family: 'Orbitron', monospace !important;
}

.demo-profile-link {
  background: linear-gradient(45deg, #ff6b35, #f7931e) !important;
  border: 3px solid #fff !important;
  border-radius: 0 !important;
  box-shadow: 5px 5px 0 #000, inset 0 0 0 3px #ff6b35 !important;
  transform: none !important;
  position: relative !important;
  text-transform: uppercase !important;
  font-weight: bold !important;
}

.demo-profile-link:hover {
  animation: retro-blink 0.5s infinite !important;
  transform: translate(-2px, -2px) !important;
  box-shadow: 7px 7px 0 #000, inset 0 0 0 3px #ff6b35 !important;
}

@keyframes retro-blink {
  0%, 50% { background: linear-gradient(45deg, #ff6b35, #f7931e); }
  51%, 100% { background: linear-gradient(45deg, #f7931e, #ff6b35); }
}

.avatar-container {
  filter: contrast(1.2) saturate(1.5) !important;
  border: 5px solid #fff !important;
  box-shadow: 5px 5px 0 #000 !important;
  border-radius: 0 !important;
}

.profile-name {
  color: #ff6b35 !important;
  text-shadow: 3px 3px 0 #000, -1px -1px 0 #fff !important;
  font-weight: 900 !important;
  text-transform: uppercase !important;
  letter-spacing: 2px !important;
}

body {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(255, 107, 53, 0.1) 2px,
    rgba(255, 107, 53, 0.1) 4px
  ) !important;
}`
    },
    {
      id: 'minimalist',
      name: '⚪ Minimalist',
      description: 'Clean and simple',
      theme: 4, // Dark Minimal
      layout: 0, // Center Stack
      css: `/* ⚪ Minimalist Template */
.demo-profile-link {
  background: #fff !important;
  color: #000 !important;
  border: 1px solid #e0e0e0 !important;
  border-radius: 8px !important;
  box-shadow: none !important;
  transition: all 0.2s ease !important;
}

.demo-profile-link:hover {
  background: #f5f5f5 !important;
  border-color: #000 !important;
  transform: none !important;
}

.avatar-container {
  filter: grayscale(100%) !important;
  border-radius: 50% !important;
}

.profile-name {
  color: #000 !important;
  font-weight: 300 !important;
  text-shadow: none !important;
}

.profile-username {
  color: #666 !important;
}

.profile-bio {
  color: #333 !important;
  font-weight: 300 !important;
}

body {
  background: #fff !important;
}

.links-center-stack {
  max-width: 300px !important;
  gap: 0.5rem !important;
}`
    },
    {
      id: 'neon',
      name: '💫 Neon Dreams',
      description: 'Glowing neon effects',
      theme: 1, // Ocean Blue
      layout: 4, // Horizontal Scroll
      css: `/* 💫 Neon Dreams Template */
.demo-profile-link {
  background: transparent !important;
  border: 2px solid #00d4ff !important;
  border-radius: 25px !important;
  color: #00d4ff !important;
  box-shadow:
    0 0 10px #00d4ff,
    inset 0 0 10px rgba(0, 212, 255, 0.1) !important;
  transition: all 0.3s ease !important;
  position: relative !important;
  overflow: hidden !important;
}

.demo-profile-link:hover {
  background: rgba(0, 212, 255, 0.1) !important;
  box-shadow:
    0 0 20px #00d4ff,
    0 0 40px #00d4ff,
    inset 0 0 20px rgba(0, 212, 255, 0.2) !important;
  transform: scale(1.05) !important;
}

.demo-profile-link::before {
  content: '' !important;
  position: absolute !important;
  top: 0 !important;
  left: -100% !important;
  width: 100% !important;
  height: 100% !important;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.4), transparent) !important;
  transition: left 0.5s !important;
}

.demo-profile-link:hover::before {
  left: 100% !important;
}

.avatar-container {
  animation: neon-pulse 2s ease-in-out infinite !important;
}

@keyframes neon-pulse {
  0%, 100% {
    filter: drop-shadow(0 0 10px #00d4ff) drop-shadow(0 0 20px #00d4ff);
  }
  50% {
    filter: drop-shadow(0 0 20px #00d4ff) drop-shadow(0 0 40px #00d4ff);
  }
}

.profile-name {
  color: #00d4ff !important;
  text-shadow:
    0 0 10px #00d4ff,
    0 0 20px #00d4ff,
    0 0 40px #00d4ff !important;
  animation: neon-flicker 3s infinite !important;
}

@keyframes neon-flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
  75% { opacity: 1; }
  85% { opacity: 0.9; }
  95% { opacity: 1; }
}

body {
  background: radial-gradient(circle at center, #001122 0%, #000 70%) !important;
}`
    }
  ]);

  const [inputData, setInputData] = useState({
    username: 'demo-user',
    displayName: 'Demo User',
    bio: 'Testing custom theme properties with CSS variables and dynamic styling.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    links: [
      { id: 1, title: 'My Website', url: 'https://example.com', platform: 'website', active: true, description: 'Check out my personal website' },
      { id: 2, title: 'YouTube Channel', url: 'https://youtube.com/@demo', platform: 'youtube', active: true, description: 'Subscribe to my YouTube channel' },
      { id: 3, title: 'Instagram', url: 'https://instagram.com/demo', platform: 'instagram', active: true, description: 'Follow me on Instagram' },
      { id: 4, title: 'Twitter', url: 'https://twitter.com/demo', platform: 'twitter', active: true, description: 'Follow me on Twitter' },
      { id: 5, title: 'GitHub', url: 'https://github.com/demo', platform: 'github', active: true, description: 'Check out my code' }
    ]
  });

  // Layout variations
  const [layoutOptions] = useState([
    { name: 'Center Stack', value: 'center-stack', description: 'Links xếp dọc giữa với mô tả đầy đủ' },
    { name: 'Left Align', value: 'left-align', description: 'Links căn trái với mô tả đầy đủ' },
    { name: 'Grid 2 Columns', value: 'grid-2', description: 'Lưới 2 cột với mô tả đầy đủ' },
    { name: 'Grid Compact', value: 'grid-compact', description: 'Lưới nhỏ gọn, chỉ hiện icon platform' },
    { name: 'Icon Grid', value: 'icon-grid', description: 'Chỉ hiện icon dưới avatar, kiểu minimalist' },
    { name: 'Horizontal Scroll', value: 'horizontal', description: 'Links cuộn ngang' },
    { name: 'Floating Cards', value: 'floating', description: 'Links xoay ngẫu nhiên với hover effects' }
  ]);

  const [demoThemes] = useState([
    {
      name: 'Dark Theme',
      theme: {
        primaryColor: '#FFFFFF',
        backgroundColor: '#000000',
        textColor: '#FFFFFF',
        backgroundType: 'solid',
        backgroundValue: '#000000',
        backgroundAnimation: 'none',
        buttonStyle: 'rounded',
        fontFamily: 'Inter'
      }
    },
    {
      name: 'Purple Gradient',
      theme: {
        primaryColor: '#8B5CF6',
        backgroundColor: '#1F2937',
        textColor: '#FFFFFF',
        backgroundType: 'gradient',
        backgroundValue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundAnimation: 'gradient-shift',
        buttonStyle: 'rounded',
        fontFamily: 'Inter'
      }
    },
    {
      name: 'Ocean Blue',
      theme: {
        primaryColor: '#0EA5E9',
        backgroundColor: '#0F172A',
        textColor: '#F1F5F9',
        backgroundType: 'gradient',
        backgroundValue: 'linear-gradient(45deg, #0ea5e9, #1e40af, #3b82f6, #0ea5e9)',
        backgroundAnimation: 'wave-motion',
        buttonStyle: 'rounded',
        fontFamily: 'Inter'
      }
    },
    {
      name: 'Sunset Orange',
      theme: {
        primaryColor: '#F97316',
        backgroundColor: '#1C1917',
        textColor: '#FAFAF9',
        backgroundType: 'gradient',
        backgroundValue: 'radial-gradient(circle at 30% 20%, #f97316, #dc2626, #991b1b)',
        backgroundAnimation: 'pulse-glow',
        buttonStyle: 'rounded',
        fontFamily: 'Inter'
      }
    },
    {
      name: 'Forest Green',
      theme: {
        primaryColor: '#10B981',
        backgroundColor: '#064E3B',
        textColor: '#ECFDF5',
        backgroundType: 'gradient',
        backgroundValue: 'conic-gradient(from 0deg, #10b981, #059669, #047857, #10b981)',
        backgroundAnimation: 'rotate-slow',
        buttonStyle: 'rounded',
        fontFamily: 'Inter'
      }
    },
    {
      name: 'Dark Minimal',
      theme: {
        primaryColor: '#6B7280',
        backgroundColor: '#111827',
        textColor: '#F9FAFB',
        backgroundType: 'pattern',
        backgroundValue: 'radial-gradient(circle at 1px 1px, rgba(107, 114, 128, 0.15) 1px, transparent 0)',
        backgroundAnimation: 'dots-float',
        buttonStyle: 'square',
        fontFamily: 'Inter'
      }
    },
    {
      name: 'Neon Cyber',
      theme: {
        primaryColor: '#00FFFF',
        backgroundColor: '#0A0A0A',
        textColor: '#00FFFF',
        backgroundType: 'animated',
        backgroundValue: 'linear-gradient(45deg, #0A0A0A, #1A1A2E, #16213E, #0A0A0A)',
        backgroundAnimation: 'cyber-grid',
        buttonStyle: 'neon',
        fontFamily: 'Orbitron'
      }
    }
  ]);

  // Create profile from input data using useMemo for performance
  const demoProfile = useMemo(() => ({
    username: inputData.username,
    displayName: inputData.displayName,
    bio: inputData.bio,
    avatar: inputData.avatar
  }), [inputData.username, inputData.displayName, inputData.bio, inputData.avatar]);

  const demoLinks = useMemo(() => inputData.links, [inputData.links]);

  // Current active theme
  const activeTheme = demoThemes[currentTheme];

  const [backgroundStyle, setBackgroundStyle] = useState({});

  // Demo analytics data
  const [demoAnalytics] = useState({
    profileViews: { total: 1234 },
    linkClicks: { total: 567 }
  });

  // Helper function to convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Update theme and CSS variables
  useEffect(() => {
    const theme = activeTheme.theme;

    // Convert colors to RGB for CSS variables
    const primaryRgb = hexToRgb(theme.primaryColor);
    const textRgb = hexToRgb(theme.textColor);

    // Set CSS custom properties for theming
    document.documentElement.style.setProperty('--theme-primary', theme.primaryColor);
    document.documentElement.style.setProperty('--theme-background', theme.backgroundColor);
    document.documentElement.style.setProperty('--theme-text', theme.textColor);
    document.documentElement.style.setProperty('--theme-animation', theme.backgroundAnimation || 'none');

    if (primaryRgb) {
      document.documentElement.style.setProperty('--theme-primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
    }
    if (textRgb) {
      document.documentElement.style.setProperty('--theme-text-rgb', `${textRgb.r}, ${textRgb.g}, ${textRgb.b}`);
    }

    // Update background style with animation
    const animationClass = theme.backgroundAnimation ? `bg-${theme.backgroundAnimation}` : '';
    setBackgroundStyle({
      background: theme.backgroundValue,
      backgroundSize: theme.backgroundAnimation === 'dots-float' ? '20px 20px' : 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: theme.backgroundAnimation === 'dots-float' ? 'repeat' : 'no-repeat'
    });

    // Update profile with current theme and input data
    setProfile({
      ...demoProfile,
      theme: theme
    });

    setLinks(demoLinks);
    setAnalytics(demoAnalytics);
  }, [currentTheme, activeTheme, demoProfile, demoLinks, demoAnalytics]);

  // Update profile and links when input data changes
  useEffect(() => {
    setProfile({
      ...demoProfile,
      theme: activeTheme.theme
    });
    setLinks(demoLinks);
  }, [inputData, demoProfile, demoLinks, activeTheme]);

  // Apply custom CSS
  useEffect(() => {
    // Remove existing custom CSS first
    const existingStyle = document.getElementById('demo-custom-css');
    if (existingStyle) {
      existingStyle.remove();
    }

    if (customCSS && customCSS.trim()) {
      console.log('✅ Applying custom CSS:', customCSS);
      const styleElement = document.createElement('style');
      styleElement.id = 'demo-custom-css';
      styleElement.textContent = customCSS;

      document.head.appendChild(styleElement);

      return () => {
        const element = document.getElementById('demo-custom-css');
        if (element) {
          element.remove();
        }
      };
    }
  }, [customCSS]);

  // Theme switcher function
  const switchTheme = () => {
    setCurrentTheme((prev) => (prev + 1) % demoThemes.length);
  };

  // Animated title effect
  useEffect(() => {
    if (!demoProfile?.username) return;

    const titleText = `@${demoProfile.username} - Demo`;
    document.title = titleText;
  }, [demoProfile]);

  const handleLinkClick = useCallback(async (link) => {
    console.log('Demo: Link clicked:', link.title);
    setSelectedLink(link);
    setShowConfirmDialog(true);
  }, []);

  const handleConfirmVisit = () => {
    if (selectedLink) {
      window.open(selectedLink.url, '_blank', 'noopener,noreferrer');
    }
    setShowConfirmDialog(false);
    setSelectedLink(null);
  };

  const handleCancelVisit = () => {
    setShowConfirmDialog(false);
    setSelectedLink(null);
  };

  // Apply template function
  const applyTemplate = (template) => {
    setCurrentTheme(template.theme);
    setCurrentLayout(template.layout);
    setCustomCSS(template.css);
    setShowTemplates(false);
  };

  // Apply background function
  const applyBackground = (background) => {
    setSelectedBackground(background);
    setShowBackgroundSelector(false);
    console.log('Applied background:', background);
  };

  // Apply decoration function
  const applyDecoration = (decoration) => {
    setSelectedDecoration(decoration);
    setShowDecorationSelector(false);
    console.log('Applied decoration:', decoration);
  };

  // Reset background
  const resetBackground = () => {
    setSelectedBackground(null);
    setShowBackgroundSelector(false);
  };

  // Reset decoration
  const resetDecoration = () => {
    setSelectedDecoration(null);
    setShowDecorationSelector(false);
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      console.log('Demo: URL copied to clipboard');
    } catch (err) {
      console.error('Demo: Failed to copy URL');
    }
  };

  const shareToSocial = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out @${demoProfile.username}'s profile on LumiLink!`);
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Demo Error</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading demo profile...</p>
        </div>
      </div>
    );
  }

  // Get animation class for background
  const getBackgroundClass = () => {
    const theme = activeTheme.theme;
    const animationClass = theme.backgroundAnimation ? `bg-${theme.backgroundAnimation}` : '';
    return `min-h-screen relative overflow-hidden ${animationClass}`;
  };

  return (
    <div
      className={getBackgroundClass()}
      style={backgroundStyle}
    >
      {/* Demo Controls */}
      <div className="absolute top-4 left-4 z-50 space-y-2">
        <div className="bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
          🧪 DEMO MODE
        </div>

        {/* Theme Switcher */}
        <button
          onClick={switchTheme}
          className="demo-theme-switcher bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-all flex items-center space-x-2"
          style={{
            borderColor: 'var(--theme-primary)',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <span>🎨</span>
          <span>{activeTheme.name}</span>
        </button>

        {/* Layout Switcher */}
        <button
          onClick={() => setCurrentLayout((prev) => (prev + 1) % layoutOptions.length)}
          className="demo-theme-switcher bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-all flex items-center space-x-2"
          style={{
            borderColor: 'var(--theme-primary)',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <span>📐</span>
          <span>{layoutOptions[currentLayout].name}</span>
        </button>

        {/* Custom CSS Toggle */}
        <button
          onClick={() => setShowCustomCSS(!showCustomCSS)}
          className="demo-theme-switcher bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-all flex items-center space-x-2"
          style={{
            borderColor: 'var(--theme-primary)',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <span>💻</span>
          <span>Custom CSS</span>
        </button>

        {/* Data Input Toggle */}
        <button
          onClick={() => setShowDataInput(!showDataInput)}
          className="demo-theme-switcher bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-all flex items-center space-x-2"
          style={{
            borderColor: 'var(--theme-primary)',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <span>📝</span>
          <span>Edit Data</span>
        </button>

        {/* Templates Toggle */}
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="demo-theme-switcher bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-all flex items-center space-x-2"
          style={{
            borderColor: 'var(--theme-primary)',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <span>🎨</span>
          <span>Templates</span>
        </button>

        {/* Background Selector Toggle */}
        <button
          onClick={() => setShowBackgroundSelector(!showBackgroundSelector)}
          className="demo-theme-switcher bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-all flex items-center space-x-2"
          style={{
            borderColor: 'var(--theme-primary)',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <span>🖼️</span>
          <span>Background</span>
        </button>

        {/* Avatar Decoration Toggle */}
        <button
          onClick={() => setShowDecorationSelector(!showDecorationSelector)}
          className="demo-theme-switcher bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-all flex items-center space-x-2"
          style={{
            borderColor: 'var(--theme-primary)',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <span>👑</span>
          <span>Decoration</span>
        </button>
      </div>

      {/* Background Media */}
      <MediaBackground
        background={selectedBackground || profile.theme}
        volume={volume}
        ref={videoRef}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header Actions */}
        <div className="flex justify-end items-center p-4 sm:p-6">

          <div className="flex items-center space-x-2">
            {/* Volume Control */}
            {profile.theme?.backgroundType === 'video' && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowVolumeControl(!showVolumeControl)}
                  className="p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all"
                >
                  <SpeakerWaveIcon className="w-5 h-5" />
                </motion.button>

                {showVolumeControl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-0 mt-2 p-3 bg-white/10 backdrop-blur-sm rounded-lg"
                  >
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(parseInt(e.target.value))}
                      className="w-20"
                    />
                  </motion.div>
                )}
              </div>
            )}

            {/* Share Button */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all"
              >
                <ShareIcon className="w-5 h-5" />
              </motion.button>

              {/* Share Menu */}
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden"
                >
                  <button
                    onClick={copyToClipboard}
                    className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors flex items-center space-x-2"
                  >
                    <ClipboardDocumentIcon className="w-4 h-4" />
                    <span>Copy Link</span>
                  </button>
                  <button
                    onClick={() => shareToSocial('twitter')}
                    className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors"
                  >
                    Share on Twitter
                  </button>
                  <button
                    onClick={() => shareToSocial('facebook')}
                    className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors"
                  >
                    Share on Facebook
                  </button>
                </motion.div>
              )}
            </div>

            {/* View Count */}
            <div className="flex items-center space-x-1 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white">
              <EyeIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{analytics?.profileViews?.total || 0}</span>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8">
          <div className="w-full max-w-md mx-auto text-center">
            {/* Avatar with Decorations */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-6 relative avatar-section"
              style={{ position: 'relative', zIndex: 1 }}
            >
              {/* Avatar Ring/Glow */}
              <div className="relative w-36 h-36 mx-auto avatar-container" style={{ position: 'relative', zIndex: 10 }}>
                {/* Outer glow */}
                <div
                  className="avatar-glow absolute inset-0 rounded-full opacity-60 blur-md"
                  style={{
                    background: `linear-gradient(45deg, ${activeTheme.theme.primaryColor}, ${activeTheme.theme.textColor})`,
                    animation: 'pulse 2s ease-in-out infinite'
                  }}
                ></div>

                {/* Ring border */}
                <div
                  className="avatar-ring absolute inset-2 rounded-full p-1"
                  style={{
                    background: `linear-gradient(45deg, ${activeTheme.theme.primaryColor}, transparent, ${activeTheme.theme.primaryColor})`
                  }}
                >
                  {/* Avatar container */}
                  <div className="avatar-image-container w-full h-full rounded-full overflow-hidden bg-gray-900 shadow-2xl">
                    <img
                      src={profile.avatar}
                      alt={profile.displayName}
                      className="avatar-image w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Verified badge */}
                <div className="avatar-badge absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Avatar Decoration Overlay */}
              {selectedDecoration && selectedDecoration.path && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="absolute pointer-events-none decoration-float"
                  style={{
                    width: '200px',
                    height: '200px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 15
                  }}
                >
                  <img
                    src={selectedDecoration.path}
                    alt={selectedDecoration.name}
                    className="w-full h-full object-contain decoration-glow"
                    style={{
                      filter: 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.8))'
                    }}
                    onError={(e) => {
                      console.error('Failed to load decoration:', selectedDecoration.path);
                      e.target.style.display = 'none';
                    }}
                  />
                </motion.div>
              )}
            </motion.div>

            {/* Name & Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 profile-text-section"
            >
              <h1 className="profile-name text-2xl sm:text-3xl font-bold text-white mb-2 relative inline-block">
                <span className="relative z-10">{profile.displayName || profile.username}</span>
                {/* Sparkle overlay - stretches to text width */}
                <div
                  className="sparkle-overlay"
                  style={{
                    width: '100%',
                    height: '100%'
                  }}
                />
              </h1>
              <p className="profile-username text-lg text-white/80 mb-4">@{profile.username}</p>
              {profile.bio && (
                <p className="profile-bio text-white/70 leading-relaxed max-w-sm mx-auto">
                  {profile.bio}
                </p>
              )}
            </motion.div>



            {/* Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className={`w-full links-${layoutOptions[currentLayout].value} ${
                layoutOptions[currentLayout].value === 'icon-grid' ? 'flex justify-center items-center gap-3 max-w-sm mx-auto' :
                layoutOptions[currentLayout].value === 'grid-2' ? 'grid grid-cols-2 gap-4' :
                layoutOptions[currentLayout].value === 'grid-compact' ? 'grid grid-cols-3 gap-3 max-w-sm' :
                layoutOptions[currentLayout].value === 'horizontal' ? 'flex gap-4 overflow-x-auto pb-4' :
                layoutOptions[currentLayout].value === 'floating' ? 'grid grid-cols-2 gap-6' :
                layoutOptions[currentLayout].value === 'left-align' ? 'flex flex-col gap-4 items-start' :
                'flex flex-col gap-4 items-center'
              }`}
            >
              {links.map((link, index) => {
                if (!link.active) return null;

                const isAudio = isAudioUrl(link.url);

                return (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="w-full"
                  >
                    {isAudio ? (
                      <AudioLinkCard
                        link={link}
                        onClick={() => handleLinkClick(link)}
                      />
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleLinkClick(link)}
                        className={`demo-profile-link backdrop-blur-sm transition-all group ${
                          layoutOptions[currentLayout].value === 'icon-grid'
                            ? 'w-12 h-12 p-2 rounded-xl'
                            : 'w-full p-4 rounded-2xl'
                        }`}
                      >
                        {layoutOptions[currentLayout].value === 'grid-compact' ? (
                          // Compact layout - chỉ icon và title
                          <div className="link-content">
                            <div className="platform-icon">
                              <BrandIcon
                                platform={link.platform}
                                className="w-5 h-5 text-white"
                              />
                            </div>
                            <h3 className="link-title text-white group-hover:text-white/90 transition-colors">
                              {link.title}
                            </h3>
                          </div>
                        ) : layoutOptions[currentLayout].value === 'icon-grid' ? (
                          // Icon Grid layout - chỉ icon với tooltip và màu sắc
                          <div className="link-content flex flex-col items-center justify-center relative">
                            <div className="platform-icon-large">
                              <BrandIcon
                                platform={link.platform}
                                className={`w-6 h-6 ${
                                  link.platform === 'youtube' ? 'text-red-500' :
                                  link.platform === 'instagram' ? 'text-pink-500' :
                                  link.platform === 'twitter' ? 'text-blue-400' :
                                  link.platform === 'tiktok' ? 'text-black' :
                                  link.platform === 'facebook' ? 'text-blue-600' :
                                  link.platform === 'linkedin' ? 'text-blue-700' :
                                  link.platform === 'github' ? 'text-gray-300' :
                                  link.platform === 'discord' ? 'text-indigo-500' :
                                  link.platform === 'twitch' ? 'text-purple-500' :
                                  link.platform === 'spotify' ? 'text-green-500' :
                                  link.platform === 'soundcloud' ? 'text-orange-500' :
                                  link.platform === 'telegram' ? 'text-blue-500' :
                                  link.platform === 'whatsapp' ? 'text-green-400' :
                                  link.platform === 'snapchat' ? 'text-yellow-400' :
                                  link.platform === 'pinterest' ? 'text-red-600' :
                                  link.platform === 'reddit' ? 'text-orange-600' :
                                  'text-white'
                                }`}
                              />
                            </div>
                            {/* Tooltip */}
                            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              {link.title}
                            </div>
                          </div>
                        ) : (
                          // Full layout - icon, title, description
                          <div className="flex items-center space-x-4">
                            {/* Platform Icon */}
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <BrandIcon
                                  platform={link.platform}
                                  className="w-6 h-6 text-white"
                                />
                              </div>
                            </div>

                            {/* Link Content */}
                            <div className="flex-1 text-left">
                              <h3 className="text-white font-semibold text-lg group-hover:text-white/90 transition-colors">
                                {link.title}
                              </h3>
                              {link.description && (
                                <p className="link-description text-white/70 text-sm mt-1">
                                  {link.description}
                                </p>
                              )}
                            </div>

                            {/* External Link Icon */}
                            <div className="flex-shrink-0">
                              <ArrowTopRightOnSquareIcon className="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors" />
                            </div>
                          </div>
                        )}
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Footer - Demo watermark always visible */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-8 pb-6"
        >
          <p className="text-white/50 text-sm">
            Powered by{' '}
            <a
              href="https://lumilink.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors font-medium"
            >
              LumiLink
            </a>
            {' '}• Demo Mode
          </p>
        </motion.div>
      </div>

      {/* Background Selector Panel */}
      {showBackgroundSelector && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setShowBackgroundSelector(false)}
          />
          <div className="fixed top-20 left-4 z-50 w-80 max-h-[600px] overflow-y-auto">
          <div className="demo-card-glass p-4 space-y-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">🖼️ Background Selector</h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-400 text-xs">Preview</span>
                </div>
                <button
                  onClick={() => setShowBackgroundSelector(false)}
                  className="text-white/60 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Background Type Tabs */}
            <div className="flex space-x-2 mb-4">
              {['gradient', 'image', 'video'].map((type) => (
                <button
                  key={type}
                  onClick={() => setBackgroundType(type)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    backgroundType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Background Grid */}
            <div className="grid grid-cols-2 gap-3">
              {sampleBackgrounds
                .filter(bg => bg.type === backgroundType)
                .map((background) => (
                  <div
                    key={background.id}
                    onClick={() => {
                      setSelectedBackground({
                        type: background.type,
                        url: background.value,
                        backgroundValue: background.value,
                        backgroundType: background.type
                      });
                    }}
                    className={`
                      aspect-video rounded-lg border-2 cursor-pointer overflow-hidden
                      transition-all relative group
                      ${selectedBackground?.url === background.value
                        ? 'border-blue-500 ring-2 ring-blue-500/50'
                        : 'border-gray-600 hover:border-gray-400'}
                    `}
                  >
                    {background.type === 'gradient' ? (
                      <div
                        className="w-full h-full"
                        style={{ background: background.preview }}
                      />
                    ) : (
                      <img
                        src={background.preview}
                        alt={background.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    )}

                    {/* Fallback */}
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400 text-xs hidden">
                      {background.name}
                    </div>

                    {/* Overlay with name */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                      <div className="p-2 w-full">
                        <p className="text-white text-xs font-medium">{background.name}</p>
                        <p className="text-gray-300 text-xs">{background.type}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Reset Button */}
            <button
              onClick={() => setSelectedBackground(null)}
              className="w-full mt-3 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded transition-colors"
            >
              Reset to Theme Default
            </button>

            <div className="text-xs text-white/50 bg-gray-800/30 p-2 rounded">
              💡 <strong>Tip:</strong> Click any background to preview it instantly.
            </div>
          </div>
        </div>
        </>
      )}

      {/* Avatar Decoration Selector Panel */}
      {showDecorationSelector && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setShowDecorationSelector(false)}
          />
          <div className="fixed top-20 left-4 z-50 w-80 max-h-[600px] overflow-y-auto">
          <div className="demo-card-glass p-4 space-y-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">👑 Avatar Decorations</h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-purple-400 text-xs">Magic</span>
                </div>
                <button
                  onClick={() => setShowDecorationSelector(false)}
                  className="text-white/60 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Decorations Grid */}
            <div className="grid grid-cols-3 gap-3">
              {sampleDecorations.map((decoration) => (
                <div
                  key={decoration.id}
                  onClick={() => setSelectedDecoration(decoration)}
                  className={`
                    aspect-square rounded-lg border-2 cursor-pointer overflow-hidden
                    transition-all relative group flex items-center justify-center
                    ${selectedDecoration?.id === decoration.id
                      ? 'border-purple-500 ring-2 ring-purple-500/50 bg-purple-500/20'
                      : 'border-gray-600 hover:border-gray-400 bg-gray-700'}
                  `}
                >
                  {decoration.path ? (
                    <img
                      src={decoration.preview}
                      alt={decoration.name}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">None</span>
                  )}

                  {/* Fallback */}
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs hidden">
                    {decoration.name.slice(0, 3)}
                  </div>

                  {/* Tooltip */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {decoration.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Decoration Info */}
            {selectedDecoration && (
              <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                <p className="text-white font-medium">
                  {selectedDecoration.name}
                </p>
                <p className="text-gray-400 text-sm">
                  {selectedDecoration.path ? 'Decoration applied' : 'No decoration'}
                </p>
              </div>
            )}

            <div className="text-xs text-white/50 bg-gray-800/30 p-2 rounded">
              ✨ <strong>Decorations:</strong> Add magical elements to your avatar!
            </div>
          </div>
        </div>
        </>
      )}

      {/* Templates Panel */}
      {showTemplates && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setShowTemplates(false)}
          />
          <div className="fixed top-20 left-4 z-50 w-80 max-h-[600px] overflow-y-auto">
          <div className="demo-card-glass p-4 space-y-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">🎨 Special Templates</h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-purple-400 text-xs">Premium</span>
                </div>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="text-white/60 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {specialTemplates.map((template) => (
                <div key={template.id} className="bg-gray-800/30 p-3 rounded-lg border border-white/10 hover:border-purple-400/50 transition-all group cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-white font-medium text-sm group-hover:text-purple-300 transition-colors">
                        {template.name}
                      </h4>
                      <p className="text-white/60 text-xs mt-1">{template.description}</p>
                    </div>
                    <button
                      onClick={() => applyTemplate(template)}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors"
                    >
                      Apply
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-white/50">
                    <span>Theme: {demoThemes[template.theme]?.name}</span>
                    <span>•</span>
                    <span>Layout: {layoutOptions[template.layout]?.name}</span>
                  </div>

                  <div className="mt-2 text-xs text-white/40">
                    CSS Lines: {template.css.split('\n').length}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-xs text-white/50 bg-gray-800/30 p-2 rounded">
              💡 <strong>Templates include:</strong> Theme + Layout + Custom CSS combo for special effects.
            </div>
          </div>
        </div>
        </>
      )}

      {/* Data Input Panel */}
      {showDataInput && (
        <div className="fixed top-20 left-4 z-50 w-96 max-h-[600px] overflow-y-auto">
          <div className="demo-card-glass p-4 space-y-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">📝 Edit Profile Data</h3>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs">Live Update</span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-3">
              <div>
                <label className="block text-white/70 text-xs mb-1">Username</label>
                <input
                  type="text"
                  value={inputData.username}
                  onChange={(e) => setInputData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-900/50 text-white text-sm rounded border border-white/20 focus:outline-none focus:border-purple-400"
                  placeholder="your-username"
                />
              </div>

              <div>
                <label className="block text-white/70 text-xs mb-1">Display Name</label>
                <input
                  type="text"
                  value={inputData.displayName}
                  onChange={(e) => setInputData(prev => ({ ...prev, displayName: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-900/50 text-white text-sm rounded border border-white/20 focus:outline-none focus:border-purple-400"
                  placeholder="Your Display Name"
                />
              </div>

              <div>
                <label className="block text-white/70 text-xs mb-1">Bio</label>
                <textarea
                  value={inputData.bio}
                  onChange={(e) => setInputData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-900/50 text-white text-sm rounded border border-white/20 focus:outline-none focus:border-purple-400 resize-none"
                  rows="3"
                  placeholder="Tell people about yourself..."
                />
              </div>

              <div>
                <label className="block text-white/70 text-xs mb-1">Avatar URL</label>
                <input
                  type="url"
                  value={inputData.avatar}
                  onChange={(e) => setInputData(prev => ({ ...prev, avatar: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-900/50 text-white text-sm rounded border border-white/20 focus:outline-none focus:border-purple-400"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>

            {/* Links */}
            <div>
              <label className="block text-white/70 text-xs mb-2">Links</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {inputData.links.map((link, index) => (
                  <div key={link.id} className="bg-gray-800/30 p-3 rounded border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-white text-xs font-medium">Link {index + 1}</span>
                      <button
                        onClick={() => {
                          const newLinks = inputData.links.filter(l => l.id !== link.id);
                          setInputData(prev => ({ ...prev, links: newLinks }));
                        }}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={link.title}
                        onChange={(e) => {
                          const newLinks = inputData.links.map(l =>
                            l.id === link.id ? { ...l, title: e.target.value } : l
                          );
                          setInputData(prev => ({ ...prev, links: newLinks }));
                        }}
                        className="w-full px-2 py-1 bg-gray-900/50 text-white text-xs rounded border border-white/20 focus:outline-none focus:border-purple-400"
                        placeholder="Link Title"
                      />
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = inputData.links.map(l =>
                            l.id === link.id ? { ...l, url: e.target.value } : l
                          );
                          setInputData(prev => ({ ...prev, links: newLinks }));
                        }}
                        className="w-full px-2 py-1 bg-gray-900/50 text-white text-xs rounded border border-white/20 focus:outline-none focus:border-purple-400"
                        placeholder="https://example.com"
                      />
                      <select
                        value={link.platform}
                        onChange={(e) => {
                          const newLinks = inputData.links.map(l =>
                            l.id === link.id ? { ...l, platform: e.target.value } : l
                          );
                          setInputData(prev => ({ ...prev, links: newLinks }));
                        }}
                        className="w-full px-2 py-1 bg-gray-900/50 text-white text-xs rounded border border-white/20 focus:outline-none focus:border-purple-400"
                      >
                        <option value="website">Website</option>
                        <option value="youtube">YouTube</option>
                        <option value="instagram">Instagram</option>
                        <option value="twitter">Twitter</option>
                        <option value="github">GitHub</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="tiktok">TikTok</option>
                        <option value="facebook">Facebook</option>
                      </select>
                      <input
                        type="text"
                        value={link.description || ''}
                        onChange={(e) => {
                          const newLinks = inputData.links.map(l =>
                            l.id === link.id ? { ...l, description: e.target.value } : l
                          );
                          setInputData(prev => ({ ...prev, links: newLinks }));
                        }}
                        className="w-full px-2 py-1 bg-gray-900/50 text-white text-xs rounded border border-white/20 focus:outline-none focus:border-purple-400"
                        placeholder="Link description (optional)"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  const newLink = {
                    id: Date.now(),
                    title: 'New Link',
                    url: 'https://example.com',
                    platform: 'website',
                    active: true,
                    description: 'New link description'
                  };
                  setInputData(prev => ({ ...prev, links: [...prev.links, newLink] }));
                }}
                className="w-full mt-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors"
              >
                + Add Link
              </button>
            </div>

            <div className="text-xs text-white/50 bg-gray-800/30 p-2 rounded">
              💡 <strong>Tip:</strong> Changes apply instantly to the profile preview.
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS Panel */}
      {showCustomCSS && (
        <div className="fixed top-20 left-4 z-50 w-96 max-h-[500px]">
          <div className="demo-card-glass p-4 space-y-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">💻 Custom CSS Editor</h3>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-400 text-xs">Live Editor</span>
              </div>
            </div>

            <textarea
              value={customCSS}
              onChange={(e) => setCustomCSS(e.target.value)}
              placeholder="/* Enter your custom CSS here - Examples: */

/* Change link colors */
.demo-profile-link {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4) !important;
  border-radius: 20px !important;
  transform: skew(-2deg) !important;
}

/* Modify layout spacing */
.links-center-stack {
  gap: 2rem !important;
}

/* Custom avatar effects */
.avatar-container {
  filter: hue-rotate(45deg) !important;
}

/* Add custom animations */
@keyframes custom-bounce {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.demo-profile-link:hover {
  animation: custom-bounce 0.5s ease !important;
}"
              className="w-full h-64 bg-gray-900/50 text-white text-xs font-mono p-3 rounded border border-white/20 resize-none focus:outline-none focus:border-purple-400 leading-relaxed"
            />

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    // Quick test CSS
                    setCustomCSS(`/* 🧪 Quick Test - CSS Working! */
.demo-profile-link {
  background: red !important;
  color: white !important;
  transform: rotate(5deg) !important;
}`);
                  }}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
                >
                  Test
                </button>
                <button
                  onClick={() => {
                    // Apply sample CSS with more visible effects
                    setCustomCSS(`/* 🎨 Sample Custom Styles - Test CSS Injection */

/* Colorful gradient links */
.demo-profile-link {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1) !important;
  border-radius: 25px !important;
  transform: skew(-3deg) !important;
  transition: all 0.4s ease !important;
  border: 2px solid #fff !important;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3) !important;
}

/* Hover effects */
.demo-profile-link:hover {
  transform: skew(0deg) scale(1.08) rotate(1deg) !important;
  box-shadow: 0 15px 35px rgba(255, 107, 107, 0.4) !important;
  filter: brightness(1.1) !important;
}

/* Layout spacing */
.links-center-stack {
  gap: 2.5rem !important;
}

/* Avatar effects */
.avatar-container {
  transform: scale(1.1) !important;
  filter: hue-rotate(45deg) saturate(1.2) !important;
}

/* Profile text styling */
.profile-name {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  text-shadow: 0 0 20px rgba(255, 107, 107, 0.5) !important;
}

/* Animated background */
body {
  animation: rainbow-bg 10s ease infinite !important;
}

@keyframes rainbow-bg {
  0%, 100% { filter: hue-rotate(0deg); }
  50% { filter: hue-rotate(180deg); }
}`);
                  }}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                >
                  Sample
                </button>
                <button
                  onClick={() => setCustomCSS('')}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                >
                  Clear
                </button>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="text-white/60">
                  {customCSS.length > 0 ? `${customCSS.length} chars` : 'No custom CSS'}
                </span>
                <div className={`w-2 h-2 rounded-full ${customCSS.length > 0 ? 'bg-green-400' : 'bg-gray-400'}`}></div>
              </div>
            </div>

            <div className="text-xs text-white/50 bg-gray-800/30 p-2 rounded">
              💡 <strong>Tips:</strong> Use <code>!important</code> to override existing styles.
              Changes apply automatically as you type.
            </div>
          </div>
        </div>
      )}




      {/* Custom Confirm Dialog */}
      {showConfirmDialog && selectedLink && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-md w-full mx-4"
          >
            {/* Dialog Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Are you sure?</h3>
              <button
                onClick={handleCancelVisit}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Dialog Content */}
            <div className="mb-6">
              <p className="text-white/80 mb-3">You are going to visit</p>
              <div className="bg-white/10 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <BrandIcon
                      platform={selectedLink.platform}
                      className="w-5 h-5 text-white"
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{selectedLink.title}</h4>
                    <p className="text-white/60 text-sm">{selectedLink.platform}</p>
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded px-3 py-2">
                  <p className="text-white/70 font-mono text-sm break-all">{selectedLink.url}</p>
                </div>
              </div>
              <p className="text-white/60 text-sm">
                This link will open in a new tab. This is demo mode.
              </p>
            </div>

            {/* Dialog Actions */}
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirmVisit}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                Visit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancelVisit}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Demo Particles Background */}
      <div className="demo-particles fixed inset-0 pointer-events-none opacity-30"></div>
    </div>
  );
};

// Add CSS for icon-grid layout
const iconGridStyles = `
  .links-icon-grid {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
    padding: 0;
  }

  .links-icon-grid .demo-profile-link {
    padding: 12px;
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex-shrink: 0;
  }

  .links-icon-grid .link-content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .links-icon-grid .platform-icon-large {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Responsive icon sizes */
  @media (max-width: 480px) {
    .links-icon-grid {
      gap: 10px;
      max-width: 280px;
      justify-content: center;
    }

    .links-icon-grid .demo-profile-link {
      width: 44px;
      height: 44px;
      padding: 10px;
    }
  }

  /* Sparkle effect for profile name */
  .profile-name {
    position: relative;
    overflow: visible;
    display: inline-block;
  }

  .profile-name .sparkle-overlay {
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
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = iconGridStyles;
  document.head.appendChild(styleElement);
}

export default DemoProfilePage;
