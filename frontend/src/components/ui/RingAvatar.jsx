import React from 'react';

const RingAvatar = ({ 
  user, 
  size = 'md',
  ringSettings = {},
  className = '',
  onClick = null
}) => {
  // Size configurations
  const sizeConfig = {
    sm: { avatar: 40, ring: 4 },
    md: { avatar: 60, ring: 6 },
    lg: { avatar: 80, ring: 8 },
    xl: { avatar: 120, ring: 10 },
    '2xl': { avatar: 160, ring: 12 }
  };

  const config = sizeConfig[size] || sizeConfig.md;
  
  // Default ring settings
  const defaultSettings = {
    ringColor: 'gradient',
    animation: 'rotate',
    thickness: 4,
    speed: 'normal',
    customGradient: {
      from: '#8b5cf6',
      to: '#ec4899'
    }
  };

  const settings = { ...defaultSettings, ...ringSettings };

  // Generate ring styles
  const getRingStyles = () => {
    const ringSize = config.avatar + (settings.thickness * 2);
    
    const baseStyles = {
      width: `${ringSize}px`,
      height: `${ringSize}px`,
      borderRadius: '50%',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };

    // Color styles
    let colorStyles = {};
    switch (settings.ringColor) {
      case 'gradient':
        colorStyles = {
          background: `conic-gradient(from 0deg, #8b5cf6, #ec4899, #8b5cf6)`,
          padding: `${settings.thickness}px`
        };
        break;
      case 'rainbow':
        colorStyles = {
          background: `conic-gradient(from 0deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ef4444)`,
          padding: `${settings.thickness}px`
        };
        break;
      case 'pulse':
        colorStyles = {
          background: '#60a5fa',
          padding: `${settings.thickness}px`,
          boxShadow: `0 0 20px rgba(96, 165, 250, 0.5)`
        };
        break;
      case 'glow':
        colorStyles = {
          background: '#fbbf24',
          padding: `${settings.thickness}px`,
          boxShadow: `0 0 30px rgba(251, 191, 36, 0.7)`
        };
        break;
      case 'custom':
        colorStyles = {
          background: `conic-gradient(from 0deg, ${settings.customGradient.from}, ${settings.customGradient.to}, ${settings.customGradient.from})`,
          padding: `${settings.thickness}px`
        };
        break;
      case 'image':
        if (settings.decorationImage || settings.imageRingUrl) {
          colorStyles = {
            backgroundImage: `url(${settings.decorationImage || settings.imageRingUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: `${settings.thickness}px`
          };
        } else {
          colorStyles = {
            background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
            padding: `${settings.thickness}px`
          };
        }
        break;
      default:
        colorStyles = {
          background: '#6b7280',
          padding: `${settings.thickness}px`
        };
    }

    // Animation styles
    let animationStyles = {};
    if (settings.animation !== 'static') {
      const duration = {
        slow: '3s',
        normal: '2s',
        fast: '1s'
      }[settings.speed] || '2s';
      
      switch (settings.animation) {
        case 'rotate':
          animationStyles = {
            animation: `ringRotate ${duration} linear infinite`
          };
          break;
        case 'pulse':
          animationStyles = {
            animation: `ringPulse ${duration} ease-in-out infinite`
          };
          break;
        case 'bounce':
          animationStyles = {
            animation: `ringBounce ${duration} ease-in-out infinite`
          };
          break;
      }
    }

    return { ...baseStyles, ...colorStyles, ...animationStyles };
  };

  // Generate overlay ring styles
  const getOverlayRingStyles = () => {
    if (!ringSettings || ringSettings.ringPosition !== 'overlay') return {};

    let overlayStyles = {
      opacity: ringSettings.overlayOpacity || 0.7
    };

    // Animation styles
    if (ringSettings.animation !== 'static') {
      const speeds = [
        { id: 'slow', duration: '3s' },
        { id: 'normal', duration: '2s' },
        { id: 'fast', duration: '1s' }
      ];
      const duration = speeds.find(s => s.id === ringSettings.speed)?.duration || '2s';

      switch (ringSettings.animation) {
        case 'rotate':
          overlayStyles.animation = `ringRotate ${duration} linear infinite`;
          break;
        case 'pulse':
          overlayStyles.animation = `ringPulse ${duration} ease-in-out infinite`;
          break;
        case 'bounce':
          overlayStyles.animation = `ringBounce ${duration} ease-in-out infinite`;
          break;
      }
    }

    // Color/pattern styles
    switch (ringSettings.ringColor) {
      case 'gradient':
        overlayStyles.background = `conic-gradient(from 0deg, #8b5cf6, #ec4899, #8b5cf6)`;
        break;
      case 'rainbow':
        overlayStyles.background = `conic-gradient(from 0deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ef4444)`;
        break;
      case 'pulse':
        overlayStyles.background = '#60a5fa';
        overlayStyles.boxShadow = `0 0 20px rgba(96, 165, 250, 0.5)`;
        break;
      case 'glow':
        overlayStyles.background = '#fbbf24';
        overlayStyles.boxShadow = `0 0 30px rgba(251, 191, 36, 0.7)`;
        break;
      case 'custom':
        overlayStyles.background = `conic-gradient(from 0deg, ${ringSettings.customGradient?.from || '#8b5cf6'}, ${ringSettings.customGradient?.to || '#ec4899'}, ${ringSettings.customGradient?.from || '#8b5cf6'})`;
        break;
      case 'image':
        if (ringSettings.decorationImage || ringSettings.imageRingUrl) {
          overlayStyles.backgroundImage = `url(${ringSettings.decorationImage || ringSettings.imageRingUrl})`;
          overlayStyles.backgroundSize = 'cover';
          overlayStyles.backgroundPosition = 'center';
          overlayStyles.backgroundRepeat = 'no-repeat';
        } else {
          overlayStyles.background = 'linear-gradient(45deg, #6366f1, #8b5cf6)';
        }
        break;
      default:
        overlayStyles.background = '#6b7280';
    }

    return overlayStyles;
  };

  // Get avatar URL
  const getAvatarUrl = () => {
    if (!user) return null;
    if (user.avatar_url) return user.avatar_url;
    if (user.avatar) return user.avatar;
    return null;
  };

  // Get user initials
  const getUserInitials = () => {
    if (!user) return 'U';
    const displayName = user.displayName || user.display_name;
    if (displayName && displayName.length > 0) return displayName.charAt(0).toUpperCase();
    if (user.username && user.username.length > 0) return user.username.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <>
      {ringSettings?.ringPosition === 'overlay' ? (
        /* Overlay Mode */
        <div
          className={`ring-avatar-container relative ${className} ${onClick ? 'cursor-pointer' : ''}`}
          onClick={onClick}
        >
          {/* Avatar Base */}
          <div
            className="rounded-full overflow-hidden bg-transparent flex items-center justify-center"
            style={{
              width: `${config.avatar}px`,
              height: `${config.avatar}px`
            }}
          >
            {getAvatarUrl() ? (
              <img
                src={getAvatarUrl()}
                alt={user?.displayName || user?.display_name || user?.username || 'User'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}

            {/* Fallback initials */}
            <div
              className="w-full h-full flex items-center justify-center text-white font-bold"
              style={{
                fontSize: `${config.avatar / 3}px`,
                display: getAvatarUrl() ? 'none' : 'flex'
              }}
            >
              {getUserInitials()}
            </div>
          </div>

          {/* Overlay Ring */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={getOverlayRingStyles()}
          />
        </div>
      ) : (
        /* Around Mode */
        <div
          className={`ring-avatar-container ${className} ${onClick ? 'cursor-pointer' : ''}`}
          onClick={onClick}
          style={getRingStyles()}
        >
          {/* Avatar */}
          <div
            className="rounded-full overflow-hidden bg-transparent flex items-center justify-center"
            style={{
              width: `${config.avatar}px`,
              height: `${config.avatar}px`
            }}
          >
            {getAvatarUrl() ? (
              <img
                src={getAvatarUrl()}
                alt={user?.displayName || user?.display_name || user?.username || 'User'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}

            {/* Fallback initials */}
            <div
              className="w-full h-full flex items-center justify-center text-white font-bold"
              style={{
                fontSize: `${config.avatar / 3}px`,
                display: getAvatarUrl() ? 'none' : 'flex'
              }}
            >
              {getUserInitials()}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes ringPulse {
          0%, 100% { 
            transform: scale(1); 
            opacity: 1; 
          }
          50% { 
            transform: scale(1.05); 
            opacity: 0.8; 
          }
        }
        
        @keyframes ringBounce {
          0%, 100% { 
            transform: translateY(0); 
          }
          50% { 
            transform: translateY(-5px); 
          }
        }
        
        .ring-avatar-container {
          transition: transform 0.2s ease;
        }
        
        .ring-avatar-container:hover {
          transform: scale(1.02);
        }
      `}</style>
    </>
  );
};

export default RingAvatar;
