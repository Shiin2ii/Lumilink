// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Theme Configuration
export const THEMES = {
  default: {
    id: 'default',
    name: 'Default',
    colors: {
      primary: '#3b82f6',
      secondary: '#1e40af',
      accent: '#fbbf24',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #111827 50%, #1e3a8a 100%)'
    }
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    colors: {
      primary: '#f59e0b',
      secondary: '#dc2626',
      accent: '#fbbf24',
      background: 'linear-gradient(135deg, #dc2626 0%, #f59e0b 50%, #dc2626 100%)'
    }
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #059669 100%)'
    }
  },
  purple: {
    id: 'purple',
    name: 'Purple',
    colors: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#a78bfa',
      background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 50%, #7c3aed 100%)'
    }
  }
};

// Social Media Platforms
export const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: '📸', baseUrl: 'https://instagram.com/' },
  { id: 'twitter', name: 'Twitter', icon: '🐦', baseUrl: 'https://twitter.com/' },
  { id: 'youtube', name: 'YouTube', icon: '🎥', baseUrl: 'https://youtube.com/' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', baseUrl: 'https://tiktok.com/@' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', baseUrl: 'https://linkedin.com/in/' },
  { id: 'github', name: 'GitHub', icon: '💻', baseUrl: 'https://github.com/' },
  { id: 'discord', name: 'Discord', icon: '🎮', baseUrl: 'https://discord.gg/' },
  { id: 'twitch', name: 'Twitch', icon: '🟣', baseUrl: 'https://twitch.tv/' },
  { id: 'spotify', name: 'Spotify', icon: '🎶', baseUrl: 'https://open.spotify.com/user/' },
  { id: 'website', name: 'Website', icon: '🌐', baseUrl: '' }
];

// File Upload Configuration
export const FILE_UPLOAD = {
  maxSize: 25 * 1024 * 1024, // 25MB
  maxFiles: 10,
  acceptedTypes: {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    'video/*': ['.mp4', '.mov', '.avi', '.webm'],
    'application/pdf': ['.pdf'],
    'text/*': ['.txt', '.md'],
    'application/zip': ['.zip'],
    'application/x-rar-compressed': ['.rar']
  }
};

// Animation Variants
export const ANIMATION_VARIANTS = {
  fadeInUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  staggerContainer: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  linkCardHover: {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PROFILE: 'lumilink_user_profile',
  USER_LINKS: 'lumilink_user_links',
  USER_THEME: 'lumilink_user_theme',
  AUTH_TOKEN: 'lumilink_auth_token'
};

// Default Profile Data
export const DEFAULT_PROFILE = {
  username: '',
  displayName: '',
  bio: '',
  avatar: 'https://via.placeholder.com/150',
  theme: 'default',
  socialLinks: [],
  isPublic: true,
  customDomain: ''
};

// Link Categories
export const LINK_CATEGORIES = [
  { id: 'social', name: 'Social Media', icon: '👥' },
  { id: 'work', name: 'Work & Business', icon: '💼' },
  { id: 'creative', name: 'Creative & Portfolio', icon: '🎨' },
  { id: 'shopping', name: 'Shopping & Store', icon: '🛍️' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'education', name: 'Education & Learning', icon: '📚' },
  { id: 'other', name: 'Other', icon: '📎' }
];
