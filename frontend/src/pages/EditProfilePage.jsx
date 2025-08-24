import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  UserIcon,
  PhotoIcon,
  CheckIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentUserProfile, updateProfile } = useProfile();
  
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    bio: '',
    email: '',
    location: '',
    website: '',
    avatar: null,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Load current profile data
  useEffect(() => {
    if (currentUserProfile) {
      setFormData(prev => ({
        ...prev,
        displayName: currentUserProfile.displayName || '',
        username: currentUserProfile.username || '',
        bio: currentUserProfile.bio || '',
        email: currentUserProfile.email || '',
        location: currentUserProfile.location || '',
        website: currentUserProfile.website || '',
        avatar: currentUserProfile.avatar || null
      }));
      setAvatarPreview(currentUserProfile.avatar);
    }
  }, [currentUserProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, avatar: 'File size must be less than 5MB' }));
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, avatar: 'Please select an image file' }));
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target.result;
        setAvatarPreview(result);
        setFormData(prev => ({ ...prev, avatar: result }));
        setErrors(prev => ({ ...prev, avatar: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate display name
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Tên hiển thị là bắt buộc';
    }

    // Validate username
    if (!formData.username.trim()) {
      newErrors.username = 'Username là bắt buộc';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username chỉ được chứa chữ cái, số và dấu gạch dưới';
    }

    // Validate email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Vui lòng nhập email hợp lệ';
    }

    // Validate password if changing
    if (showPasswordSection) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Mật khẩu hiện tại là bắt buộc';
      }
      if (!formData.newPassword) {
        newErrors.newPassword = 'Mật khẩu mới là bắt buộc';
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
      }
    }

    // Validate bio length
    if (formData.bio.length > 160) {
      newErrors.bio = 'Bio không được vượt quá 160 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate avatar upload if there's a new file
      let avatarUrl = formData.avatar;
      if (avatarFile) {
        // In real app: avatarUrl = await uploadToCloudStorage(avatarFile);
      }

      // Prepare update data
      const updateData = {
        displayName: formData.displayName,
        username: formData.username,
        bio: formData.bio,
        email: formData.email,
        location: formData.location,
        website: formData.website,
        avatar: avatarUrl
      };

      // Add password change if requested
      if (showPasswordSection && formData.newPassword) {
        updateData.passwordChange = {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        };
      }

      // Update profile using context
      const updatedProfile = updateProfile(updateData);

      if (updatedProfile) {
        setSuccessMessage('Profile đã được cập nhật thành công!');

        // Reset password fields
        if (showPasswordSection) {
          setFormData(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }));
          setShowPasswordSection(false);
        }

        // Auto hide success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error('Failed to update profile');
      }
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ submit: 'Không thể cập nhật profile. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Chỉnh sửa Profile</h1>
            </div>
            
            <button
              onClick={() => navigate(`/profile/${formData.username}`)}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>Xem profile</span>
              <ArrowLeftIcon className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl"
          >
            <div className="flex items-center space-x-2">
              <CheckIcon className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">{successMessage}</span>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors">
                  <PhotoIcon className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-600 mt-2">Click để thay đổi avatar</p>
              {errors.avatar && (
                <p className="text-sm text-red-600 mt-1">{errors.avatar}</p>
              )}
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên hiển thị *
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder="Tên của bạn"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.displayName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.displayName && (
                  <p className="text-sm text-red-600 mt-1">{errors.displayName}</p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">@</span>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="username"
                    className={`w-full pl-8 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.username ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-red-600 mt-1">{errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa điểm
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Thành phố, Quốc gia"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://yourwebsite.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Viết vài dòng về bản thân..."
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
                  errors.bio ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                <div>
                  {errors.bio && (
                    <p className="text-sm text-red-600">{errors.bio}</p>
                  )}
                </div>
                <p className={`text-sm ${formData.bio.length > 160 ? 'text-red-600' : 'text-gray-500'}`}>
                  {formData.bio.length}/160 ký tự
                </p>
              </div>
            </div>

            {/* Password Section Toggle */}
            <div className="border-t border-gray-200 pt-6">
              <button
                type="button"
                onClick={() => setShowPasswordSection(!showPasswordSection)}
                className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-900">Đổi mật khẩu</span>
                <span className="text-sm text-gray-600">
                  {showPasswordSection ? 'Ẩn' : 'Hiện'}
                </span>
              </button>

              {/* Password Fields */}
              {showPasswordSection && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-4"
                >
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu hiện tại *
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        placeholder="Nhập mật khẩu hiện tại"
                        className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showCurrentPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="text-sm text-red-600 mt-1">{errors.currentPassword}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu mới *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="Nhập mật khẩu mới"
                        className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.newPassword ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-sm text-red-600 mt-1">{errors.newPassword}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xác nhận mật khẩu mới *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Nhập lại mật khẩu mới"
                        className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-800">{errors.submit}</p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-6 rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CheckIcon className="w-5 h-5" />
                    <span>Lưu thay đổi</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProfilePage;
