/**
 * =============================================================================
 * USER DASHBOARD
 * =============================================================================
 * Simplified dashboard for regular users
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  EyeIcon,
  ChartBarIcon,
  UserIcon,
  CogIcon,
  LinkIcon,
  ShareIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalViews: 0,
    totalClicks: 0,
    totalLinks: 0,
    profileViews: 0
  });
  
  const [links, setLinks] = useState([]);
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);

  // Mock data - replace with real API calls
  useEffect(() => {
    // Fetch user stats
    setStats({
      totalViews: 1234,
      totalClicks: 567,
      totalLinks: 8,
      profileViews: 890
    });

    // Fetch user links
    setLinks([
      {
        id: 1,
        title: "My Website",
        url: "https://example.com",
        type: "website",
        clicks: 150,
        isActive: true
      },
      {
        id: 2,
        title: "Instagram",
        url: "https://instagram.com/demo",
        type: "instagram",
        clicks: 89,
        isActive: true
      },
      {
        id: 3,
        title: "YouTube Channel",
        url: "https://youtube.com/demo",
        type: "youtube",
        clicks: 234,
        isActive: true
      }
    ]);
  }, []);

  const handleCopyProfileLink = () => {
    const profileUrl = `http://localhost:3000/${user?.username || 'demo'}`;
    navigator.clipboard.writeText(profileUrl);
    // Show toast notification
  };

  const handleViewProfile = () => {
    navigate(`/${user?.username || 'demo'}`);
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleDeleteLink = (linkId) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      setLinks(links.filter(link => link.id !== linkId));
    }
  };

  const handleEditLink = (link) => {
    setSelectedLink(link);
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.displayName || user?.username}!
            </h1>
            <p className="text-gray-600">Manage your LumiLink profile and links</p>
          </div>
          
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button
              onClick={handleViewProfile}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <EyeIcon className="w-5 h-5 mr-2" />
              View Profile
            </button>
            <button
              onClick={handleCopyProfileLink}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ShareIcon className="w-5 h-5 mr-2" />
              Share Profile
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <EyeIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Profile Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.profileViews}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClicks}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <LinkIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Links</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLinks}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. CTR</p>
                <p className="text-2xl font-bold text-gray-900">12.5%</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowAddLinkModal(true)}
                className="w-full flex items-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <PlusIcon className="w-5 h-5 mr-3" />
                Add New Link
              </button>
              <button
                onClick={handleEditProfile}
                className="w-full flex items-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <UserIcon className="w-5 h-5 mr-3" />
                Edit Profile
              </button>
              <button
                onClick={() => navigate('/analytics')}
                className="w-full flex items-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                <ChartBarIcon className="w-5 h-5 mr-3" />
                View Analytics
              </button>
            </div>
          </motion.div>

          {/* Profile Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Preview</h3>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-gray-600" />
              </div>
              <h4 className="font-medium text-gray-900">{user?.displayName}</h4>
              <p className="text-sm text-gray-500">@{user?.username}</p>
              <p className="text-xs text-gray-400 mt-2">
                lumilink.com/{user?.username}
              </p>
              <button
                onClick={handleCopyProfileLink}
                className="mt-3 inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
              >
                <ClipboardDocumentIcon className="w-4 h-4 mr-1" />
                Copy Link
              </button>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-600">5 new profile views</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-600">Instagram link clicked 12 times</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-gray-600">Profile updated</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Links Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Your Links</h2>
              <button
                onClick={() => setShowAddLinkModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Link
              </button>
            </div>
          </div>

          <div className="p-6">
            {links.length === 0 ? (
              <div className="text-center py-8">
                <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No links yet</h3>
                <p className="text-gray-500 mb-4">Start building your profile by adding your first link</p>
                <button
                  onClick={() => setShowAddLinkModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add Your First Link
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {links.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                        <LinkIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{link.title}</h4>
                        <p className="text-sm text-gray-500">{link.url}</p>
                        <p className="text-xs text-gray-400">{link.clicks} clicks</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditLink(link)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modals would go here */}
      {/* AddLinkModal, EditLinkModal, etc. */}
    </div>
  );
};

export default UserDashboard;
