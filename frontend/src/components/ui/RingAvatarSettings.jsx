import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from './Button';
import Modal from './Modal';

const RingAvatarSettings = ({ 
  isOpen, 
  onClose, 
  user, 
  onApply,
  initialSettings = {}
}) => {
  const [settings, setSettings] = useState({
    ringColor: 'gradient',
    animation: 'rotate',
    thickness: 4,
    speed: 'normal',
    customColor: '#8b5cf6',
    customGradient: {
      from: '#8b5cf6',
      to: '#ec4899'
    },
    imageRing: null,
    imageRingUrl: '',
    ringPosition: 'around', // 'around' or 'overlay'
    overlayOpacity: 0.7,
    ...initialSettings
  });

  const [imagePreview, setImagePreview] = useState(null);

  // Ring color options
  const ringColors = [
    { id: 'gradient', name: 'Gradient', preview: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'rainbow', name: 'Rainbow', preview: 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500' },
    { id: 'pulse', name: 'Pulse', preview: 'bg-gradient-to-r from-blue-400 to-cyan-400' },
    { id: 'glow', name: 'Glow', preview: 'bg-gradient-to-r from-yellow-400 to-orange-500' },
    { id: 'custom', name: 'Custom', preview: 'bg-gray-600' },
    { id: 'image', name: 'Image Ring', preview: 'bg-gradient-to-r from-indigo-500 to-purple-500' }
  ];

  // Animation options
  const animations = [
    { id: 'rotate', name: 'Rotate' },
    { id: 'pulse', name: 'Pulse' },
    { id: 'bounce', name: 'Bounce' },
    { id: 'static', name: 'Static' }
  ];

  // Speed options
  const speeds = [
    { id: 'slow', name: 'Slow', duration: '3s' },
    { id: 'normal', name: 'Normal', duration: '2s' },
    { id: 'fast', name: 'Fast', duration: '1s' }
  ];

  // Generate ring styles based on settings
  const getRingStyles = () => {
    const isOverlay = settings.ringPosition === 'overlay';
    const ringSize = isOverlay ? 120 : 120 + (settings.thickness * 2);

    const baseStyles = {
      width: `${ringSize}px`,
      height: `${ringSize}px`,
      borderRadius: '50%',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };

    // Color styles - different approach for overlay vs around
    let colorStyles = {};

    if (isOverlay) {
      // Overlay mode - ring appears on top of avatar
      colorStyles = {
        padding: 0,
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '50%',
          opacity: settings.overlayOpacity,
          pointerEvents: 'none'
        }
      };
    } else {
      // Around mode - traditional ring around avatar
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
          if (settings.imageRingUrl || imagePreview) {
            colorStyles = {
              backgroundImage: `url(${imagePreview || settings.imageRingUrl})`,
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
    }

    // Animation styles
    let animationStyles = {};
    if (settings.animation !== 'static') {
      const duration = speeds.find(s => s.id === settings.speed)?.duration || '2s';

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
    let overlayStyles = {
      opacity: settings.overlayOpacity
    };

    // Animation styles
    if (settings.animation !== 'static') {
      const duration = speeds.find(s => s.id === settings.speed)?.duration || '2s';

      switch (settings.animation) {
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
    switch (settings.ringColor) {
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
        overlayStyles.background = `conic-gradient(from 0deg, ${settings.customGradient.from}, ${settings.customGradient.to}, ${settings.customGradient.from})`;
        break;
      case 'image':
        if (settings.imageRingUrl || imagePreview) {
          overlayStyles.backgroundImage = `url(${imagePreview || settings.imageRingUrl})`;
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

  // Handle image upload for ring
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setImagePreview(imageUrl);
        setSettings(prev => ({
          ...prev,
          imageRing: file,
          imageRingUrl: imageUrl,
          ringColor: 'image'
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = () => {
    onApply(settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ring Avatar Settings" size="lg">
      <div className="space-y-6">
        {/* Avatar Preview */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            {settings.ringPosition === 'overlay' ? (
              /* Overlay Mode */
              <div className="relative w-[120px] h-[120px]">
                {/* Avatar Base */}
                <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  {getAvatarUrl() ? (
                    <img
                      src={getAvatarUrl()}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}

                  {/* Fallback initials */}
                  <div
                    className="w-full h-full flex items-center justify-center text-white text-3xl font-bold rounded-full"
                    style={{
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
                className="flex items-center justify-center"
                style={getRingStyles()}
              >
                {/* Avatar - Circular */}
                <div className="w-[120px] h-[120px] rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center relative">
                  {getAvatarUrl() ? (
                    <img
                      src={getAvatarUrl()}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}

                  {/* Fallback initials */}
                  <div
                    className="w-full h-full flex items-center justify-center text-white text-3xl font-bold rounded-full"
                    style={{
                      display: getAvatarUrl() ? 'none' : 'flex'
                    }}
                  >
                    {getUserInitials()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Info */}
        <div className="text-center mb-6">
          <h3 className="text-white font-medium text-lg mb-1">Ring Avatar</h3>
          <p className="text-gray-400 text-sm">Hiệu ứng ring xung quanh avatar</p>
        </div>

        {/* Ring Color */}
        <div>
          <label className="block text-white font-medium mb-3">Ring Color</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ringColors.map((color) => (
              <button
                key={color.id}
                onClick={() => {
                  if (color.id !== 'image') {
                    setSettings(prev => ({ ...prev, ringColor: color.id }));
                  }
                }}
                className={`p-3 rounded-lg border transition-all ${
                  settings.ringColor === color.id
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-gray-600 hover:border-gray-500'
                } ${color.id === 'image' ? 'relative overflow-hidden' : ''}`}
              >
                {color.id === 'image' ? (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      id="image-ring-upload"
                    />
                    <div className={`w-full h-8 rounded mb-2 flex items-center justify-center border-2 border-dashed ${
                      imagePreview ? 'border-green-500 bg-cover bg-center' : 'border-gray-500'
                    }`} style={imagePreview ? { backgroundImage: `url(${imagePreview})` } : {}}>
                      {!imagePreview && (
                        <div className="text-center">
                          <span className="text-white text-lg">📷</span>
                        </div>
                      )}
                      {imagePreview && (
                        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-1 rounded-bl">
                          ✓
                        </div>
                      )}
                    </div>
                    <span className="text-white text-sm">{color.name}</span>
                  </div>
                ) : (
                  <>
                    <div className={`w-full h-8 rounded mb-2 ${color.preview}`}></div>
                    <span className="text-white text-sm">{color.name}</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Color (if custom is selected) */}
        {settings.ringColor === 'custom' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">From Color</label>
              <input
                type="color"
                value={settings.customGradient.from}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  customGradient: { ...prev.customGradient, from: e.target.value }
                }))}
                className="w-full h-10 rounded border border-gray-600 bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">To Color</label>
              <input
                type="color"
                value={settings.customGradient.to}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  customGradient: { ...prev.customGradient, to: e.target.value }
                }))}
                className="w-full h-10 rounded border border-gray-600 bg-gray-700"
              />
            </div>
          </div>
        )}

        {/* Image Upload Section */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3">🖼️ Upload Image for Ring</h4>

          {imagePreview ? (
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="flex items-center space-x-4">
                <div
                  className="w-16 h-16 rounded-lg bg-cover bg-center border border-green-500"
                  style={{ backgroundImage: `url(${imagePreview})` }}
                ></div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">✅ Image uploaded successfully!</p>
                  <p className="text-gray-400 text-xs">This image will be used as your ring pattern</p>
                </div>
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setSettings(prev => ({
                      ...prev,
                      imageRing: null,
                      imageRingUrl: '',
                      ringColor: 'gradient'
                    }));
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Remove
                </button>
              </div>

              {/* Apply Image Ring Button */}
              <button
                onClick={() => setSettings(prev => ({ ...prev, ringColor: 'image' }))}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  settings.ringColor === 'image'
                    ? 'bg-green-500 text-white'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                }`}
              >
                {settings.ringColor === 'image' ? '✅ Image Ring Active' : '🎨 Use as Ring Pattern'}
              </button>

              {/* Image Tips */}
              <div className="text-xs text-gray-400">
                <p>💡 Tips for best results:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Use high contrast images for better visibility</li>
                  <li>Square images work best for ring patterns</li>
                  <li>Avoid very detailed images as they may look cluttered</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Upload Area */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  id="main-image-upload"
                />
                <div className="border-2 border-dashed border-gray-600 hover:border-yellow-500 rounded-lg p-8 text-center transition-colors">
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-white font-medium mb-1">Click to upload image</p>
                  <p className="text-gray-400 text-sm">or drag and drop</p>
                  <p className="text-gray-500 text-xs mt-2">Supported: JPG, PNG, GIF (max 5MB)</p>
                </div>
              </div>

              {/* Sample Images */}
              <div>
                <p className="text-white text-sm font-medium mb-2">Or try these sample patterns:</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=100&h=100&fit=crop',
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop',
                    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=100&h=100&fit=crop'
                  ].map((url, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setImagePreview(url);
                        setSettings(prev => ({
                          ...prev,
                          imageRingUrl: url,
                          ringColor: 'image'
                        }));
                      }}
                      className="w-full h-16 bg-cover bg-center rounded border border-gray-600 hover:border-yellow-500 transition-colors"
                      style={{ backgroundImage: `url(${url})` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ring Position */}
        <div>
          <label className="block text-white font-medium mb-3">Ring Position</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSettings(prev => ({ ...prev, ringPosition: 'around' }))}
              className={`p-4 rounded-lg border transition-all ${
                settings.ringPosition === 'around'
                  ? 'border-yellow-500 bg-yellow-500/10 text-white'
                  : 'border-gray-600 hover:border-gray-500 text-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">⭕</div>
                <div className="font-medium">Around</div>
                <div className="text-xs text-gray-400">Ring around avatar</div>
              </div>
            </button>
            <button
              onClick={() => setSettings(prev => ({ ...prev, ringPosition: 'overlay' }))}
              className={`p-4 rounded-lg border transition-all ${
                settings.ringPosition === 'overlay'
                  ? 'border-yellow-500 bg-yellow-500/10 text-white'
                  : 'border-gray-600 hover:border-gray-500 text-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">🎭</div>
                <div className="font-medium">Overlay</div>
                <div className="text-xs text-gray-400">Ring over avatar</div>
              </div>
            </button>
          </div>
        </div>

        {/* Overlay Opacity (if overlay mode) */}
        {settings.ringPosition === 'overlay' && (
          <div>
            <label className="block text-white font-medium mb-3">
              Overlay Opacity: {Math.round(settings.overlayOpacity * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={settings.overlayOpacity}
              onChange={(e) => setSettings(prev => ({ ...prev, overlayOpacity: parseFloat(e.target.value) }))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>10%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Animation */}
        <div>
          <label className="block text-white font-medium mb-3">Animation</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {animations.map((animation) => (
              <button
                key={animation.id}
                onClick={() => setSettings(prev => ({ ...prev, animation: animation.id }))}
                className={`p-3 rounded-lg border transition-all ${
                  settings.animation === animation.id
                    ? 'border-yellow-500 bg-yellow-500/10 text-white'
                    : 'border-gray-600 hover:border-gray-500 text-gray-300'
                }`}
              >
                {animation.name}
              </button>
            ))}
          </div>
        </div>

        {/* Thickness */}
        <div>
          <label className="block text-white font-medium mb-3">
            Thickness: {settings.thickness}px
          </label>
          <input
            type="range"
            min="2"
            max="8"
            step="1"
            value={settings.thickness}
            onChange={(e) => setSettings(prev => ({ ...prev, thickness: parseInt(e.target.value) }))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Speed (if not static) */}
        {settings.animation !== 'static' && (
          <div>
            <label className="block text-white font-medium mb-3">Animation Speed</label>
            <div className="grid grid-cols-3 gap-3">
              {speeds.map((speed) => (
                <button
                  key={speed.id}
                  onClick={() => setSettings(prev => ({ ...prev, speed: speed.id }))}
                  className={`p-3 rounded-lg border transition-all ${
                    settings.speed === speed.id
                      ? 'border-yellow-500 bg-yellow-500/10 text-white'
                      : 'border-gray-600 hover:border-gray-500 text-gray-300'
                  }`}
                >
                  {speed.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
          >
            Áp Dụng
          </Button>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #eab308;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #eab308;
          cursor: pointer;
          border: none;
        }
        
        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes ringPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
            box-shadow: 0 0 30px rgba(139, 92, 246, 0.6);
          }
        }

        @keyframes ringBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </Modal>
  );
};

export default RingAvatarSettings;
