import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import toast, { Toaster } from 'react-hot-toast';

// Import mobile styles
import '../styles/dashboard-mobile.css';

// Dashboard Components
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';

// Debug components (development only)
// import ApiTestPanel from '../components/debug/ApiTestPanel';
import AccountTab from '../components/dashboard/tabs/AccountTab';
import AnalyticsTab from '../components/dashboard/tabs/AnalyticsTab';
import LinksTab from '../components/dashboard/tabs/LinksTab';
import CustomizeTab from '../components/dashboard/tabs/CustomizeTab';
import BadgesTab from '../components/dashboard/tabs/BadgesTab';
// Temporarily hidden features
// import ImageHostTab from '../components/dashboard/tabs/ImageHostTab';
// import TemplatesTab from '../components/dashboard/tabs/TemplatesTab';
import SettingsTab from '../components/dashboard/tabs/SettingsTab';
import PremiumTab from '../components/dashboard/tabs/PremiumTab';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { currentUserProfile, updateProfile } = useProfile();

  // Main state
  const [activeTab, setActiveTab] = useState('account');
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024); // Open on desktop, closed on mobile

  // Data states
  const [dashboardData, setDashboardData] = useState({
    analytics: {
      loading: true,
      data: null,
      error: null
    },
    links: {
      loading: true,
      data: [],
      error: null
    },
    badges: {
      loading: true,
      data: null,
      error: null
    },
    overview: {
      loading: true,
      data: null,
      error: null
    }
  });

  // Load initial dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      setIsLoading(true);

      try {
        // Load all dashboard data in parallel
        const [analyticsResult, linksResult, badgesResult] = await Promise.allSettled([
          loadAnalyticsData(),
          loadLinksData(),
          loadBadgesData()
        ]);

        // Process results
        if (analyticsResult.status === 'fulfilled') {
          setDashboardData(prev => ({
            ...prev,
            analytics: { loading: false, data: analyticsResult.value, error: null }
          }));
        } else {
          setDashboardData(prev => ({
            ...prev,
            analytics: { loading: false, data: null, error: analyticsResult.reason }
          }));
        }

        if (linksResult.status === 'fulfilled') {
          setDashboardData(prev => ({
            ...prev,
            links: { loading: false, data: linksResult.value, error: null }
          }));
        } else {
          setDashboardData(prev => ({
            ...prev,
            links: { loading: false, data: [], error: linksResult.reason }
          }));
        }

        if (badgesResult.status === 'fulfilled') {
          setDashboardData(prev => ({
            ...prev,
            badges: { loading: false, data: badgesResult.value, error: null }
          }));
        } else {
          setDashboardData(prev => ({
            ...prev,
            badges: { loading: false, data: null, error: badgesResult.reason }
          }));
        }

        // Generate overview data
        generateOverviewData();

      } catch (error) {
        toast.error('Không thể tải dữ liệu dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  // Handle window resize for sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true); // Always open on desktop
      } else {
        setIsSidebarOpen(false); // Always closed on mobile
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load analytics data
  const loadAnalyticsData = async () => {
    try {


      const token = localStorage.getItem('lumilink_token') || localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token');
      }

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';
      const response = await fetch(`${apiUrl}/analytics/dashboard/overview`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {

        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch analytics');
      }
    } catch (error) {

      // Return mock data as fallback
      return {
        profileViews: { total: 0, thisWeek: 0, today: 0, uniqueVisitors: 0 },
        linkClicks: { total: 0, thisWeek: 0, today: 0 },
        conversionRate: 0,
        topCountries: [],
        devices: { mobile: 0, desktop: 0, tablet: 0 },
        dailyStats: []
      };
    }
  };

  // Load links data
  const loadLinksData = async () => {
    try {
      const token = localStorage.getItem('lumilink_token') || localStorage.getItem('token');
      if (!token) {
        return [];
      }

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';
      const response = await fetch(`${apiUrl}/links/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        return [];
      }

      const result = await response.json();

      // Return the full result structure for LinksTab
      return {
        data: result.data || [],
        total: result.total || 0,
        success: result.success
      };
    } catch (error) {
      return [];
    }
  };

  // Load badges data
  const loadBadgesData = async () => {
    try {
      const token = localStorage.getItem('lumilink_token') || localStorage.getItem('token');
      if (!token) {
        return { earned: [], available: [], progress: {} };
      }

      // Load user badges and all badges
      const [userBadgesResponse, allBadgesResponse] = await Promise.all([
        fetch('http://localhost:3001/api/v1/badges/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('http://localhost:3001/api/v1/badges', {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      ]);

      // Parse responses
      const userBadges = userBadgesResponse.ok ? await userBadgesResponse.json() : { data: [] };
      const allBadges = allBadgesResponse.ok ? await allBadgesResponse.json() : { data: [] };

      // Process the data
      const userBadgesData = userBadges?.data || userBadges || [];
      const allBadgesData = allBadges?.data || allBadges || [];

      // Separate earned and available badges
      const earnedBadgeIds = new Set(userBadgesData.map(ub => ub.badge_id));

      // Process earned badges
      const earned = userBadgesData
        .filter(ub => ub.is_completed)
        .map(userBadge => {
          const badgeDetails = allBadgesData.find(badge => badge.id === userBadge.badge_id);
          return {
            ...badgeDetails,
            ...userBadge,
            status: 'earned',
            earnedAt: userBadge.earned_at,
            progress: 100
          };
        })
        .filter(badge => badge.name);

      // Process available badges
      const available = allBadgesData
        .filter(badge => !earnedBadgeIds.has(badge.id))
        .map(badge => ({
          ...badge,
          status: 'available',
          progress: 0
        }));

      const result = {
        earned,
        available,
        progress: {}
      };



      return result;
    } catch (error) {

      return { earned: [], available: [], progress: {} };
    }
  };

  // Generate overview data from other data sources
  const generateOverviewData = () => {
    const analytics = dashboardData.analytics.data;
    const links = dashboardData.links.data;
    const badges = dashboardData.badges.data;

    const overviewData = {
      stats: {
        totalViews: analytics?.profileViews?.total || 0,
        totalClicks: analytics?.linkClicks?.total || 0,
        totalLinks: links?.length || 0,
        totalBadges: badges?.earned?.length || 0
      },
      recentActivity: [],
      quickActions: [
        { id: 'add-link', title: 'Thêm Liên Kết', icon: 'plus', action: () => setActiveTab('links') },
        { id: 'customize', title: 'Tùy Chỉnh', icon: 'paint', action: () => setActiveTab('customize') },
        { id: 'view-analytics', title: 'Xem Thống Kê', icon: 'chart', action: () => setActiveTab('analytics') },
        { id: 'view-profile', title: 'Xem Profile', icon: 'eye', action: () => window.open(`/${user?.username}`, '_blank') }
      ]
    };

    setDashboardData(prev => ({
      ...prev,
      overview: { loading: false, data: overviewData, error: null }
    }));
  };

  // Refresh specific data section
  const refreshData = async (section) => {
    // Handle user and profile refresh differently
    if (section === 'user' || section === 'profile') {
      // For user/profile updates, we should refresh the auth context
      // This will be handled by the parent component or auth context
      if (window.location.reload) {
        // Simple page refresh for now - can be optimized later
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      return;
    }

    setDashboardData(prev => ({
      ...prev,
      [section]: { ...prev[section], loading: true }
    }));

    try {
      let newData;
      switch (section) {
        case 'analytics':
          newData = await loadAnalyticsData();
          break;
        case 'links':
          newData = await loadLinksData();
          break;
        case 'badges':
          newData = await loadBadgesData();
          break;
        default:

          return;
      }

      setDashboardData(prev => ({
        ...prev,
        [section]: { loading: false, data: newData, error: null }
      }));

      // Regenerate overview if needed
      if (section !== 'overview') {
        generateOverviewData();
      }

      toast.success(`Đã cập nhật ${section}`);
    } catch (error) {

      setDashboardData(prev => ({
        ...prev,
        [section]: { ...prev[section], loading: false, error }
      }));
      toast.error(`Không thể cập nhật ${section}`);
    }
  };

  // Render active tab content
  const renderTabContent = () => {


    const commonProps = {
      data: dashboardData,
      refreshData,
      user,
      profile: currentUserProfile
    };

    switch (activeTab) {
      case 'account':
        return <AccountTab {...commonProps} />;
      case 'analytics':
        return <AnalyticsTab {...commonProps} />;
      case 'links':
        return <LinksTab {...commonProps} />;
      case 'customize':
        return <CustomizeTab {...commonProps} />;
      case 'badges':
        return <BadgesTab {...commonProps} />;
      // Temporarily hidden features
      // case 'image-host':
      //   return <ImageHostTab {...commonProps} />;
      // case 'templates':
      //   return <TemplatesTab {...commonProps} />;
      case 'settings':
        return <SettingsTab {...commonProps} />;
      case 'premium':
        return <PremiumTab {...commonProps} />;
      default:
        return <AccountTab {...commonProps} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Đang tải dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex relative">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        user={user}
        onLogout={logout}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarOpen
          ? 'lg:ml-64 ml-0' // On mobile, no margin when sidebar is open (overlay)
          : 'lg:ml-16 ml-0'  // On mobile, no margin when sidebar is closed
      }`}>
        {/* Header */}
        <DashboardHeader
          user={user}
          profile={currentUserProfile}
          activeTab={activeTab}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onRefresh={() => refreshData(activeTab)}
        />

        {/* Tab Content */}
        <main className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;