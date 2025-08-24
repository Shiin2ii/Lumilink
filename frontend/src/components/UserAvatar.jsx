/**
 * =============================================================================
 * USER AVATAR COMPONENT
 * =============================================================================
 * Optimized avatar component with fallback options
 */

import React from 'react';
import { UserIcon } from '@heroicons/react/24/solid';

const UserAvatar = ({ 
  user, 
  size = 'md', 
  className = '',
  showOnlineStatus = false 
}) => {
  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8', 
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
    '2xl': 'h-20 w-20'
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-sm', 
    lg: 'text-base',
    xl: 'text-lg',
    '2xl': 'text-xl'
  };

  const iconSizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6', 
    xl: 'h-8 w-8',
    '2xl': 'h-10 w-10'
  };

  // Get user initials
  const getInitials = (user) => {
    if (user?.display_name) {
      return user.display_name.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Get avatar gradient background based on user
  const getAvatarGradient = (user) => {
    const gradients = [
      'bg-gradient-to-br from-blue-400 to-blue-600',
      'bg-gradient-to-br from-green-400 to-green-600',
      'bg-gradient-to-br from-purple-400 to-purple-600',
      'bg-gradient-to-br from-pink-400 to-pink-600',
      'bg-gradient-to-br from-indigo-400 to-indigo-600',
      'bg-gradient-to-br from-yellow-400 to-orange-500',
      'bg-gradient-to-br from-red-400 to-red-600',
      'bg-gradient-to-br from-teal-400 to-teal-600',
      'bg-gradient-to-br from-cyan-400 to-blue-500',
      'bg-gradient-to-br from-violet-400 to-purple-600',
      'bg-gradient-to-br from-emerald-400 to-green-600',
      'bg-gradient-to-br from-rose-400 to-pink-600'
    ];

    const name = user?.display_name || user?.username || 'User';
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  const baseClasses = `${sizeClasses[size]} rounded-full flex items-center justify-center relative ${className}`;

  // If user has avatar URL, show image
  if (user?.avatar_url) {
    return (
      <div className={`${baseClasses} overflow-hidden`}>
        <img 
          src={user.avatar_url} 
          alt={user.display_name || user.username}
          className="h-full w-full object-cover"
          onError={(e) => {
            // Fallback to initials if image fails to load
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        {/* Fallback initials (hidden by default) */}
        <div
          className={`${baseClasses} ${getAvatarGradient(user)} text-white font-medium ${textSizeClasses[size]} absolute inset-0`}
          style={{ display: 'none' }}
        >
          {getInitials(user)}
        </div>
        
        {/* Online status indicator */}
        {showOnlineStatus && (
          <div className="absolute -bottom-0 -right-0 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></div>
        )}
      </div>
    );
  }

  // If no avatar, show initials with gradient background
  if (user?.display_name || user?.username) {
    return (
      <div className={`${baseClasses} ${getAvatarGradient(user)} text-white font-semibold ${textSizeClasses[size]} shadow-lg`}>
        {getInitials(user)}

        {/* Online status indicator */}
        {showOnlineStatus && (
          <div className="absolute -bottom-0 -right-0 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></div>
        )}
      </div>
    );
  }

  // Default fallback with user icon and gradient
  return (
    <div className={`${baseClasses} bg-gradient-to-br from-gray-400 to-gray-600 text-white shadow-lg`}>
      <UserIcon className={iconSizeClasses[size]} />

      {/* Online status indicator */}
      {showOnlineStatus && (
        <div className="absolute -bottom-0 -right-0 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></div>
      )}
    </div>
  );
};

export default UserAvatar;
