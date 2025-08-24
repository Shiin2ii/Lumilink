import React, { useState } from 'react';
import { PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';
import accountApi from '../../services/accountApi';
import AvatarCropper from './AvatarCropper';

const Avatar = ({
  user,
  size = 'md',
  showUpload = false,
  showRemove = false,
  onUpload = null,
  onRemove = null,
  isUploading = false,
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Size configurations
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-2xl',
    '2xl': 'w-24 h-24 text-3xl'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6',
    '2xl': 'h-7 w-7'
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create preview URL for cropper
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setShowCropper(true);
    }
    // Reset input value to allow selecting same file again
    event.target.value = '';
  };

  const handleCropComplete = async (croppedBlob) => {
    if (croppedBlob && onUpload) {
      // Convert blob to file
      const croppedFile = new File([croppedBlob], 'avatar.jpg', {
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      await onUpload(croppedFile);
    }
    // Cleanup
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
      setSelectedImage(null);
    }
  };

  const handleCropperClose = () => {
    setShowCropper(false);
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
      setSelectedImage(null);
    }
  };

  const getInitials = () => {
    const displayName = user?.displayName || user?.display_name;
    if (displayName) {
      return displayName.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const avatarPath = user?.avatar_url || user?.avatar;
  const avatarUrl = avatarPath ? accountApi.getAvatarUrl(avatarPath) : null;
  const showImage = avatarUrl && !imageError;

  return (
    <div className={`${sizeClasses[size]} bg-transparent rounded-full flex items-center justify-center relative overflow-hidden ${showUpload ? 'group cursor-pointer' : ''} ${className}`}>
      {/* Avatar Image */}
      {showImage && (
        <img
          src={avatarUrl}
          alt={`${user?.displayName || user?.display_name || user?.username || 'User'}'s avatar`}
          className="w-full h-full rounded-full object-cover"
          onError={handleImageError}
          onLoad={() => setImageError(false)}
        />
      )}

      {/* Fallback Initials */}
      {!showImage && (
        <span className="text-white font-bold flex items-center justify-center w-full h-full">
          {getInitials()}
        </span>
      )}

      {/* Upload/Remove Overlay */}
      {(showUpload || (showRemove && (user?.avatar_url || user?.avatar))) && (
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {showUpload && (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              {isUploading ? (
                <div className="animate-spin rounded-full border-b-2 border-white" style={{ width: iconSizes[size].split(' ')[0].replace('h-', '').replace('w-', '') + 'px', height: iconSizes[size].split(' ')[0].replace('h-', '').replace('w-', '') + 'px' }}></div>
              ) : (
                <div className="flex items-center space-x-2">
                  <PhotoIcon className={`${iconSizes[size]} text-white`} />
                  {showRemove && (user?.avatar_url || user?.avatar) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove && onRemove();
                      }}
                      className="p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <TrashIcon className="h-3 w-3 text-white" />
                    </button>
                  )}
                </div>
              )}
            </>
          )}
          {!showUpload && showRemove && (user?.avatar_url || user?.avatar) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove && onRemove();
              }}
              className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            >
              <TrashIcon className={`${iconSizes[size]} text-white`} />
            </button>
          )}
        </div>
      )}

      {/* Online Status Indicator (optional) */}
      {user?.isOnline && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full"></div>
      )}

      {/* Avatar Cropper Modal */}
      <AvatarCropper
        isOpen={showCropper}
        onClose={handleCropperClose}
        imageSrc={selectedImage}
        onCropComplete={handleCropComplete}
        title="Chỉnh sửa Avatar"
      />
    </div>
  );
};

export default Avatar;
