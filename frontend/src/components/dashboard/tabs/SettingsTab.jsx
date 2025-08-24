import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon,
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import apiClient from '../../../services/api';

// Reusable UI Components
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Modal from '../../ui/Modal';

const SettingsTab = ({ data, refreshData, user, profile }) => {
  const [activeSection, setActiveSection] = useState('privacy');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  


  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showAnalytics: true,
    allowIndexing: true,
    showLastSeen: false
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    profileViews: true,
    linkClicks: true,
    weeklyReport: true,
    marketingEmails: false
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });



  const sections = [
    { id: 'privacy', name: 'Quyền Riêng Tư', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Thông Báo', icon: BellIcon },
    { id: 'security', name: 'Bảo Mật', icon: KeyIcon },
    { id: 'danger', name: 'Vùng Nguy Hiểm', icon: TrashIcon }
  ];



  // Change password
  const changePassword = async () => {
    // Validation
    if (!passwordData.currentPassword) {
      toast.error('Vui lòng nhập mật khẩu hiện tại');
      return;
    }

    if (!passwordData.newPassword) {
      toast.error('Vui lòng nhập mật khẩu mới');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error('Mật khẩu mới phải khác mật khẩu hiện tại');
      return;
    }

    try {


      const response = await apiClient.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.data.success) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordModal(false);
        toast.success('Đã thay đổi mật khẩu thành công!');

      }
    } catch (error) {
      console.error('❌ Error changing password:', error);
      const errorMessage = error.response?.data?.message || 'Không thể thay đổi mật khẩu';
      toast.error(errorMessage);
    }
  };

  // Delete account
  const deleteAccount = async () => {
    try {
      const token = localStorage.getItem('lumilink_token') || localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/v1/auth/delete-account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Tài khoản đã được xóa');
        // Redirect to login or home
        window.location.href = '/';
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Không thể xóa tài khoản');
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="px-1">
        <h2 className="text-xl lg:text-2xl font-bold text-white mb-2">Cài Đặt Tài Khoản</h2>
        <p className="text-gray-400 text-sm lg:text-base">Quản lý thông tin cá nhân, quyền riêng tư và bảo mật</p>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1 order-1">
          <Card padding="p-3 lg:p-4" background="bg-gray-800">
            <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible space-x-2 lg:space-x-0 lg:space-y-2 pb-2 lg:pb-0">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  style={activeSection === section.id ? { backgroundColor: '#9333ea', color: 'white' } : {}}
                  className={`flex-shrink-0 lg:w-full flex items-center space-x-2 px-3 py-2.5 lg:py-2 rounded-lg text-left transition-all touch-manipulation whitespace-nowrap ${
                    activeSection === section.id
                      ? 'shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700/50 active:bg-gray-700/50'
                  }`}
                >
                  <section.icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{section.name}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 order-2">


          {/* Privacy Settings */}
          {activeSection === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card background="bg-gray-800">
                <h3 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6">Cài Đặt Quyền Riêng Tư</h3>
                
                <div className="space-y-6">
                  <div className="flex flex-col space-y-3">
                    <div className="flex-1">
                      <h4 className="text-white font-medium">Hiển Thị Profile</h4>
                      <p className="text-gray-400 text-sm">Ai có thể xem profile của bạn</p>
                    </div>
                    <select
                      value={privacySettings.profileVisibility}
                      onChange={(e) => setPrivacySettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
                      className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white touch-manipulation"
                    >
                      <option value="public">Công khai</option>
                      <option value="unlisted">Không liệt kê</option>
                      <option value="private">Riêng tư</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="text-white font-medium">Hiển Thị Thống Kê</h4>
                      <p className="text-gray-400 text-sm">Cho phép người khác xem số liệu thống kê</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.showAnalytics}
                        onChange={(e) => setPrivacySettings(prev => ({ ...prev, showAnalytics: e.target.checked }))}
                        className="sr-only"
                      />
                      <div className={`relative w-10 h-6 sm:w-11 sm:h-6 rounded-full transition-colors duration-300 ease-in-out ${privacySettings.showAnalytics ? 'bg-green-500' : 'bg-gray-600'}`}>
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${privacySettings.showAnalytics ? 'translate-x-4 sm:translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="text-white font-medium">Cho Phép Lập Chỉ Mục</h4>
                      <p className="text-gray-400 text-sm">Cho phép công cụ tìm kiếm lập chỉ mục profile</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.allowIndexing}
                        onChange={(e) => setPrivacySettings(prev => ({ ...prev, allowIndexing: e.target.checked }))}
                        className="sr-only"
                      />
                      <div className={`relative w-10 h-6 sm:w-11 sm:h-6 rounded-full transition-colors duration-300 ease-in-out ${privacySettings.allowIndexing ? 'bg-green-500' : 'bg-gray-600'}`}>
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${privacySettings.allowIndexing ? 'translate-x-4 sm:translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                    </label>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Notification Settings */}
          {activeSection === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card background="bg-gray-800">
                <h3 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6">Cài Đặt Thông Báo</h3>

                <div className="space-y-4">
                  {Object.entries({
                    emailNotifications: 'Thông báo qua Email',
                    profileViews: 'Thông báo lượt xem profile',
                    linkClicks: 'Thông báo lượt nhấp liên kết',
                    weeklyReport: 'Báo cáo hàng tuần',
                    marketingEmails: 'Email marketing'
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between py-2">
                      <div className="flex-1 min-w-0 pr-4">
                        <h4 className="text-white font-medium">{label}</h4>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings[key]}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, [key]: e.target.checked }))}
                          className="sr-only"
                        />
                        <div className={`relative w-10 h-6 sm:w-11 sm:h-6 rounded-full transition-colors duration-300 ease-in-out ${notificationSettings[key] ? 'bg-green-500' : 'bg-gray-600'}`}>
                          <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${notificationSettings[key] ? 'translate-x-4 sm:translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Security Settings */}
          {activeSection === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card background="bg-gray-800">
                <h3 className="text-lg font-semibold text-white mb-6">Cài Đặt Bảo Mật</h3>
                
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-700/50 rounded-lg space-y-3 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium">Thay Đổi Mật Khẩu</h4>
                      <p className="text-gray-400 text-sm">Cập nhật mật khẩu để bảo mật tài khoản</p>
                    </div>
                    <Button
                      onClick={() => setShowPasswordModal(true)}
                      className="w-full sm:w-auto flex-shrink-0"
                    >
                      Thay Đổi
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-700/50 rounded-lg space-y-3 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium">Xác Thực 2 Bước</h4>
                      <p className="text-gray-400 text-sm">Thêm lớp bảo mật cho tài khoản</p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto flex-shrink-0"
                    >
                      Kích Hoạt
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-700/50 rounded-lg space-y-3 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium">Phiên Đăng Nhập</h4>
                      <p className="text-gray-400 text-sm">Quản lý các thiết bị đã đăng nhập</p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto flex-shrink-0"
                    >
                      Xem Chi Tiết
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Danger Zone */}
          {activeSection === 'danger' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card border="border-red-500/50" background="bg-red-500/5">
                <h3 className="text-lg font-semibold text-red-400 mb-6">Vùng Nguy Hiểm</h3>
                
                <div className="space-y-4">
                  <div className="p-4 border border-red-500/30 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Xóa Tài Khoản</h4>
                    <p className="text-gray-400 text-sm mb-4">
                      Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
                    </p>
                    <Button 
                      variant="danger" 
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Xóa Tài Khoản
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Password Change Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Thay Đổi Mật Khẩu"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
              Hủy
            </Button>
            <Button onClick={changePassword}>
              Thay Đổi Mật Khẩu
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Mật khẩu hiện tại"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
            placeholder="Nhập mật khẩu hiện tại"
          />
          
          <Input
            label="Mật khẩu mới"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
            placeholder="Nhập mật khẩu mới"
          />
          
          <Input
            label="Xác nhận mật khẩu mới"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            placeholder="Nhập lại mật khẩu mới"
          />
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Xác Nhận Xóa Tài Khoản"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Hủy
            </Button>
            <Button variant="danger" onClick={deleteAccount}>
              Xóa Tài Khoản
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác và sẽ xóa:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-1">
            <li>Tất cả thông tin profile</li>
            <li>Tất cả liên kết đã tạo</li>
            <li>Dữ liệu thống kê</li>
            <li>Huy hiệu và thành tích</li>
          </ul>
          <p className="text-red-400 font-medium">
            Nhập "DELETE" để xác nhận:
          </p>
          <Input
            placeholder="DELETE"
            className="border-red-500 focus:border-red-500"
          />
        </div>
      </Modal>
    </div>
  );
};

export default SettingsTab;
