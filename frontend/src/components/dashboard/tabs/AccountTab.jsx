import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  EyeIcon,
  CursorArrowRaysIcon,
  LinkIcon,
  StarIcon,

  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Reusable UI Components
import Card from '../../ui/Card';
import StatCard from '../../ui/StatCard';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Avatar from '../../ui/Avatar';

// API Services
import accountApi from '../../../services/accountApi';
import linksApi from '../../../services/linksApi';

const AccountTab = ({ data, refreshData, user }) => {
  const { analytics, badges } = data;

  // Profile editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.display_name || user?.displayName || '',
    bio: user?.bio || '',
    website: user?.website || '',
    location: user?.location || ''
  });

  // Links count state
  const [linksCount, setLinksCount] = useState(0);

  // Load links count
  const loadLinksCount = async () => {
    try {
      const result = await linksApi.getLinks();
      if (result && result.success && result.data) {
        setLinksCount(result.data.length);
      }
    } catch (error) {
      // Silent error handling
    }
  };

  useEffect(() => {
    if (user) {
      setProfileData({
        displayName: user.display_name || user.displayName || '',
        bio: user.bio || '',
        website: user.website || '',
        location: user.location || ''
      });
    }
  }, [user]);

  // Load links count on mount
  useEffect(() => {
    loadLinksCount();
  }, []);

  // Quick stats cards
  const statsCards = [
    {
      title: 'Lượt Xem Profile',
      value: analytics.data?.profileViews?.total || 0,
      change: '+12%',
      changeType: 'positive',
      icon: EyeIcon,
      color: 'blue'
    },
    {
      title: 'Lượt Nhấp Liên Kết',
      value: analytics.data?.linkClicks?.total || 0,
      change: '+8%',
      changeType: 'positive',
      icon: CursorArrowRaysIcon,
      color: 'green'
    },
    {
      title: 'Tổng Liên Kết',
      value: linksCount,
      change: linksCount > 0 ? `${linksCount} liên kết` : 'Chưa có',
      changeType: linksCount > 0 ? 'positive' : 'neutral',
      icon: LinkIcon,
      color: 'purple'
    },
    {
      title: 'Huy Hiệu Đạt Được',
      value: (() => {
        // Kiểm tra nhiều cấu trúc dữ liệu có thể có
        let earnedCount = 0;

        if (badges?.data?.earned?.length) {
          earnedCount = badges.data.earned.length;
        } else if (badges?.earned?.length) {
          earnedCount = badges.earned.length;
        } else if (badges?.data && Array.isArray(badges.data)) {
          // Trường hợp badges.data là array trực tiếp
          earnedCount = badges.data.filter(badge => badge.status === 'earned' || badge.is_completed).length;
        } else if (Array.isArray(badges)) {
          // Trường hợp badges là array trực tiếp
          earnedCount = badges.filter(badge => badge.status === 'earned' || badge.is_completed).length;
        }



        return earnedCount;
      })(),
      change: (() => {
        let earnedCount = 0;

        if (badges?.data?.earned?.length) {
          earnedCount = badges.data.earned.length;
        } else if (badges?.earned?.length) {
          earnedCount = badges.earned.length;
        } else if (badges?.data && Array.isArray(badges.data)) {
          earnedCount = badges.data.filter(badge => badge.status === 'earned' || badge.is_completed).length;
        } else if (Array.isArray(badges)) {
          earnedCount = badges.filter(badge => badge.status === 'earned' || badge.is_completed).length;
        }

        return earnedCount > 0 ? `${earnedCount} huy hiệu` : 'Chưa có';
      })(),
      changeType: (() => {
        let earnedCount = 0;

        if (badges?.data?.earned?.length) {
          earnedCount = badges.data.earned.length;
        } else if (badges?.earned?.length) {
          earnedCount = badges.earned.length;
        } else if (badges?.data && Array.isArray(badges.data)) {
          earnedCount = badges.data.filter(badge => badge.status === 'earned' || badge.is_completed).length;
        } else if (Array.isArray(badges)) {
          earnedCount = badges.filter(badge => badge.status === 'earned' || badge.is_completed).length;
        }

        return earnedCount > 0 ? 'positive' : 'neutral';
      })(),
      icon: StarIcon,
      color: 'amber'
    }
  ];



  // Save profile changes
  const saveProfileChanges = async () => {
    try {


      // Validate required fields
      if (!profileData.displayName.trim()) {
        toast.error('Tên hiển thị không được để trống');
        return;
      }

      // Validate website URL if provided
      if (profileData.website && profileData.website.trim()) {
        try {
          new URL(profileData.website);
        } catch (error) {
          toast.error('Website URL không hợp lệ');
          return;
        }
      }

      // Validate bio length
      if (profileData.bio && profileData.bio.length > 500) {
        toast.error('Bio không được vượt quá 500 ký tự');
        return;
      }

      const result = await accountApi.updateProfile(profileData);


      if (result.success) {
        setIsEditingProfile(false);
        toast.success('Đã cập nhật thông tin thành công!');
        // Refresh user data only (avoid duplicate calls)
        if (refreshData) {
          refreshData('user');
        }
      } else {
        throw new Error(result.message || 'Failed to update profile');
      }
    } catch (error) {

      toast.error(error.response?.data?.message || error.message || 'Không thể cập nhật thông tin');
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh (JPG, PNG, GIF)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB');
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const result = await accountApi.uploadAvatar(file);

      if (result.success) {
        toast.success('Đã cập nhật avatar thành công!');
        // Refresh user data to get new avatar URL
        if (refreshData) {
          setTimeout(() => refreshData('user'), 500); // Delay to avoid conflicts
        }
      } else {
        throw new Error(result.message || 'Failed to upload avatar');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Không thể tải lên avatar');
    } finally {
      setIsUploadingAvatar(false);
      // Clear the input value to allow re-uploading the same file
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  // Handle avatar removal
  const handleAvatarRemove = async () => {
    if (!user?.avatar) return;

    try {
      const result = await accountApi.deleteAvatar();

      if (result.success) {
        toast.success('Đã xóa avatar thành công!');
        // Refresh user data to remove avatar URL
        if (refreshData) {
          setTimeout(() => refreshData('user'), 500); // Delay to avoid conflicts
        }
      } else {
        throw new Error(result.message || 'Failed to delete avatar');
      }
    } catch (error) {

      toast.error(error.response?.data?.message || error.message || 'Không thể xóa avatar');
    }
  };

  const cancelEdit = () => {
    setProfileData({
      displayName: user?.display_name || user?.displayName || '',
      bio: user?.bio || '',
      website: user?.website || '',
      location: user?.location || ''
    });
    setIsEditingProfile(false);
  };



  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-4 sm:p-6 border border-purple-500/30"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">
              Chào mừng trở lại, {user?.display_name || user?.displayName || user?.username}! 👋
            </h2>
            <p className="text-gray-300 text-sm sm:text-base">
              Quản lý tài khoản và theo dõi hoạt động LumiLink của bạn
            </p>
          </div>
          <div className="flex-shrink-0 self-center sm:self-auto">
            <Avatar
              user={user}
              size="lg"
              showUpload={true}
              showRemove={true}
              onUpload={(file) => {
                const event = { target: { files: [file] } };
                handleAvatarUpload(event);
              }}
              onRemove={handleAvatarRemove}
              isUploading={isUploadingAvatar}
            />
          </div>
        </div>
      </motion.div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
              <h3 className="text-lg sm:text-xl font-semibold text-white">Thông Tin Profile</h3>
              {!isEditingProfile ? (
                <Button
                  variant="outline"
                  icon={PencilIcon}
                  onClick={() => setIsEditingProfile(true)}
                  className="w-full sm:w-auto"
                >
                  Chỉnh Sửa
                </Button>
              ) : (
                <div className="flex space-x-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    icon={XMarkIcon}
                    onClick={cancelEdit}
                    className="flex-1 sm:flex-none"
                  >
                    Hủy
                  </Button>
                  <Button
                    icon={CheckIcon}
                    onClick={saveProfileChanges}
                    className="flex-1 sm:flex-none"
                  >
                    Lưu
                  </Button>
                </div>
              )}
            </div>

            {isEditingProfile ? (
              <div className="space-y-4">
                <Input
                  label="Tên Hiển Thị *"
                  value={profileData.displayName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder="Nhập tên hiển thị"
                  required
                />

                <Input
                  label="Bio"
                  type="textarea"
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Viết vài dòng về bản thân..."
                  rows={3}
                  maxLength={500}
                />
                <div className="text-right text-xs text-gray-400">
                  {profileData.bio.length}/500 ký tự
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Website"
                    value={profileData.website}
                    onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://example.com"
                    type="url"
                  />

                  <Input
                    label="Vị Trí"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Thành phố, Quốc gia"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Tên Hiển Thị</label>
                  <p className="text-white">{user?.display_name || user?.displayName || 'Chưa cập nhật'}</p>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">Username</label>
                  <p className="text-white">@{user?.username}</p>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">Email</label>
                  <p className="text-white">{user?.email || 'Chưa cập nhật'}</p>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">Bio</label>
                  <p className="text-white">{user?.bio || 'Chưa có bio'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Website</label>
                    <p className="text-white break-all">{user?.website || 'Chưa cập nhật'}</p>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Vị Trí</label>
                    <p className="text-white">{user?.location || 'Chưa cập nhật'}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Account Stats */}
        <div className="lg:col-span-1">
          <Card>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Thống Kê Tài Khoản</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Gói tài khoản</span>
                <span className="text-purple-400 font-medium capitalize text-sm">{user?.plan || 'Free'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Ngày tham gia</span>
                <span className="text-white text-sm">
                  {user?.created_at || user?.createdAt ?
                    new Date(user.created_at || user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Lần đăng nhập cuối</span>
                <span className="text-white text-sm">
                  {user?.last_login || user?.lastLogin ?
                    new Date(user.last_login || user.lastLogin).toLocaleDateString('vi-VN') : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Trạng thái</span>
                <span className={`text-sm ${user?.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
                  {user?.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Xác thực</span>
                <span className={`text-sm ${user?.verified ? 'text-green-400' : 'text-gray-400'}`}>
                  {user?.verified ? 'Đã xác thực' : 'Chưa xác thực'}
                </span>
              </div>

              {/* Avatar Info */}
              <div className="border-t border-gray-700 pt-3 sm:pt-4 mt-3 sm:mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Avatar</span>
                  <span className="text-white text-sm">
                    {user?.avatar_url || user?.avatar ? 'Đã tải lên' : 'Chưa có'}
                  </span>
                </div>
                {(user?.avatar_url || user?.avatar) && (
                  <div className="mt-2 text-xs text-gray-500">
                    Nhấp vào avatar để thay đổi hoặc xóa
                  </div>
                )}
                {!(user?.avatar_url || user?.avatar) && (
                  <div className="mt-2 text-xs text-gray-500">
                    Nhấp vào vòng tròn avatar ở trên để tải lên
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {statsCards.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
            color={stat.color}
            index={index}
          />
        ))}
      </div>


    </div>
  );
};

export default AccountTab;
