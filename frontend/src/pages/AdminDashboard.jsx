/**
 * =============================================================================
 * ADMIN DASHBOARD
 * =============================================================================
 * Dashboard for admin users with user management functionality
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UserAvatar from '../components/UserAvatar';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrophyIcon,
  PlusIcon,
  StarIcon
} from '@heroicons/react/24/outline';
// import api from '../config/api'; // Using fetch instead

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalProfiles: 0,
    totalViews: 0,
    newUsersToday: 0
  });
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Debug users state changes
  React.useEffect(() => {
    if (users.length > 0) {
    }

    // Force debug in window for manual inspection
    window.debugUsers = users;
    window.debugLoading = loading;
  }, [users, loading]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingRole, setEditingRole] = useState('');
  const [editingPlan, setEditingPlan] = useState('');

  // Tab management
  const [activeTab, setActiveTab] = useState('users');

  // Badge management states
  const [badges, setBadges] = useState([]);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [editingBadge, setEditingBadge] = useState(null);
  const [badgeSearchTerm, setBadgeSearchTerm] = useState('');
  const [badgeSortBy, setBadgeSortBy] = useState('rarity'); // rarity, name, category, created_at
  const [badgeSortOrder, setBadgeSortOrder] = useState('desc'); // asc, desc
  const [badgeForm, setBadgeForm] = useState({
    name: '',
    description: '',
    icon: '🏆',
    category: 'achievement',
    rarity: 'common',
    criteria: {
      type: 'profile_views',
      target: 100,
      description: ''
    },
    reward: {
      type: 'none',
      value: 0
    },
    isActive: true
  });

  // Fetch dashboard stats (non-blocking)
  useEffect(() => {
    // Don't let stats error block the component
    fetchStats().catch(() => {
      // Stats fetch failed, continuing anyway
    });
  }, []);

  // Fetch users with filters
  useEffect(() => {
    fetchUsers().catch(() => {
      // fetchUsers failed in useEffect
    });
  }, [currentPage, searchTerm, statusFilter, roleFilter]);

  // Force initial fetch on mount
  useEffect(() => {
    setTimeout(() => {
      fetchUsers().catch(() => {
        // Initial fetchUsers failed
      });
    }, 1000); // Wait 1s for auth to settle
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('lumilink_token');

      const response = await fetch('http://localhost:3001/api/v1/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });


      if (!response.ok) {
        throw new Error(`Stats API error: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.success) {
        setStats(data.stats);
      } else {
        // Stats API returned no success
        // Set default stats to prevent UI issues
        setStats({
          totalUsers: 0,
          activeUsers: 0,
          premiumUsers: 0,
          totalViews: 0
        });
      }
    } catch (error) {
      // Error fetching stats
      // Set default stats on error
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        premiumUsers: 0,
        totalViews: 0
      });
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Debug token
      const token = localStorage.getItem('lumilink_token') || localStorage.getItem('lumilink_access_token');

      if (!token) {
        // No token found in localStorage
        setUsers([]);
        setLoading(false);
        return;
      }

      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: statusFilter,
        role: roleFilter
      };


      // Use fetch instead of axios (since Direct API works)
      const queryString = new URLSearchParams(params).toString();
      const url = `http://localhost:3001/api/v1/admin/users?${queryString}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });


      if (!response.ok) {
        // Fetch response not ok
        setUsers([]);
        setLoading(false);
        return;
      }

      const responseData = await response.json();

      if (responseData?.success) {
        setUsers(responseData.users || []);
        setTotalPages(responseData.pagination?.totalPages || 1);
      } else {
        // Fetch returned success: false
        setUsers([]);
      }








    } catch (error) {
      // Error fetching users
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('⚠️ Bạn có chắc chắn muốn xóa người dùng này?\n\nHành động này không thể hoàn tác!')) return;

    try {
      const token = localStorage.getItem('lumilink_token');

      const response = await fetch(`http://localhost:3001/api/v1/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Xóa người dùng thành công');
        fetchUsers();
        fetchStats();
      } else {
        alert('❌ Không thể xóa người dùng: ' + data.message);
      }
    } catch (error) {
      // Error deleting user
      alert('❌ Lỗi khi xóa người dùng');
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setEditingRole(user.role);
    setEditingPlan(user.plan);
    setShowRoleModal(true);
  };

  const updateUserRole = async () => {
    if (!selectedUser || !editingRole) {
      // Missing selectedUser or editingRole
      alert('❌ Thiếu thông tin user hoặc role');
      return;
    }

    try {
      const token = localStorage.getItem('lumilink_token');

      if (!token) {
        alert('❌ Không tìm thấy token. Vui lòng đăng nhập lại.');
        return;
      }

      const updatePayload = {
        role: editingRole,
        plan: editingPlan
      };

      const response = await fetch(`http://localhost:3001/api/v1/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatePayload)
      });


      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        // Failed to parse response as JSON
        alert('❌ Server trả về response không hợp lệ');
        return;
      }

      if (data.success) {
        alert('✅ Cập nhật role thành công');
        setShowRoleModal(false);
        setSelectedUser(null);
        setEditingRole('');
        setEditingPlan('');

        // Force refresh users with direct API call
        try {
          const token = localStorage.getItem('lumilink_token');
          const refreshResponse = await fetch('http://localhost:3001/api/v1/admin/users', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const refreshData = await refreshResponse.json();
          if (refreshData.success) {
            setUsers(refreshData.users || []);
          }
        } catch (refreshError) {
          // Error refreshing users
        }

        fetchStats(); // Re-enabled with fetch
      } else {
        // API returned error
        alert('❌ Lỗi cập nhật role: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      // Network/Request error
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        alert('❌ Không thể kết nối đến server. Kiểm tra backend có đang chạy không?');
      } else {
        alert('❌ Lỗi khi cập nhật role: ' + error.message);
      }
    }
  };



  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'inactive':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <StarIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return <StarIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'user_premium':
        return 'bg-yellow-100 text-yellow-800';
      case 'user_free':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'user_premium':
        return 'Premium';
      case 'user_free':
        return 'Free';
      default:
        return role;
    }
  };

  const getPlanDisplayName = (plan) => {
    switch (plan) {
      case 'Free':
        return 'Miễn phí';
      case 'Premium':
        return 'Premium';
      case 'Admin':
        return 'Admin';
      default:
        return plan;
    }
  };

  // Badge Management Functions
  const fetchBadges = async () => {
    try {
      const token = localStorage.getItem('lumilink_token');
      const response = await fetch('http://localhost:3001/api/v1/admin/badges', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error(`Badges API error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setBadges(data.badges || []);
      }
    } catch (error) {
      // Error fetching badges
      setBadges([]);
    }
  };

  const handleCreateBadge = async () => {
    try {
      const token = localStorage.getItem('lumilink_token');
      const response = await fetch('http://localhost:3001/api/v1/admin/badges', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(badgeForm)
      });

      const data = await response.json();
      if (data.success) {
        setBadges([...badges, data.badge]);
        setShowBadgeModal(false);
        resetBadgeForm();
        alert('✅ Huy hiệu đã được tạo thành công!');
      } else {
        alert('❌ Lỗi tạo huy hiệu: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      // Error creating badge
      alert('❌ Lỗi khi tạo huy hiệu: ' + error.message);
    }
  };

  const handleUpdateBadge = async () => {
    try {
      const token = localStorage.getItem('lumilink_token');
      const response = await fetch(`http://localhost:3001/api/v1/admin/badges/${editingBadge.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(badgeForm)
      });

      const data = await response.json();
      if (data.success) {
        setBadges(badges.map(b => b.id === editingBadge.id ? data.badge : b));
        setShowBadgeModal(false);
        setEditingBadge(null);
        resetBadgeForm();
        alert('✅ Huy hiệu đã được cập nhật thành công!');
      } else {
        alert('❌ Lỗi cập nhật huy hiệu: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      // Error updating badge
      alert('❌ Lỗi khi cập nhật huy hiệu: ' + error.message);
    }
  };

  const handleDeleteBadge = async (badgeId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa huy hiệu này?')) return;

    try {
      const token = localStorage.getItem('lumilink_token');
      const response = await fetch(`http://localhost:3001/api/v1/admin/badges/${badgeId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setBadges(badges.filter(b => b.id !== badgeId));
        alert('✅ Huy hiệu đã được xóa thành công!');
      } else {
        alert('❌ Lỗi xóa huy hiệu: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      // Error deleting badge
      alert('❌ Lỗi khi xóa huy hiệu: ' + error.message);
    }
  };

  const resetBadgeForm = () => {
    setBadgeForm({
      name: '',
      description: '',
      icon: '🏆',
      category: 'achievement',
      rarity: 'common',
      criteria: {
        type: 'profile_views',
        target: 100,
        description: ''
      },
      reward: {
        type: 'none',
        value: 0
      },
      isActive: true
    });
  };

  const openEditBadge = (badge) => {
    setEditingBadge(badge);
    setBadgeForm({
      name: badge.name || '',
      description: badge.description || '',
      icon: badge.icon || '🏆',
      category: badge.category || 'achievement',
      rarity: badge.rarity || 'common',
      criteria: {
        type: badge.criteria?.type || badge.criteria_type || 'profile_views',
        target: badge.criteria?.target || badge.target_value || 100,
        description: badge.criteria?.description || badge.criteria_description || ''
      },
      reward: {
        type: badge.reward?.type || badge.reward_type || 'none',
        value: badge.reward?.value || badge.reward_value || 0
      },
      isActive: badge.isActive !== false
    });
    setShowBadgeModal(true);
  };

  // Rarity configuration (copied from BadgeTab)
  const getRarityConfig = (rarity) => {
    const configs = {
      common: {
        name: 'Phổ Biến',
        color: 'green',
        bgGradient: 'from-green-500 to-emerald-600',
        borderColor: 'border-green-500',
        textColor: 'text-green-400',
        glowColor: 'shadow-green-500/30'
      },
      uncommon: {
        name: 'Không Phổ Biến',
        color: 'gray',
        bgGradient: 'from-gray-500 to-gray-600',
        borderColor: 'border-gray-500',
        textColor: 'text-gray-400',
        glowColor: 'shadow-gray-500/20'
      },
      rare: {
        name: 'Hiếm',
        color: 'blue',
        bgGradient: 'from-blue-500 to-cyan-600',
        borderColor: 'border-blue-500',
        textColor: 'text-blue-400',
        glowColor: 'shadow-blue-500/30'
      },
      epic: {
        name: 'Sử Thi',
        color: 'purple',
        bgGradient: 'from-purple-500 to-indigo-600',
        borderColor: 'border-purple-500',
        textColor: 'text-purple-400',
        glowColor: 'shadow-purple-500/40'
      },
      legendary: {
        name: 'Huyền Thoại',
        color: 'amber',
        bgGradient: 'from-amber-500 to-orange-600',
        borderColor: 'border-amber-500',
        textColor: 'text-amber-400',
        glowColor: 'shadow-amber-500/50'
      }
    };
    return configs[rarity] || configs.common;
  };

  // Filter and sort badges
  const getFilteredAndSortedBadges = () => {
    let filteredBadges = badges.filter(badge => {
      const searchLower = badgeSearchTerm.toLowerCase();
      return (
        badge.name?.toLowerCase().includes(searchLower) ||
        badge.description?.toLowerCase().includes(searchLower) ||
        badge.category?.toLowerCase().includes(searchLower) ||
        badge.rarity?.toLowerCase().includes(searchLower)
      );
    });

    // Sort badges
    filteredBadges.sort((a, b) => {
      let aValue, bValue;

      switch (badgeSortBy) {
        case 'rarity':
          const rarityOrder = { legendary: 5, epic: 4, rare: 3, common: 2, uncommon: 1 };
          aValue = rarityOrder[a.rarity] || 1;
          bValue = rarityOrder[b.rarity] || 1;
          break;
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'category':
          aValue = a.category?.toLowerCase() || '';
          bValue = b.category?.toLowerCase() || '';
          break;
        case 'created_at':
          aValue = new Date(a.created_at || 0);
          bValue = new Date(b.created_at || 0);
          break;
        default:
          return 0;
      }

      if (badgeSortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return filteredBadges;
  };

  // Fetch badges when tab changes to badges
  useEffect(() => {
    if (activeTab === 'badges') {
      fetchBadges();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Bảng Điều Khiển Quản Trị</h1>
          <p className="text-gray-300">Quản lý người dùng và theo dõi thống kê hệ thống</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'users'
                    ? 'border-yellow-500 text-yellow-500'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <UsersIcon className="w-5 h-5 inline-block mr-2" />
                Quản Lý Người Dùng
              </button>
              <button
                onClick={() => setActiveTab('badges')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'badges'
                    ? 'border-yellow-500 text-yellow-500'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <TrophyIcon className="w-5 h-5 inline-block mr-2" />
                Quản Lý Huy Hiệu
              </button>
            </nav>
          </div>
        </div>

        {/* Stats Cards - Only for Users Tab */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6"
            >
              <div className="flex items-center">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <UsersIcon className="w-6 h-6 text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Tổng Người Dùng</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6"
            >
              <div className="flex items-center">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <CheckCircleIcon className="w-6 h-6 text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Người Dùng Hoạt Động</p>
                  <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6"
            >
              <div className="flex items-center">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <StarIcon className="w-6 h-6 text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Người Dùng Premium</p>
                  <p className="text-2xl font-bold text-white">{users.filter(user => user.plan === 'Premium').length}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6"
            >
              <div className="flex items-center">
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <PlusIcon className="w-6 h-6 text-amber-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Người Dùng Mới</p>
                  <p className="text-2xl font-bold text-white">{stats.newUsersToday}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'users' && (
          /* Users Management */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50"
          >
          {/* Header */}
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-white mb-4 sm:mb-0">Quản Lý Người Dùng</h2>
            </div>




            {/* Filters */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user_premium">Premium User</option>
                <option value="user_free">Free User</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(() => {

                  if (loading) {
                    return (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            <span className="ml-2 text-gray-500">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  if (users.length === 0) {
                    return (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                          No users found (Debug: loading={loading.toString()}, usersLength={users.length})
                        </td>
                      </tr>
                    );
                  }

                  return users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <UserAvatar user={user} size="md" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.display_name}</div>
                            <div className="text-sm text-gray-500">@{user.username}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                          {getRoleDisplayName(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(user.status)}
                          <span className="ml-2 text-sm text-gray-900 capitalize">{user.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getPlanDisplayName(user.plan)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openRoleModal(user)}
                            className="text-purple-600 hover:text-purple-900"
                            title="Chỉnh sửa role & plan"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Xóa người dùng"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
        )}

        {/* Badge Management */}
        {activeTab === 'badges' && (
          <>
            {/* Badge Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-500/20">
                    <TrophyIcon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Tổng Số Huy Hiệu</p>
                    <p className="text-2xl font-bold text-white">{badges.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-500/20">
                    <CheckCircleIcon className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Đang Hoạt Động</p>
                    <p className="text-2xl font-bold text-white">
                      {badges.filter(b => b.is_active || b.isActive).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-500/20">
                    <StarIcon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Huy Hiệu Hiếm</p>
                    <p className="text-2xl font-bold text-white">
                      {badges.filter(b => ['rare', 'epic', 'legendary'].includes(b.rarity)).length}
                    </p>
                  </div>
                </div>
              </div>


            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50"
            >
            {/* Header */}
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex flex-col space-y-4">
                {/* Title and Create Button */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-xl font-semibold text-white mb-4 sm:mb-0">Quản Lý Huy Hiệu</h2>
                  <button
                    onClick={() => {
                      setEditingBadge(null);
                      resetBadgeForm();
                      setShowBadgeModal(true);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-lg transition-colors flex items-center w-fit"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Tạo Mới
                  </button>
                </div>

                {/* Search and Sort Controls */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Tìm kiếm huy hiệu..."
                      value={badgeSearchTerm}
                      onChange={(e) => setBadgeSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>

                  {/* Sort By */}
                  <div className="flex gap-2">
                    <select
                      value={badgeSortBy}
                      onChange={(e) => setBadgeSortBy(e.target.value)}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      <option value="rarity">Độ hiếm</option>
                      <option value="name">Tên</option>
                      <option value="category">Danh mục</option>
                      <option value="created_at">Ngày tạo</option>
                    </select>

                    <button
                      onClick={() => setBadgeSortOrder(badgeSortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors"
                      title={badgeSortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
                    >
                      {badgeSortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <span>Tổng: {badges.length} huy hiệu</span>
                  <span>Hiển thị: {getFilteredAndSortedBadges().length} huy hiệu</span>
                </div>
              </div>
            </div>

            {/* Badges Grid */}
            <div className="p-6">
              {badges.length === 0 ? (
                <div className="text-center py-12">
                  <TrophyIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-300 mb-2">Chưa có huy hiệu nào</h3>
                  <p className="text-gray-400 mb-4">Tạo huy hiệu đầu tiên để khuyến khích người dùng</p>
                  <button
                    onClick={() => {
                      setEditingBadge(null);
                      resetBadgeForm();
                      setShowBadgeModal(true);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    Tạo Huy Hiệu Đầu Tiên
                  </button>
                </div>
              ) : getFilteredAndSortedBadges().length === 0 ? (
                <div className="text-center py-12">
                  <TrophyIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-300 mb-2">Không tìm thấy huy hiệu</h3>
                  <p className="text-gray-400 mb-4">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                  <button
                    onClick={() => {
                      setBadgeSearchTerm('');
                      setBadgeSortBy('rarity');
                      setBadgeSortOrder('desc');
                    }}
                    className="bg-gray-600 hover:bg-gray-500 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    Xóa Bộ Lọc
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {getFilteredAndSortedBadges().map((badge) => {
                    const rarity = badge.rarity || 'common';
                    const rarityConfig = getRarityConfig(rarity);

                    return (
                    <div
                      key={badge.id}
                      className={`bg-gray-700/50 rounded-lg border hover:border-gray-500/50 transition-all duration-200 hover:shadow-lg flex flex-col h-full ${
                        rarityConfig.borderColor
                      }`}
                    >
                      {/* Badge Header */}
                      <div className="p-4 border-b border-gray-600/30">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 bg-gradient-to-br ${rarityConfig.bgGradient} ${rarityConfig.glowColor} shadow-lg border-2 ${rarityConfig.borderColor}`}>
                              {badge.icon || '🏆'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-white font-semibold text-sm truncate">{badge.name}</h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                                  badge.isActive || badge.is_active
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-gray-500/20 text-gray-400'
                                }`}>
                                  {(badge.isActive || badge.is_active) ? 'Hoạt động' : 'Tạm dừng'}
                                </span>
                                <span className="text-xs text-gray-400 capitalize">
                                  {badge.category}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-1 flex-shrink-0">
                            <button
                              onClick={() => openEditBadge(badge)}
                              className="text-blue-400 hover:text-blue-300 p-1.5 hover:bg-blue-500/10 rounded transition-colors"
                              title="Chỉnh sửa"
                            >
                              <PencilIcon className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBadge(badge.id)}
                              className="text-red-400 hover:text-red-300 p-1.5 hover:bg-red-500/10 rounded transition-colors"
                              title="Xóa"
                            >
                              <TrashIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Badge Body */}
                      <div className="p-4 flex-1 flex flex-col space-y-3">
                        {/* Description */}
                        <p className="text-gray-300 text-xs leading-relaxed line-clamp-2">{badge.description}</p>

                        {/* Criteria */}
                        <div className="bg-gray-800/30 rounded-md p-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-xs">Điều kiện:</span>
                            <span className="text-white text-xs font-medium">
                              {badge.criteria_description || badge.criteria?.description || (() => {
                                const criteriaType = badge.criteria_type || badge.criteria?.type;
                                const targetValue = badge.target_value || badge.criteria?.target;
                                const typeMap = {
                                  'profile_views': 'Lượt xem',
                                  'links_created': 'Link tạo',
                                  'days_active': 'Ngày hoạt động',
                                  'premium_days': 'Ngày Premium',
                                  'referrals': 'Giới thiệu'
                                };
                                return `${typeMap[criteriaType] || criteriaType}: ${targetValue}`;
                              })()}
                            </span>
                          </div>
                        </div>

                        {/* Reward */}
                        {((badge.reward_type && badge.reward_type !== 'none') || (badge.reward?.type && badge.reward?.type !== 'none')) && (
                          <div className="bg-yellow-500/10 rounded-md p-2">
                            <div className="flex items-center justify-between">
                              <span className="text-yellow-400 text-xs">Thưởng:</span>
                              <span className="text-yellow-300 text-xs font-medium">
                                {((badge.reward_type === 'points') || (badge.reward?.type === 'points')) && `${badge.reward_value || badge.reward?.value} điểm`}
                                {((badge.reward_type === 'premium_days') || (badge.reward?.type === 'premium_days')) && `${badge.reward_value || badge.reward?.value} ngày Premium`}
                                {((badge.reward_type === 'feature_unlock') || (badge.reward?.type === 'feature_unlock')) && 'Mở khóa tính năng'}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Spacer */}
                        <div className="flex-1"></div>

                        {/* Footer */}
                        <div className="pt-2 border-t border-gray-600/30">
                          {/* Rarity Display */}
                          <div className="flex items-center justify-center mb-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${rarityConfig.bgGradient} text-white shadow-lg`}>
                              <span className="mr-1">
                                {rarity === 'legendary' && '👑'}
                                {rarity === 'epic' && '💜'}
                                {rarity === 'rare' && '💎'}
                                {rarity === 'uncommon' && '🌟'}
                                {rarity === 'common' && '⚪'}
                              </span>
                              <span className="text-xs">{rarityConfig.name}</span>
                            </span>
                          </div>

                          {/* ID */}
                          <div className="text-center">
                            <span className="text-gray-500 text-xs">ID: {badge.id}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
          </>
        )}
      </div>

      {/* Role Edit Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Chỉnh Sửa Role & Plan - {selectedUser?.username}
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={editingRole}
                onChange={(e) => setEditingRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="user_free">Free User</option>
                <option value="user_premium">Premium User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan
              </label>
              <select
                value={editingPlan}
                onChange={(e) => setEditingPlan(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="Free">Miễn phí</option>
                <option value="Premium">Premium</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedUser(null);
                  setEditingRole('');
                  setEditingPlan('');
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={updateUserRole}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Cập Nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Badge Create/Edit Modal */}
      {showBadgeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-3 border-b border-gray-700">
              <h3 className="text-base font-semibold text-white">
                {editingBadge ? 'Chỉnh Sửa Huy Hiệu' : 'Tạo Huy Hiệu Mới'}
              </h3>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-3">

            <div className="space-y-3">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Tên Huy Hiệu *
                  </label>
                  <input
                    type="text"
                    value={badgeForm.name}
                    onChange={(e) => setBadgeForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Ví dụ: Người Mới"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Icon (Emoji)
                  </label>
                  <input
                    type="text"
                    value={badgeForm.icon}
                    onChange={(e) => setBadgeForm(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="🏆"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Mô Tả *
                </label>
                <textarea
                  value={badgeForm.description}
                  onChange={(e) => setBadgeForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-yellow-500 focus:border-transparent"
                  rows="2"
                  placeholder="Mô tả về huy hiệu này..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Danh Mục
                  </label>
                  <select
                    value={badgeForm.category}
                    onChange={(e) => setBadgeForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="achievement">Thành tựu</option>
                    <option value="milestone">Cột mốc</option>
                    <option value="engagement">Tương tác</option>
                    <option value="premium">Premium</option>
                    <option value="special">Đặc biệt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Độ Hiếm
                  </label>
                  <select
                    value={badgeForm.rarity}
                    onChange={(e) => setBadgeForm(prev => ({ ...prev, rarity: e.target.value }))}
                    className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="common">⚪ Phổ Biến</option>
                    <option value="uncommon">🌟 Không Phổ Biến</option>
                    <option value="rare">💎 Hiếm</option>
                    <option value="epic">💜 Sử Thi</option>
                    <option value="legendary">👑 Huyền Thoại</option>
                  </select>
                </div>
              </div>

              {/* Criteria Section */}
              <div className="bg-gray-700/50 rounded p-2">
                <h4 className="text-white text-sm font-medium mb-2">Điều Kiện Đạt Được</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Loại Điều Kiện
                    </label>
                    <select
                      value={badgeForm.criteria.type}
                      onChange={(e) => setBadgeForm(prev => ({
                        ...prev,
                        criteria: { ...prev.criteria, type: e.target.value }
                      }))}
                      className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-yellow-500 focus:border-transparent"
                    >
                      <option value="profile_views">Lượt xem profile</option>
                      <option value="links_created">Số link tạo</option>
                      <option value="days_active">Số ngày hoạt động</option>
                      <option value="premium_days">Số ngày Premium</option>
                      <option value="referrals">Số người giới thiệu</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Mục Tiêu
                    </label>
                    <input
                      type="number"
                      value={badgeForm.criteria.target}
                      onChange={(e) => setBadgeForm(prev => ({
                        ...prev,
                        criteria: { ...prev.criteria, target: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-yellow-500 focus:border-transparent"
                      min="1"
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Mô Tả Điều Kiện
                  </label>
                  <input
                    type="text"
                    value={badgeForm.criteria.description}
                    onChange={(e) => setBadgeForm(prev => ({
                      ...prev,
                      criteria: { ...prev.criteria, description: e.target.value }
                    }))}
                    className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Ví dụ: Đạt 1000 lượt xem profile"
                  />
                </div>
              </div>

              {/* Reward Section */}
              <div className="bg-yellow-500/10 rounded p-2">
                <h4 className="text-yellow-400 text-sm font-medium mb-2">Phần Thưởng (Tùy chọn)</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Loại Phần Thưởng
                    </label>
                    <select
                      value={badgeForm.reward.type}
                      onChange={(e) => setBadgeForm(prev => ({
                        ...prev,
                        reward: { ...prev.reward, type: e.target.value }
                      }))}
                      className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-1 focus:ring-yellow-500 focus:border-transparent"
                    >
                      <option value="none">Không có</option>
                      <option value="points">Điểm thưởng</option>
                      <option value="premium_days">Ngày Premium</option>
                      <option value="feature_unlock">Mở khóa tính năng</option>
                    </select>
                  </div>
                  {badgeForm.reward.type !== 'none' && badgeForm.reward.type !== 'feature_unlock' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Giá Trị
                      </label>
                      <input
                        type="number"
                        value={badgeForm.reward.value}
                        onChange={(e) => setBadgeForm(prev => ({
                          ...prev,
                          reward: { ...prev.reward, value: parseInt(e.target.value) || 0 }
                        }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={badgeForm.isActive}
                  onChange={(e) => setBadgeForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-300">
                  Kích hoạt huy hiệu này
                </label>
              </div>
            </div>

            </div>

            {/* Modal Footer */}
            <div className="p-2 border-t border-gray-700">
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowBadgeModal(false);
                    setEditingBadge(null);
                    resetBadgeForm();
                  }}
                  className="px-3 py-1.5 text-gray-300 border border-gray-600 rounded text-sm hover:bg-gray-700 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={editingBadge ? handleUpdateBadge : handleCreateBadge}
                  disabled={!badgeForm.name || !badgeForm.description || !badgeForm.rarity}
                  className="px-3 py-1.5 bg-yellow-500 text-black rounded text-sm hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {editingBadge ? 'Cập Nhật' : 'Tạo Huy Hiệu'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
