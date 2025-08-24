import React from 'react';

/**
 * Badge Icon Components
 * Custom SVG icons for different badge types
 */

export const StarBadgeIcon = ({ className = "w-12 h-12", color = "#fbbf24" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <path
      d="M50 10 L61 35 L90 35 L69 54 L80 80 L50 65 L20 80 L31 54 L10 35 L39 35 Z"
      fill="url(#starGradient)"
      filter="url(#glow)"
      stroke="#fbbf24"
      strokeWidth="2"
    />
    <circle cx="50" cy="45" r="8" fill="#fff" opacity="0.3" />
  </svg>
);

export const TrophyBadgeIcon = ({ className = "w-12 h-12", color = "#f59e0b" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="trophyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    {/* Trophy Cup */}
    <path
      d="M25 25 L75 25 L70 55 L30 55 Z"
      fill="url(#trophyGradient)"
      stroke="#d97706"
      strokeWidth="2"
    />
    {/* Trophy Handles */}
    <path d="M20 30 Q15 35 20 40 L25 35" fill="url(#trophyGradient)" />
    <path d="M80 30 Q85 35 80 40 L75 35" fill="url(#trophyGradient)" />
    {/* Trophy Base */}
    <rect x="35" y="55" width="30" height="8" fill="url(#trophyGradient)" />
    <rect x="30" y="63" width="40" height="12" fill="url(#trophyGradient)" />
    {/* Shine */}
    <ellipse cx="45" cy="35" rx="8" ry="12" fill="#fff" opacity="0.3" />
  </svg>
);

export const CrownBadgeIcon = ({ className = "w-12 h-12", color = "#8b5cf6" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="crownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
    {/* Crown Base */}
    <path
      d="M15 60 L85 60 L80 75 L20 75 Z"
      fill="url(#crownGradient)"
      stroke="#7c3aed"
      strokeWidth="2"
    />
    {/* Crown Points */}
    <path d="M15 60 L25 30 L35 50 L50 25 L65 50 L75 30 L85 60" fill="url(#crownGradient)" />
    {/* Gems */}
    <circle cx="30" cy="40" r="3" fill="#ef4444" />
    <circle cx="50" cy="35" r="4" fill="#3b82f6" />
    <circle cx="70" cy="40" r="3" fill="#10b981" />
    {/* Shine */}
    <ellipse cx="45" cy="45" rx="6" ry="10" fill="#fff" opacity="0.3" />
  </svg>
);

export const ShieldBadgeIcon = ({ className = "w-12 h-12", color = "#10b981" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    {/* Shield Shape */}
    <path
      d="M50 10 L20 25 L20 55 Q20 75 50 85 Q80 75 80 55 L80 25 Z"
      fill="url(#shieldGradient)"
      stroke="#059669"
      strokeWidth="2"
    />
    {/* Shield Pattern */}
    <path d="M50 15 L25 28 L25 52 Q25 68 50 75 Q75 68 75 52 L75 28 Z" fill="#fff" opacity="0.1" />
    {/* Center Emblem */}
    <circle cx="50" cy="45" r="12" fill="#fff" opacity="0.2" />
    <path d="M45 40 L50 50 L60 35" stroke="#fff" strokeWidth="3" fill="none" />
  </svg>
);

export const DiamondBadgeIcon = ({ className = "w-12 h-12", color = "#06b6d4" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} />
        <stop offset="50%" stopColor="#0891b2" />
        <stop offset="100%" stopColor="#0e7490" />
      </linearGradient>
    </defs>
    {/* Diamond Shape */}
    <path
      d="M50 15 L70 35 L50 85 L30 35 Z"
      fill="url(#diamondGradient)"
      stroke="#0891b2"
      strokeWidth="2"
    />
    {/* Diamond Facets */}
    <path d="M50 15 L60 35 L50 50 L40 35 Z" fill="#fff" opacity="0.3" />
    <path d="M30 35 L50 50 L50 85" stroke="#0e7490" strokeWidth="1" opacity="0.5" />
    <path d="M70 35 L50 50 L50 85" stroke="#0e7490" strokeWidth="1" opacity="0.5" />
    {/* Sparkles */}
    <circle cx="40" cy="25" r="2" fill="#fff" opacity="0.8" />
    <circle cx="60" cy="30" r="1.5" fill="#fff" opacity="0.6" />
    <circle cx="35" cy="45" r="1" fill="#fff" opacity="0.7" />
  </svg>
);

export const FireBadgeIcon = ({ className = "w-12 h-12", color = "#ef4444" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="fireGradient" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#dc2626" />
        <stop offset="50%" stopColor={color} />
        <stop offset="100%" stopColor="#f97316" />
      </linearGradient>
    </defs>
    {/* Flame Shape */}
    <path
      d="M50 85 Q30 70 35 50 Q40 30 50 35 Q55 20 65 30 Q75 40 70 55 Q75 70 50 85"
      fill="url(#fireGradient)"
      stroke="#dc2626"
      strokeWidth="1"
    />
    {/* Inner Flame */}
    <path
      d="M50 75 Q40 65 42 50 Q45 40 50 45 Q52 35 58 42 Q65 48 62 58 Q65 65 50 75"
      fill="#fbbf24"
      opacity="0.8"
    />
    {/* Core */}
    <ellipse cx="50" cy="60" rx="8" ry="12" fill="#fff" opacity="0.4" />
  </svg>
);

// Badge Icon Mapper
export const getBadgeIcon = (iconName, rarity = 'common', size = 'md') => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const rarityColors = {
    common: '#6b7280',
    uncommon: '#10b981',
    rare: '#3b82f6',
    epic: '#8b5cf6',
    legendary: '#f59e0b'
  };

  const iconComponents = {
    star: StarBadgeIcon,
    trophy: TrophyBadgeIcon,
    crown: CrownBadgeIcon,
    shield: ShieldBadgeIcon,
    diamond: DiamondBadgeIcon,
    fire: FireBadgeIcon
  };

  const IconComponent = iconComponents[iconName] || StarBadgeIcon;
  const color = rarityColors[rarity] || rarityColors.common;
  const className = sizeClasses[size] || sizeClasses.md;

  return <IconComponent className={className} color={color} />;
};

export default {
  StarBadgeIcon,
  TrophyBadgeIcon,
  CrownBadgeIcon,
  ShieldBadgeIcon,
  DiamondBadgeIcon,
  FireBadgeIcon,
  getBadgeIcon
};
